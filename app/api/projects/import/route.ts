import { db, organizations, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { parseGitHubRepoUrl } from "@/lib/github";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const {
      repo,
      name,
      description,
      toneGuide,
      defaultBranch = "main",
    } = await req.json();

    if (!repo) {
      return Response.json(
        { success: false, error: "Missing repository string" },
        { status: 400 },
      );
    }

    const parsed = parseGitHubRepoUrl(repo);
    if (!parsed) {
      return Response.json(
        { success: false, error: "Invalid repository format" },
        { status: 400 },
      );
    }

    const fullRepo = `${parsed.owner}/${parsed.repo}`;
    const slug = (name || parsed.repo).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const projectName = name || parsed.repo;

    // Ensure Organization exists
    let org = await db.query.organizations.findFirst();
    if (!org) {
      const [newOrg] = await db
        .insert(organizations)
        .values({ name: "Default Organization", slug: "default-org" })
        .returning();
      org = newOrg;
    }

    // Upsert Project in PostgreSQL
    let project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, slug),
    });

    if (project) {
      const [updated] = await db
        .update(projects)
        .set({
          name: projectName,
          description: description || project.description,
          githubRepo: fullRepo,
          defaultBranch,
          toneGuide: toneGuide || project.toneGuide,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, project.id))
        .returning();
      project = updated;
    } else {
      const [created] = await db
        .insert(projects)
        .values({
          orgId: org.id,
          name: projectName,
          slug,
          description: description || `Connected to GitHub repo ${fullRepo}`,
          githubRepo: fullRepo,
          defaultBranch,
          toneGuide:
            toneGuide ||
            "Professional, concise, engaging for users, and technically rigorous for developers.",
        })
        .returning();
      project = created;
    }

    return Response.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        githubRepo: project.githubRepo,
        defaultBranch: project.defaultBranch,
        publicUrl: `/p/${project.slug}`,
      },
    });
  } catch (error: any) {
    console.error("Error importing project:", error);
    return Response.json(
      {
        success: false,
        error: error?.message || "Failed to import GitHub project",
      },
      { status: 500 },
    );
  }
}
