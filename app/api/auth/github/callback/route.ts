import { NextResponse } from "next/server";
import { exchangeGitHubCodeForToken, fetchGitHubUserProfile } from "@/lib/auth-github";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=missing_code", req.url));
    }

    const accessToken = await exchangeGitHubCodeForToken(code);
    const profile = await fetchGitHubUserProfile(accessToken);

    const userSession = {
      name: profile.name || profile.login,
      username: profile.login,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      accessToken,
      authenticated: true,
    };

    const response = NextResponse.redirect(new URL("/app", req.url));
    response.cookies.set("stamplog_session", JSON.stringify(userSession), {
      path: "/",
      maxAge: 86400 * 7,
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    console.error("Error in GitHub OAuth callback:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
}
