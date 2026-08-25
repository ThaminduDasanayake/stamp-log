import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      releaseId,
      version,
      title,
      executiveSummary,
      userHighlights,
      userFixes,
      breakingChanges,
      technicalUpdates,
      status,
    } = body;

    if (!releaseId) {
      return Response.json({ success: false, error: "Missing releaseId parameter" }, { status: 400 });
    }

    // 1. Fetch existing ReleaseNote
    const existing = await db.releaseNote.findUnique({
      where: { id: releaseId },
      include: { project: true },
    });

    if (!existing) {
      return Response.json({ success: false, error: "Release note not found" }, { status: 404 });
    }

    // 2. Compute updated vector embedding (text-embedding-004)
    let embeddingVector: number[] | null = null;
    try {
      const textToEmbed = `${title || existing.title}\n${executiveSummary || ""}\n${JSON.stringify(userHighlights || [])}`;
      const { embedding } = await embed({
        model: google.textEmbeddingModel("text-embedding-004"),
        value: textToEmbed,
      });
      embeddingVector = embedding;
    } catch (embedError) {
      console.warn("Embedding re-computation skipped:", embedError);
    }

    // 3. Update ReleaseNote in PostgreSQL
    const updated = await db.releaseNote.update({
      where: { id: releaseId },
      data: {
        version: version || existing.version,
        title: title || existing.title,
        executiveSummary: executiveSummary !== undefined ? executiveSummary : existing.executiveSummary,
        userHighlights: userHighlights || existing.userHighlights,
        userFixes: userFixes || existing.userFixes,
        breakingChanges: breakingChanges || existing.breakingChanges,
        technicalUpdates: technicalUpdates || existing.technicalUpdates,
        status: status ? (status as any) : existing.status,
        publishedAt: status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });

    if (embeddingVector && embeddingVector.length === 768) {
      try {
        const vectorString = `[${embeddingVector.join(",")}]`;
        await db.$executeRawUnsafe(
          `UPDATE "ReleaseNote" SET embedding = $1::vector WHERE id = $2`,
          vectorString,
          updated.id
        );
      } catch (sqlErr) {
        console.warn("Vector update skipped:", sqlErr);
      }
    }

    return Response.json({
      success: true,
      message: "Release note successfully updated!",
      release: {
        id: updated.id,
        version: updated.version,
        title: updated.title,
        publicUrl: `/p/${existing.project.slug}/${encodeURIComponent(updated.version)}`,
      },
    });
  } catch (error: any) {
    console.error("Error updating release note:", error);
    return Response.json({ success: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
