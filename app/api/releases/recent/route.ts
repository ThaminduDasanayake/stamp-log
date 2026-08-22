import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectSlug = searchParams.get("projectSlug") || "demo";

    const releases = await db.releaseNote.findMany({
      where: {
        project: { slug: projectSlug },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        version: true,
        title: true,
        rawCommits: true,
        executiveSummary: true,
        userHighlights: true,
        userFixes: true,
        breakingChanges: true,
        technicalUpdates: true,
        status: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    const formatted = releases.map((rel) => ({
      ...rel,
      publicUrl: `/p/${projectSlug}/${encodeURIComponent(rel.version)}`,
    }));

    return Response.json({ success: true, releases: formatted });
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    return Response.json({ success: false, releases: [] }, { status: 500 });
  }
}
