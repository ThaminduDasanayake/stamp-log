import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { ChangelogSchema } from "@/lib/schemas/changelog";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { projectId, rawCommits } = await req.json();

    if (!rawCommits || typeof rawCommits !== "string") {
      return new Response("Missing or invalid rawCommits string", {
        status: 400,
      });
    }

    let projectInfo: {
      name?: string | null;
      toneGuide?: string | null;
      customPrompt?: string | null;
    } | null = null;

    // Gracefully query project tone if DB is configured and projectId provided
    if (projectId && process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/lib/db");
        projectInfo = await db.project.findUnique({
          where: { id: projectId },
          select: { name: true, toneGuide: true, customPrompt: true },
        });
      } catch (dbErr) {
        console.warn("Prisma DB lookup skipped or failed:", dbErr);
      }
    }

    const systemPrompt = `
      You are StampLog, an elite technical communicator and Product Lead for ${projectInfo?.name || "the software project"}.
      Your job is to transform raw commit logs, PR titles, and ticket notes into high-quality, structured release documentation.
      
      TONE & STYLE GUIDE:
      ${projectInfo?.toneGuide || "Professional, concise, engaging for users, and technically rigorous for developers."}
      
      ${projectInfo?.customPrompt ? `CUSTOM INSTRUCTIONS:\n${projectInfo.customPrompt}` : ""}
      
      RULES:
      1. Never expose raw internal commit hashes or developer names in the user-facing section.
      2. If a breaking change is detected, clearly specify the target module and migration path.
      3. Lead user-facing highlights with clear user benefits rather than implementation details.
    `;

    const result = streamObject({
      model: google("gemini-3.6-flash"),
      schema: ChangelogSchema,
      system: systemPrompt,
      prompt: `Analyze the following raw git commits / PR notes and synthesize the structured multi-audience changelog:

${rawCommits}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating changelog:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
