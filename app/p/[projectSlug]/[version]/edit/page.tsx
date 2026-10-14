import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InlineReleaseEditorClient } from "./editor-client";

interface PageProps {
  params: Promise<{
    projectSlug: string;
    version: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectSlug, version } = await params;
  const decodedVersion = decodeURIComponent(version);

  const project = await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.slug, projectSlug),
    with: {
      releaseNotes: {
        where: (r, { eq }) => eq(r.version, decodedVersion),
        limit: 1,
      },
    },
  });

  const releaseNote = project?.releaseNotes[0];
  const release = releaseNote && project ? { ...releaseNote, project } : null;

  return {
    title: `Edit Release ${release?.version || decodedVersion} — ${release?.project.name || "StampLog"}`,
  };
}

export default async function EditReleasePage({ params }: PageProps) {
  const { projectSlug, version } = await params;
  const decodedVersion = decodeURIComponent(version);

  const project = await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.slug, projectSlug),
    with: {
      releaseNotes: {
        where: (r, { eq }) => eq(r.version, decodedVersion),
        limit: 1,
      },
    },
  });

  const releaseNote = project?.releaseNotes[0];
  const release = releaseNote && project ? { ...releaseNote, project } : null;

  if (!release) {
    notFound();
  }

  return (
    <InlineReleaseEditorClient
      release={{
        id: release.id,
        version: release.version,
        title: release.title,
        status: release.status,
        executiveSummary: release.executiveSummary || "",
        userHighlights: (release.userHighlights as any[]) || [],
        userFixes: (release.userFixes as any[]) || [],
        breakingChanges: (release.breakingChanges as any[]) || [],
        technicalUpdates: (release.technicalUpdates as any[]) || [],
        projectSlug: release.project.slug,
        projectName: release.project.name,
      }}
    />
  );
}
