import { z } from "zod";

export const ChangelogSchema = z.object({
  version: z
    .string()
    .describe("Inferred semantic version increment (e.g., v1.4.0)"),
  title: z
    .string()
    .describe("Catchy executive release title capturing main release theme"),
  executiveSummary: z
    .string()
    .describe(
      "2-sentence high-level summary tailored for leadership and stakeholders",
    ),
  userFacing: z.object({
    highlights: z.array(
      z.object({
        feature: z.string().describe("Feature name"),
        benefit: z.string().describe("Why this matters to the customer / user"),
      }),
    ),
    fixes: z
      .array(z.string())
      .describe("Bugs resolved explained with user impact"),
  }),
  developerFacing: z.object({
    breakingChanges: z.array(
      z.object({
        target: z.string().describe("Affected API, module, or database column"),
        migrationStep: z.string().describe("Required action by engineers"),
      }),
    ),
    technicalUpdates: z.array(
      z.object({
        scope: z
          .string()
          .describe("Internal scope e.g., CI/CD, Auth, Cache, DB"),
        detail: z.string().describe("Technical change explanation"),
      }),
    ),
  }),
});

export type ChangelogData = z.infer<typeof ChangelogSchema>;
