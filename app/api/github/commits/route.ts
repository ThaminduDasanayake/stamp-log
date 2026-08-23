import { parseGitHubRepoUrl, fetchGitHubCommits } from "@/lib/github";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { repo, token, branch } = await req.json();

    if (!repo || typeof repo !== "string") {
      return Response.json({ success: false, error: "Missing repository string" }, { status: 400 });
    }

    const parsed = parseGitHubRepoUrl(repo);
    if (!parsed) {
      return Response.json(
        { success: false, error: "Invalid GitHub repository format (use owner/repo or github.com URL)" },
        { status: 400 }
      );
    }

    const { rawCommits, commitCount } = await fetchGitHubCommits({
      owner: parsed.owner,
      repo: parsed.repo,
      token,
      branch,
    });

    return Response.json({
      success: true,
      owner: parsed.owner,
      repo: parsed.repo,
      rawCommits,
      commitCount,
    });
  } catch (error: any) {
    console.error("Error in /api/github/commits:", error);
    return Response.json(
      { success: false, error: error?.message || "Failed to fetch GitHub commits" },
      { status: 500 }
    );
  }
}
