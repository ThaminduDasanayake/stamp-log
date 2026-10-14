import { generateObject, embed } from "ai";
import { google } from "@ai-sdk/google";
import { ChangelogSchema } from "@/lib/schemas/changelog";
import { db, organizations, projects, releaseNotes } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Webhook Bearer Secret Verification (if STAMPLOG_WEBHOOK_SECRET is set)
    const webhookSecret = process.env.STAMPLOG_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.get("authorization");
      if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
        return Response.json({ success: false, error: "Unauthorized automated webhook token" }, { status: 401 });
      }
    }

    const body = await req.json();
    const {
      rawCommits,
      version = "v1.0.0",
      projectSlug = "demo",
      projectName = "StampLog Project",
      status = "DRAFT",
    } = body;

    if (!rawCommits || typeof rawCommits !== "string") {
      return Response.json({ success: false, error: "Missing required rawCommits payload string" }, { status: 400 });
    }

    // 2. Fetch or create project
    let project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, projectSlug),
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
          orgId: org.id,
          name: projectName,
          slug: projectSlug,
          description: "Automated StampLog Workspace",
          toneGuide: "Professional, engaging for users, and technically clear for developers.",
        })
        .returning();
      project = newProject;
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

    // 3. Generate structured changelog via Gemini 3.5 Flash Lite synchronously
    const { object: changelog } = await generateObject({
      model: google("gemini-3.5-flash-lite"),
      schema: ChangelogSchema,
      system: systemPrompt,
      prompt: `Analyze the following raw git commits and synthesize the structured changelog for version ${version}:\n\n${rawCommits}`,
    });

    // 4. Compute vector embedding (text-embedding-004)
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

    // 5. Save ReleaseNote to PostgreSQL
    const [releaseNote] = await db
      .insert(releaseNotes)
      .values({
        projectId: project.id,
        version: changelog.version || version,
        title: changelog.title || "New Automated Release",
        rawCommits,
        executiveSummary: changelog.executiveSummary || "",
        userHighlights: changelog.userFacing.highlights || [],
        userFixes: changelog.userFacing.fixes || [],
        breakingChanges: changelog.developerFacing.breakingChanges || [],
        technicalUpdates: changelog.developerFacing.technicalUpdates || [],
        embedding: embeddingVector && embeddingVector.length === 768 ? embeddingVector : null,
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      })
      .returning();

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
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
