import { fetchUserGitHubRepos } from "@/lib/github";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { username, token } = await req.json();

    const repos = await fetchUserGitHubRepos({ username, token });

    const formatted = repos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      htmlUrl: r.html_url,
      description: r.description,
      defaultBranch: r.default_branch,
      isPrivate: r.private,
      stars: r.stargazers_count,
    }));

    return Response.json({ success: true, repos: formatted });
  } catch (error: any) {
    console.error("Error fetching user repos:", error);
    return Response.json(
      { success: false, error: error?.message || "Failed to fetch GitHub repositories" },
      { status: 500 }
    );
  }
}
