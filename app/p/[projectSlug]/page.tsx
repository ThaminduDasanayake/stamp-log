import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  Broadcast,
  CheckCircle,
  Tag,
  Clock,
  ArrowRight,
  Sparkle,
  Globe,
  Rss,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PageProps {
  params: Promise<{
    projectSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { projectSlug } = await params;

  const project = await db.project.findFirst({
    where: { slug: projectSlug },
  });

  return {
    title: `${project?.name || "Project"} Changelog Timeline — StampLog`,
    description: `Official public release history and changelog timeline for ${project?.name || "project"}.`,
  };
}

export default async function PublicProjectReleasesPage({ params }: PageProps) {
  const { projectSlug } = await params;

  const project = await db.project.findFirst({
    where: { slug: projectSlug },
    include: {
      releaseNotes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const releases = project?.releaseNotes || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Public Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
              <Broadcast className="h-5 w-5" weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {project?.name || "StampLog Project"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Public Release History & Changelogs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/p/${projectSlug}/rss.xml`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-muted">
                <Rss className="h-3.5 w-3.5" weight="bold" /> RSS Feed
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Sparkle className="h-3.5 w-3.5 text-primary" weight="bold" />{" "}
                AI Workbench
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Release Feed */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-8 space-y-8">
        <div className="space-y-2 border-b border-border pb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" weight="bold" />
            Release History Timeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore feature announcements, performance updates, and developer
            notes across all published versions.
          </p>
        </div>

        {/* Releases Timeline List */}
        {releases.length > 0 ? (
          <div className="space-y-6">
            {releases.map((rel) => (
              <Card
                key={rel.id}
                className="border-border hover:border-indigo-500/30 transition-all hover:shadow-md"
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs bg-muted"
                      >
                        {rel.version}
                      </Badge>
                      <Badge variant="user" className="text-xs">
                        <CheckCircle
                          className="h-3 w-3 text-emerald-500"
                          weight="fill"
                        />{" "}
                        Published
                      </Badge>
                      {rel.publishedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" weight="bold" />
                          {new Date(rel.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold mt-1 text-foreground">
                      {rel.title}
                    </CardTitle>
                  </div>

                  <Link
                    href={`/p/${projectSlug}/${encodeURIComponent(rel.version)}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs shrink-0"
                    >
                      View Release{" "}
                      <ArrowRight className="h-3.5 w-3.5" weight="bold" />
                    </Button>
                  </Link>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {rel.executiveSummary ||
                      "Continuous software improvements and feature announcements."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-3">
            <p className="text-sm font-medium text-foreground">
              No published releases found for this project yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Generate a new release note in the AI Workbench and click
              &quot;Save &amp; Publish&quot; to populate your changelog feed.
            </p>
            <Link href="/">
              <Button
                size="sm"
                variant="default"
                className="mt-2 gap-1.5 text-xs"
              >
                Open AI Workbench{" "}
                <ArrowRight className="h-3.5 w-3.5" weight="bold" />
              </Button>
            </Link>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">stamplog</p>
        <p className="mt-1 opacity-80">
          Official AI release notes from raw git logs.
        </p>
      </footer>
    </div>
  );
}
