import { db } from "@/lib/db";
import { parseGitHubRepoUrl, fetchGitHubCommits } from "@/lib/github";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { projectSlug = "stamplog" } = await req.json();

    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, projectSlug),
      with: {
        releaseNotes: {
          where: (r, { eq }) => eq(r.status, "PUBLISHED"),
          orderBy: (r, { desc }) => [desc(r.createdAt)],
          limit: 1,
        },
      },
    });

    if (!project || !project.githubRepo) {
      return Response.json({
        hasNewChanges: false,
        newCommitCount: 0,
        rawCommits: "",
        recentCommits: [],
      });
    }

    const parsed = parseGitHubRepoUrl(project.githubRepo);
    if (!parsed) {
      return Response.json({
        hasNewChanges: false,
        newCommitCount: 0,
        rawCommits: "",
        recentCommits: [],
      });
    }

    const { rawCommits, commitCount, commits } = await fetchGitHubCommits({
      owner: parsed.owner,
      repo: parsed.repo,
      branch: project.defaultBranch || "main",
      perPage: 15,
    });

    const latestRelease = project.releaseNotes[0];
    const lastShippedAt =
      latestRelease?.publishedAt || latestRelease?.createdAt;

    // Check if commits exist
    const hasNewChanges = commitCount > 0;

    const recentCommits = (commits || []).slice(0, 6).map((c) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message.split("\n")[0],
      author: c.commit.author?.name || "Developer",
      date: c.commit.author?.date,
    }));

    return Response.json({
      success: true,
      hasNewChanges,
      newCommitCount: commitCount,
      latestVersion: latestRelease?.version || "v1.0.0",
      lastShippedAt,
      rawCommits,
      recentCommits,
    });
  } catch (error: unknown) {
    console.error("Error checking GitHub updates:", error);
    return Response.json(
      {
        hasNewChanges: false,
        newCommitCount: 0,
        rawCommits: "",
        recentCommits: [],
      },
      { status: 500 },
    );
  }
}
