import { NextResponse } from "next/server";
import { getGitHubOAuthUrl, fetchGitHubUserProfile } from "@/lib/auth-github";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const githubToken = process.env.GITHUB_TOKEN;

  // 1. OAuth Redirect Flow (if GITHUB_CLIENT_ID is configured)
  if (clientId) {
    try {
      const url = getGitHubOAuthUrl();
      return NextResponse.redirect(url);
    } catch (err) {
      console.error("Error building GitHub OAuth URL:", err);
    }
  }

  // 2. Dynamic GitHub API Fetch Flow (if GITHUB_TOKEN is set in .env)
  if (githubToken) {
    try {
      const profile = await fetchGitHubUserProfile(githubToken);
      const userSession = {
        name: profile.name || profile.login,
        username: profile.login,
        email: profile.email || `${profile.login}@users.noreply.github.com`,
        avatarUrl: profile.avatar_url,
        authenticated: true,
      };

      console.log("🔐 Dynamic GitHub API User Session Fetched:", userSession);

      const response = NextResponse.redirect(new URL("/app", req.url));
      response.cookies.set("stamplog_session", JSON.stringify(userSession), {
        path: "/",
        maxAge: 86400 * 7,
        httpOnly: false,
      });
      return response;
    } catch (apiErr) {
      console.warn("Failed to fetch GitHub profile via GITHUB_TOKEN:", apiErr);
    }
  }

  // 3. Fallback: Prompt user to authenticate via GitHub
  return NextResponse.redirect(new URL("/login?error=no_github_credentials", req.url));
}
