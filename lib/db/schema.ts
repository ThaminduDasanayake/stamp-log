import { pgTable, text, timestamp, pgEnum, jsonb, index, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";

export const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(768)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string | number[]): number[] {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const cleaned = value.replace(/^\[|\]$/g, "");
        if (!cleaned) return [];
        return cleaned.split(",").map(Number);
      } catch {
        return [];
      }
    }
    return [];
  },
});

export const releaseStatusEnum = pgEnum("ReleaseStatus", ["DRAFT", "REVIEW", "PUBLISHED"]);

export const organizations = pgTable("Organization", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const projects = pgTable(
  "Project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orgId: text("orgId")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    githubRepo: text("githubRepo"),
    defaultBranch: text("defaultBranch").default("main"),
    toneGuide: text("toneGuide"),
    customPrompt: text("customPrompt"),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("Project_orgId_slug_key").on(table.orgId, table.slug),
  ]
);

export interface HighlightItem {
  feature: string;
  benefit: string;
}

export interface BreakingChangeItem {
  target: string;
  migrationStep: string;
}

export interface TechnicalUpdateItem {
  scope: string;
  detail: string;
}

export const releaseNotes = pgTable(
  "ReleaseNote",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    projectId: text("projectId")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    version: text("version").notNull(),
    title: text("title").notNull(),
    rawCommits: text("rawCommits").notNull(),
    executiveSummary: text("executiveSummary").notNull(),
    userHighlights: jsonb("userHighlights").$type<HighlightItem[]>().notNull(),
    userFixes: jsonb("userFixes").$type<string[]>().notNull(),
    breakingChanges: jsonb("breakingChanges").$type<BreakingChangeItem[]>().notNull(),
    technicalUpdates: jsonb("technicalUpdates").$type<TechnicalUpdateItem[]>().notNull(),
    embedding: vector("embedding"),
    status: releaseStatusEnum("status").default("DRAFT").notNull(),
    publishedAt: timestamp("publishedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("ReleaseNote_projectId_version_idx").on(table.projectId, table.version),
  ]
);

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.orgId],
    references: [organizations.id],
  }),
  releaseNotes: many(releaseNotes),
}));

export const releaseNotesRelations = relations(releaseNotes, ({ one }) => ({
  project: one(projects, {
    fields: [releaseNotes.projectId],
    references: [projects.id],
  }),
}));

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ReleaseNote = typeof releaseNotes.$inferSelect;
export type NewReleaseNote = typeof releaseNotes.$inferInsert;
