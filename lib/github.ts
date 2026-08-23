export interface GitHubCommitItem {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  private: boolean;
  stargazers_count: number;
  updated_at: string;
}

export function parseGitHubRepoUrl(input: string): { owner: string; repo: string } | null {
  if (!input) return null;
  const clean = input.trim().replace(/\/$/, "");

  // Match full URL: https://github.com/owner/repo
  const urlMatch = clean.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  }

  // Match owner/repo string
  const repoMatch = clean.match(/^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)$/);
  if (repoMatch) {
    return { owner: repoMatch[1], repo: repoMatch[2] };
  }

  return null;
}

export async function fetchGitHubCommits({
  owner,
  repo,
  token,
  branch,
  perPage = 30,
}: {
  owner: string;
  repo: string;
  token?: string;
  branch?: string;
  perPage?: number;
}) {
  const authToken = token || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "StampLog-App",
  };

  if (authToken) {
    headers["Authorization"] = `token ${authToken}`;
  }

  const branchParam = branch ? `?sha=${encodeURIComponent(branch)}&per_page=${perPage}` : `?per_page=${perPage}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/commits${branchParam}`;

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
  }

  const commitsData: GitHubCommitItem[] = await res.json();

  const formattedCommits = commitsData
    .map((c) => {
      const firstLine = c.commit.message.split("\n")[0];
      const shortSha = c.sha.substring(0, 7);
      const author = c.commit.author.name;
      return `${firstLine} (${shortSha} by ${author})`;
    })
    .join("\n");

  return {
    rawCommits: formattedCommits,
    commitCount: commitsData.length,
    commits: commitsData,
  };
}

export async function fetchUserGitHubRepos({
  username,
  token,
}: {
  username?: string;
  token?: string;
}) {
  const authToken = token || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "StampLog-App",
  };

  if (authToken) {
    headers["Authorization"] = `token ${authToken}`;
  }

  const url = username
    ? `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`
    : `https://api.github.com/user/repos?sort=updated&per_page=30`;

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
  }

  const repos: GitHubRepoItem[] = await res.json();
  return repos;
}
