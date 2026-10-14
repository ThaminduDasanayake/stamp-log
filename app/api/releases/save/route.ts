import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { db, organizations, projects, releaseNotes } from "@/lib/db";

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
    let project = await db.query.projects.findFirst({
      where: (p, { or, eq }) => or(eq(p.id, projectId), eq(p.slug, projectSlug)),
    });

    if (!project) {
      let org = await db.query.organizations.findFirst();
      if (!org) {
        const [newOrg] = await db
          .insert(organizations)
          .values({ name: "Default Organization", slug: "default-org" })
          .returning();
        org = newOrg;
      }

      const [newProject] = await db
        .insert(projects)
        .values({
          id: projectId === "demo" ? undefined : projectId,
          orgId: org.id,
          name: projectName,
          slug: projectSlug,
          description: "Default StampLog Project Workspace",
          toneGuide:
            "Professional, engaging for users, and technically clear for developers.",
        })
        .returning();
      project = newProject;
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

    // 3. Create ReleaseNote
    const [releaseNote] = await db
      .insert(releaseNotes)
      .values({
        projectId: project.id,
        version: version || "v1.0.0",
        title: title || "New Release",
        rawCommits: rawCommits || "",
        executiveSummary: executiveSummary || "",
        userHighlights: userHighlights || [],
        userFixes: userFixes || [],
        breakingChanges: breakingChanges || [],
        technicalUpdates: technicalUpdates || [],
        embedding: embeddingVector && embeddingVector.length === 768 ? embeddingVector : null,
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      })
      .returning();

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
