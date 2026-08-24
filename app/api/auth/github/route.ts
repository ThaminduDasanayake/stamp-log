import { NextResponse } from "next/server";
import { getGitHubOAuthUrl } from "@/lib/auth-github";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  // If real GitHub OAuth Client ID is provided, redirect to GitHub OAuth
  if (clientId) {
    try {
      const url = getGitHubOAuthUrl();
      return NextResponse.redirect(url);
    } catch (err) {
      console.error("Error building GitHub OAuth URL:", err);
    }
  }

  // Fallback Demo Login (Thamindu Dasanayake, @ThaminduDasanayake) when testing without GITHUB_CLIENT_ID
  const demoProfile = {
    name: "Thamindu Dasanayake",
    username: "ThaminduDasanayake",
    email: "thamindu@stamplog.dev",
    avatarUrl: "https://avatars.githubusercontent.com/u/8924719?v=4",
    authenticated: true,
  };

  const response = NextResponse.redirect(new URL("/app", req.url));
  response.cookies.set("stamplog_session", JSON.stringify(demoProfile), {
    path: "/",
    maxAge: 86400,
    httpOnly: false,
  });

  return response;
}
