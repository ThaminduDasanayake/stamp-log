export interface GitHubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
}

export function getGitHubOAuthUrl(redirectUri?: string): string {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing GITHUB_CLIENT_ID in environment variables");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "read:user user:email repo",
  });

  if (redirectUri) {
    params.set("redirect_uri", redirectUri);
  }

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGitHubCodeForToken(code: string): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET");
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub token exchange failed: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error || !data.access_token) {
    throw new Error(data.error_description || "Failed to retrieve access_token from GitHub");
  }

  return data.access_token;
}

export async function fetchGitHubUserProfile(accessToken: string): Promise<GitHubUserProfile> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "StampLog-App",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub user profile: ${res.statusText}`);
  }

  const profile: GitHubUserProfile = await res.json();
  return profile;
}
