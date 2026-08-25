import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectId = "demo",
      projectSlug = "demo",
      projectName = "StampLog Demo",
      version,
      title,
      rawCommits,
      executiveSummary,
      userHighlights,
      userFixes,
      breakingChanges,
      technicalUpdates,
      status = "PUBLISHED",
    } = body;

    if (!version || !title || !rawCommits) {
      return new Response(
        "Missing required release fields (version, title, rawCommits)",
        { status: 400 },
      );
    }

    // 1. Ensure Organization & Project exist
    let project = await db.project.findFirst({
      where: { OR: [{ id: projectId }, { slug: projectSlug }] },
    });

    if (!project) {
      let org = await db.organization.findFirst();
      if (!org) {
        org = await db.organization.create({
          data: { name: "Default Organization", slug: "default-org" },
        });
      }

      project = await db.project.create({
        data: {
          id: projectId === "demo" ? undefined : projectId,
          orgId: org.id,
          name: projectName,
          slug: projectSlug,
          description: "Default StampLog Project Workspace",
          toneGuide:
            "Professional, engaging for users, and technically clear for developers.",
        },
      });
    }

    // 2. Compute vector embedding for historical tone memory (text-embedding-004 = 768 dimensions)
    let embeddingVector: number[] | null = null;
    try {
      const textToEmbed = `${title}\n${executiveSummary || ""}\n${JSON.stringify(userHighlights || [])}`;
      const { embedding } = await embed({
        model: google.textEmbeddingModel("text-embedding-004"),
        value: textToEmbed,
      });
      embeddingVector = embedding;
    } catch (embedError) {
      console.warn("Failed to generate embedding vector:", embedError);
    }

    // 3. Create or update ReleaseNote
    const releaseNote = await db.releaseNote.create({
      data: {
        projectId: project.id,
        version: version || "v1.0.0",
        title: title || "New Release",
        rawCommits: rawCommits || "",
        executiveSummary: executiveSummary || "",
        userHighlights: userHighlights || [],
        userFixes: userFixes || [],
        breakingChanges: breakingChanges || [],
        technicalUpdates: technicalUpdates || [],
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    // If embedding was computed, store via raw SQL for vector type
    if (embeddingVector && embeddingVector.length === 768) {
      try {
        const vectorString = `[${embeddingVector.join(",")}]`;
        await db.$executeRawUnsafe(
          `UPDATE "ReleaseNote" SET embedding = $1::vector WHERE id = $2`,
          vectorString,
          releaseNote.id,
        );
      } catch (vectorSqlError) {
        console.warn("Raw SQL vector insertion skipped:", vectorSqlError);
      }
    }

    return Response.json({
      success: true,
      releaseNoteId: releaseNote.id,
      projectSlug: project.slug,
      version: releaseNote.version,
      publicUrl: `/p/${project.slug}/${encodeURIComponent(releaseNote.version)}`,
    });
  } catch (error) {
    console.error("Error saving release note:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
