import { NextResponse } from "next/server";
import {
  exchangeGitHubCodeForToken,
  fetchGitHubUserProfile,
} from "@/lib/auth-github";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    const baseUrl =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(req.url).origin;

    if (error) {
      console.error("❌ GitHub OAuth error callback:", error, errorDescription);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(errorDescription || error)}`,
          baseUrl,
        ),
      );
    }

    if (!code) {
      console.warn("⚠️ GitHub callback invoked without authorization code");
      return NextResponse.redirect(
        new URL("/login?error=missing_code", baseUrl),
      );
    }

    const accessToken = await exchangeGitHubCodeForToken(code);
    const profile = await fetchGitHubUserProfile(accessToken);

    const userSession = {
      name: profile.name || profile.login,
      username: profile.login,
      email: profile.email || `${profile.login}@users.noreply.github.com`,
      avatarUrl: profile.avatar_url,
      accessToken,
      authenticated: true,
    };

    console.log(
      "🔐 GitHub OAuth Session Created (/api/auth/callback/github):",
      {
        username: userSession.username,
        email: userSession.email,
      },
    );

    const response = NextResponse.redirect(new URL("/app", baseUrl));
    response.cookies.set("stamplog_session", JSON.stringify(userSession), {
      path: "/",
      maxAge: 86400 * 7,
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error(
      "❌ Error in GitHub OAuth callback (/api/auth/callback/github):",
      error,
    );
    const baseUrl =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(req.url).origin;
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error?.message || "oauth_failed")}`,
        baseUrl,
      ),
    );
  }
}
