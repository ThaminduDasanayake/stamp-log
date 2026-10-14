import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectSlug = searchParams.get("projectSlug") || "demo";

    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, projectSlug),
      with: {
        releaseNotes: {
          orderBy: (r, { desc }) => [desc(r.createdAt)],
          limit: 10,
        },
      },
    });

    const releases = project?.releaseNotes || [];

    const formatted = releases.map((rel) => ({
      id: rel.id,
      version: rel.version,
      title: rel.title,
      rawCommits: rel.rawCommits,
      executiveSummary: rel.executiveSummary,
      userHighlights: rel.userHighlights,
      userFixes: rel.userFixes,
      breakingChanges: rel.breakingChanges,
      technicalUpdates: rel.technicalUpdates,
      status: rel.status,
      publishedAt: rel.publishedAt,
      createdAt: rel.createdAt,
      publicUrl: `/p/${projectSlug}/${encodeURIComponent(rel.version)}`,
    }));

    return Response.json({ success: true, releases: formatted });
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    return Response.json({ success: false, releases: [] }, { status: 500 });
  }
}
