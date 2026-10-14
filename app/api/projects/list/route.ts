import { db } from "@/lib/db";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  try {
    const projectsList = await db.query.projects.findMany({
      orderBy: (p, { desc }) => [desc(p.updatedAt)],
      with: {
        releaseNotes: {
          orderBy: (r, { desc }) => [desc(r.createdAt)],
          columns: {
            id: true,
            version: true,
            publishedAt: true,
            createdAt: true,
          },
        },
      },
    });

    const formatted = projectsList.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      githubRepo: p.githubRepo,
      defaultBranch: p.defaultBranch || "main",
      releaseCount: p.releaseNotes.length,
      latestVersion: p.releaseNotes[0]?.version || null,
      lastShippedAt:
        p.releaseNotes[0]?.publishedAt || p.releaseNotes[0]?.createdAt || null,
      publicUrl: `/p/${p.slug}`,
    }));

    return Response.json({ success: true, projects: formatted });
  } catch (error: any) {
    console.error("Error fetching projects list:", error);
    return Response.json({ success: false, projects: [] }, { status: 500 });
  }
}
