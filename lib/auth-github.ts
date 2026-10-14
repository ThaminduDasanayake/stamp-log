export interface GitHubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
}

export function getGitHubOAuthUrl(redirectUri?: string): string {
  const clientId = process.env.GITHUB_CLIENT_ID?.trim();
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

export async function exchangeGitHubCodeForToken(
  code: string,
  redirectUri?: string,
): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID?.trim();
  const clientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment variables",
    );
  }

  const payload: Record<string, string> = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
  };

  if (redirectUri) {
    payload.redirect_uri = redirectUri;
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`GitHub token exchange failed: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("🔑 GitHub OAuth Token Response:", {
    access_token: data.access_token ? "EXISTS" : "NONE",
    scope: data.scope,
    error: data.error,
    error_description: data.error_description,
  });

  if (data.error || !data.access_token) {
    throw new Error(
      data.error_description ||
        data.error ||
        "Failed to retrieve access_token from GitHub",
    );
  }

  return data.access_token;
}

export async function fetchGitHubUserProfile(
  accessToken: string,
): Promise<GitHubUserProfile> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "StampLog-App",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub user profile: ${res.statusText}`);
  }

  const profile: GitHubUserProfile = await res.json();

  // If public email is null, fetch primary verified email from /user/emails
  if (!profile.email) {
    try {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "StampLog-App",
        },
      });
      if (emailRes.ok) {
        const emails: {
          email: string;
          primary: boolean;
          verified: boolean;
        }[] = await emailRes.json();
        const primary =
          emails.find((e) => e.primary && e.verified) || emails[0];
        if (primary) {
          profile.email = primary.email;
        }
      }
    } catch (emailErr) {
      console.warn("Failed to fetch GitHub private emails:", emailErr);
    }
  }

  console.log("🔍 GitHub Fetched User Profile Data:", {
    id: profile.id,
    login: profile.login,
    name: profile.name,
    email: profile.email,
    avatar_url: profile.avatar_url,
  });

  return profile;
}
