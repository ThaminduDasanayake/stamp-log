import { db } from "@/lib/db";
import { parseGitHubRepoUrl } from "@/lib/github";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { repo, name, description, toneGuide, defaultBranch = "main" } = await req.json();

    if (!repo) {
      return Response.json({ success: false, error: "Missing repository string" }, { status: 400 });
    }

    const parsed = parseGitHubRepoUrl(repo);
    if (!parsed) {
      return Response.json({ success: false, error: "Invalid repository format" }, { status: 400 });
    }

    const fullRepo = `${parsed.owner}/${parsed.repo}`;
    const slug = (name || parsed.repo).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const projectName = name || parsed.repo;

    // Ensure Organization exists
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: { name: "Default Organization", slug: "default-org" },
      });
    }

    // Upsert Project in PostgreSQL
    let project = await db.project.findFirst({
      where: { slug },
    });

    if (project) {
      project = await db.project.update({
        where: { id: project.id },
        data: {
          name: projectName,
          description: description || project.description,
          githubRepo: fullRepo,
          defaultBranch,
          toneGuide: toneGuide || project.toneGuide,
        },
      });
    } else {
      project = await db.project.create({
        data: {
          orgId: org.id,
          name: projectName,
          slug,
          description: description || `Connected to GitHub repo ${fullRepo}`,
          githubRepo: fullRepo,
          defaultBranch,
          toneGuide:
            toneGuide ||
            "Professional, concise, engaging for users, and technically rigorous for developers.",
        },
      });
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
      { success: false, error: error?.message || "Failed to import GitHub project" },
      { status: 500 }
    );
  }
}
