import { db } from "@/lib/db";
import { parseGitHubRepoUrl, fetchGitHubCommits } from "@/lib/github";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { projectSlug = "stamplog" } = await req.json();

    const project = await db.project.findFirst({
      where: { slug: projectSlug },
      include: {
        releaseNotes: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!project || !project.githubRepo) {
      return Response.json({
        hasNewChanges: false,
        newCommitCount: 0,
        rawCommits: "",
      });
    }

    const parsed = parseGitHubRepoUrl(project.githubRepo);
    if (!parsed) {
      return Response.json({
        hasNewChanges: false,
        newCommitCount: 0,
        rawCommits: "",
      });
    }

    const { rawCommits, commitCount } = await fetchGitHubCommits({
      owner: parsed.owner,
      repo: parsed.repo,
      branch: project.defaultBranch || "main",
      perPage: 15,
    });

    const latestRelease = project.releaseNotes[0];
    const lastShippedAt = latestRelease?.publishedAt || latestRelease?.createdAt;

    // Check if commits exist
    const hasNewChanges = commitCount > 0;

    return Response.json({
      success: true,
      hasNewChanges,
      newCommitCount: commitCount,
      latestVersion: latestRelease?.version || "v1.0.0",
      lastShippedAt,
      rawCommits,
    });
  } catch (error: any) {
    console.error("Error checking GitHub updates:", error);
    return Response.json(
      { hasNewChanges: false, newCommitCount: 0, rawCommits: "" },
      { status: 500 }
    );
  }
}
