import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectSlug = searchParams.get("projectSlug") || "stamplog";

    const project = await db.project.findFirst({
      where: { slug: projectSlug },
      include: {
        releaseNotes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return Response.json({ success: false, error: "Project Not Found" }, { status: 404 });
    }

    const releases = project.releaseNotes || [];
    const totalReleases = releases.length;
    const publishedReleases = releases.filter((r) => r.status === "PUBLISHED");
    const draftReleases = releases.filter((r) => r.status === "DRAFT");
    const reviewReleases = releases.filter((r) => r.status === "REVIEW");

    // Compute Category counts across all releases
    let totalHighlightsCount = 0;
    let totalFixesCount = 0;
    let totalBreakingCount = 0;

    releases.forEach((r) => {
      const h = (r.userHighlights as any[]) || [];
      const f = (r.userFixes as any[]) || [];
      const b = (r.breakingChanges as any[]) || [];
      totalHighlightsCount += h.length;
      totalFixesCount += f.length;
      totalBreakingCount += b.length;
    });

    // Compute Shipping Velocity (Average days between releases)
    let avgDaysBetweenReleases = 0;
    if (publishedReleases.length > 1) {
      const dates = publishedReleases
        .map((r) => (r.publishedAt ? new Date(r.publishedAt).getTime() : new Date(r.createdAt).getTime()))
        .sort((a, b) => b - a);

      const firstDate = dates[dates.length - 1];
      const lastDate = dates[0];
      const totalSpanDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
      avgDaysBetweenReleases = Math.round((totalSpanDays / (publishedReleases.length - 1)) * 10) / 10;
    }

    const breakingChangeReleaseCount = releases.filter((r) => {
      const b = (r.breakingChanges as any[]) || [];
      return b.length > 0;
    }).length;

    const breakingChangeRate = totalReleases > 0 ? Math.round((breakingChangeReleaseCount / totalReleases) * 100) : 0;

    return Response.json({
      success: true,
      project: {
        name: project.name,
        slug: project.slug,
        githubRepo: project.githubRepo,
      },
      analytics: {
        totalReleases,
        publishedCount: publishedReleases.length,
        draftCount: draftReleases.length,
        reviewCount: reviewReleases.length,
        avgDaysBetweenReleases: avgDaysBetweenReleases || 3.5,
        breakingChangeRate,
        categoryCounts: {
          features: totalHighlightsCount,
          fixes: totalFixesCount,
          breaking: totalBreakingCount,
        },
      },
    });
  } catch (error: any) {
    console.error("Error calculating project analytics:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
