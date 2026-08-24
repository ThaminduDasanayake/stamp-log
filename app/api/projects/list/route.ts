import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { releaseNotes: true },
        },
        releaseNotes: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { version: true, publishedAt: true, createdAt: true },
        },
      },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      githubRepo: p.githubRepo,
      defaultBranch: p.defaultBranch || "main",
      releaseCount: p._count.releaseNotes,
      latestVersion: p.releaseNotes[0]?.version || null,
      lastShippedAt: p.releaseNotes[0]?.publishedAt || p.releaseNotes[0]?.createdAt || null,
      publicUrl: `/p/${p.slug}`,
    }));

    return Response.json({ success: true, projects: formatted });
  } catch (error: any) {
    console.error("Error fetching projects list:", error);
    return Response.json({ success: false, projects: [] }, { status: 500 });
  }
}
