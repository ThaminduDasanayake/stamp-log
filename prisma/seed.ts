import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding StampLog database with sample projects and release notes...");

  // 1. Ensure Default Organization exists
  let org = await prisma.organization.findFirst({
    where: { slug: "default-org" },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "StampLog Core Team",
        slug: "default-org",
      },
    });
  }

  // 2. Create/Update StampLog Engine Project
  const stamplogProject = await prisma.project.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "stamplog" } },
    update: {
      name: "StampLog Engine",
      description: "Official release notes intelligence engine powered by AI",
      githubRepo: "ThaminduDasanayake/relay",
      defaultBranch: "main",
      toneGuide: "Professional, engaging for users, and technically concise for developers.",
    },
    create: {
      orgId: org.id,
      name: "StampLog Engine",
      slug: "stamplog",
      description: "Official release notes intelligence engine powered by AI",
      githubRepo: "ThaminduDasanayake/relay",
      defaultBranch: "main",
      toneGuide: "Professional, engaging for users, and technically concise for developers.",
    },
  });

  // Create/Update React Core Project
  const reactProject = await prisma.project.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "react" } },
    update: {
      name: "React Core Framework",
      description: "The library for web and native user interfaces",
      githubRepo: "facebook/react",
      defaultBranch: "main",
      toneGuide: "Developer-centric, precise, performance-oriented.",
    },
    create: {
      orgId: org.id,
      name: "React Core Framework",
      slug: "react",
      description: "The library for web and native user interfaces",
      githubRepo: "facebook/react",
      defaultBranch: "main",
      toneGuide: "Developer-centric, precise, performance-oriented.",
    },
  });

  // 3. Clear existing release notes for these sample projects to ensure fresh seed
  await prisma.releaseNote.deleteMany({
    where: {
      projectId: { in: [stamplogProject.id, reactProject.id] },
    },
  });

  // 4. Create Sample Releases for StampLog Engine
  await prisma.releaseNote.create({
    data: {
      projectId: stamplogProject.id,
      version: "v1.2.0",
      title: "StampLog v1.2.0: Rebranding, Multi-Audience AI Engine & pgvector Memory",
      rawCommits: `feat: implement shadcn UI system with custom components\nfeat(ai): upgrade streaming engine to Gemini 3.6 Flash\nfeat(db): initialize pgvector 768-dimension embeddings\nfix(mobile): resolve chart layout shift on mobile viewports`,
      executiveSummary:
        "StampLog v1.2.0 officially launches our automated release intelligence platform powered by Google Gemini 3.6 Flash and PostgreSQL vector memory. This milestone establishes zero-paste GitHub synchronization, interactive timeline dashboards, and automated multi-audience changelog synthesis.",
      userHighlights: [
        {
          feature: "Refreshed StampLog Identity & Timeline Dashboard",
          benefit: "Enjoy a modernized, high-performance workspace with project switchers and timeline feeds.",
        },
        {
          feature: "Zero-Paste GitHub Repo Sync",
          benefit: "Automatically fetch recent commit messages directly from any GitHub repository in 1 click.",
        },
        {
          feature: "Multi-Audience Views",
          benefit: "Toggle between Customer, Executive, and Engineering perspectives instantly.",
        },
      ],
      userFixes: [
        "Resolved layout shift issue on mobile viewports during AI streaming.",
        "Fixed copy-to-clipboard formatting for Markdown exports.",
      ],
      breakingChanges: [
        {
          target: "Package Metadata & Component Namespaces",
          migrationStep: "Update all import paths, package configuration metadata, and architectural references from 'relay' to 'stamplog'.",
        },
      ],
      technicalUpdates: [
        { scope: "AI / SDK", detail: "Upgraded streaming engine to Google Gemini 3.6 Flash with Zod schema contract validation." },
        { scope: "Database", detail: "Initialized PostgreSQL pgvector 768-dimension embeddings for semantic tone memory." },
        { scope: "UI System", detail: "Integrated shadcn UI component framework and Phosphor Icons." },
      ],
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
  });

  await prisma.releaseNote.create({
    data: {
      projectId: stamplogProject.id,
      version: "v1.1.0",
      title: "Interactive Inline Release Editor & GitHub Action Webhooks",
      rawCommits: `feat: add multi-persona inline release note editor\nfeat: add /api/v1/automate endpoint for GitHub Actions\nfix: sanitize user token inputs`,
      executiveSummary:
        "Introduced inline multi-persona release note editing and automated webhook endpoints for GitHub Actions CI/CD pipelines.",
      userHighlights: [
        {
          feature: "Interactive Inline Editor",
          benefit: "Edit titles, executive summaries, customer highlights, and breaking changes before publishing.",
        },
        {
          feature: "Automated GitHub Actions Webhook",
          benefit: "Trigger automated release notes on every git tag push using our /api/v1/automate endpoint.",
        },
      ],
      userFixes: [
        "Sanitized GitHub token headers to prevent unauthorized parameter injection.",
      ],
      breakingChanges: [],
      technicalUpdates: [
        { scope: "API / Webhook", detail: "Added Bearer token verification to /api/v1/automate endpoint." },
      ],
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
  });

  await prisma.releaseNote.create({
    data: {
      projectId: stamplogProject.id,
      version: "v1.0.0",
      title: "Initial Launch of StampLog AI Release Intelligence Platform",
      rawCommits: `Initial commit: create Next.js App Router workspace with Vercel AI SDK`,
      executiveSummary:
        "Initial release establishing the core Next.js App Router architecture, Google Gemini integration, and multi-audience changelog synthesis engine.",
      userHighlights: [
        {
          feature: "StampLog Core Platform",
          benefit: "AI-powered changelog synthesis built for developer teams.",
        },
      ],
      userFixes: [],
      breakingChanges: [],
      technicalUpdates: [
        { scope: "Core Engine", detail: "Initialized Next.js App Router workspace with TypeScript and Tailwind CSS." },
      ],
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
  });

  // 5. Create Sample Release for React Core Framework
  await prisma.releaseNote.create({
    data: {
      projectId: reactProject.id,
      version: "v19.0.0",
      title: "React 19 Core Engine: Server Components, Actions & useOptimistic",
      rawCommits: `feat: Add support for React Server Components\nfeat: Introduce React Actions and useActionState\nfeat: Add useOptimistic hook for optimistic UI updates`,
      executiveSummary:
        "React 19 introduces first-class support for Server Components, Actions, useOptimistic, and Asset Loading, delivering significant performance improvements for web applications.",
      userHighlights: [
        {
          feature: "React Server Components",
          benefit: "Render components on the server for faster initial page loads and smaller client JS bundle sizes.",
        },
        {
          feature: "Form Actions & Hooks",
          benefit: "Manage form state and optimistic UI updates automatically with built-in hooks.",
        },
      ],
      userFixes: [
        "Resolved hydration mismatch warnings for dynamic timestamps.",
      ],
      breakingChanges: [
        {
          target: "ReactDOM.render & hydrate",
          migrationStep: "Migrate to createRoot and hydrateRoot from react-dom/client.",
        },
      ],
      technicalUpdates: [
        { scope: "Compiler", detail: "Introduced React Compiler auto-memoization pipeline." },
      ],
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    },
  });

  console.log("✅ StampLog database successfully seeded with realistic sample release notes!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
