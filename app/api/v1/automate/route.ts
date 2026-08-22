import { generateObject, embed } from "ai";
import { google } from "@ai-sdk/google";
import { ChangelogSchema } from "@/lib/schemas/changelog";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      rawCommits,
      version = "v1.0.0",
      projectSlug = "demo",
      projectName = "StampLog Project",
      status = "DRAFT",
    } = body;

    if (!rawCommits || typeof rawCommits !== "string") {
      return new Response("Missing required rawCommits payload string", { status: 400 });
    }

    // 1. Fetch or create project
    let project = await db.project.findFirst({
      where: { slug: projectSlug },
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
          orgId: org.id,
          name: projectName,
          slug: projectSlug,
          description: "Automated StampLog Workspace",
          toneGuide: "Professional, engaging for users, and technically clear for developers.",
        },
      });
    }

    const systemPrompt = `
      You are StampLog, an elite technical communicator and Product Lead for ${project.name}.
      Your job is to transform raw commit logs, PR titles, and ticket notes into high-quality, structured release documentation.
      
      TONE & STYLE GUIDE:
      ${project.toneGuide || "Professional, concise, engaging for users, and technically rigorous for developers."}
      
      RULES:
      1. Never expose raw internal commit hashes or developer names in the user-facing section.
      2. If a breaking change is detected, clearly specify the target module and migration path.
      3. Lead user-facing highlights with clear user benefits rather than implementation details.
    `;

    // 2. Generate structured changelog via Gemini 3.6 Flash synchronously
    const { object: changelog } = await generateObject({
      model: google("gemini-3.6-flash"),
      schema: ChangelogSchema,
      system: systemPrompt,
      prompt: `Analyze the following raw git commits and synthesize the structured changelog for version ${version}:\n\n${rawCommits}`,
    });

    // 3. Compute vector embedding (text-embedding-004)
    let embeddingVector: number[] | null = null;
    try {
      const textToEmbed = `${changelog.title}\n${changelog.executiveSummary}\n${JSON.stringify(changelog.userFacing.highlights)}`;
      const { embedding } = await embed({
        model: google.textEmbeddingModel("text-embedding-004"),
        value: textToEmbed,
      });
      embeddingVector = embedding;
    } catch (embedError) {
      console.warn("Embedding generation skipped:", embedError);
    }

    // 4. Save ReleaseNote to PostgreSQL
    const releaseNote = await db.releaseNote.create({
      data: {
        projectId: project.id,
        version: changelog.version || version,
        title: changelog.title || "New Automated Release",
        rawCommits,
        executiveSummary: changelog.executiveSummary || "",
        userHighlights: changelog.userFacing.highlights || [],
        userFixes: changelog.userFacing.fixes || [],
        breakingChanges: changelog.developerFacing.breakingChanges || [],
        technicalUpdates: changelog.developerFacing.technicalUpdates || [],
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    if (embeddingVector && embeddingVector.length === 768) {
      try {
        const vectorString = `[${embeddingVector.join(",")}]`;
        await db.$executeRawUnsafe(
          `UPDATE "ReleaseNote" SET embedding = $1::vector WHERE id = $2`,
          vectorString,
          releaseNote.id
        );
      } catch (sqlErr) {
        console.warn("Vector insertion skipped:", sqlErr);
      }
    }

    return Response.json({
      success: true,
      message: "Automated release successfully synthesized and saved!",
      release: {
        id: releaseNote.id,
        version: releaseNote.version,
        title: releaseNote.title,
        status: releaseNote.status,
        publicUrl: `/p/${project.slug}/${encodeURIComponent(releaseNote.version)}`,
        changelog,
      },
    });
  } catch (error) {
    console.error("Error in automated release ingestion:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
