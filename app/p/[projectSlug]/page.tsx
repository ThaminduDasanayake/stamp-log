import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  BroadcastIcon,
  CheckCircleIcon,
  TagIcon,
  ClockIcon,
  ArrowRightIcon,
  SparkleIcon,
  GlobeIcon,
  RssIcon,
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

  const project = await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.slug, projectSlug),
  });

  return {
    title: `${project?.name || "Project"} Changelog — StampLog`,
    description: `Public release history and changelog for ${project?.name || "project"}.`,
  };
}

export default async function PublicProjectReleasesPage({ params }: PageProps) {
  const { projectSlug } = await params;

  const project = await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.slug, projectSlug),
    with: {
      releaseNotes: {
        orderBy: (r, { desc }) => [desc(r.createdAt)],
      },
    },
  });

  const releases = project?.releaseNotes || [];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Public Header */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="max-w-[900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-6 w-6 bg-[#171717] dark:bg-white flex items-center justify-center rounded-[3px]">
                <svg
                  className="h-3.5 w-3.5 fill-white dark:fill-black"
                  viewBox="0 0 76 65"
                  aria-hidden="true"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>
            </Link>
            <div>
              <h1 className="text-sm font-medium tracking-tight text-[#171717] dark:text-white">
                {project?.name || "StampLog Project"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/p/${projectSlug}/rss.xml`} target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
              >
                <RssIcon className="h-3.5 w-3.5" weight="bold" /> RSS Feed
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="default" size="sm" className="h-8 px-3 text-xs">
                Launch Studio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Release Feed */}
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
          <h2 className="text-2xl font-medium tracking-tight text-[#171717] dark:text-white">
            Release Changelog
          </h2>
          <p className="text-xs text-[#666666] dark:text-[#888888]">
            Feature highlights, resolved issues, and migration notes.
          </p>
        </div>

        {/* Releases List */}
        {releases.length > 0 ? (
          <div className="space-y-4">
            {releases.map((rel) => (
              <Card
                key={rel.id}
                className="hover:border-[#8f8f8f] transition-all"
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="pixel" className="text-[10px]">
                        {rel.version}
                      </Badge>
                      <Badge variant="user" className="text-[11px]">
                        <CheckCircleIcon
                          className="h-3 w-3 text-[#00876c]"
                          weight="fill"
                        />
                        Published
                      </Badge>
                      {rel.publishedAt && (
                        <span className="text-[11px] font-mono text-[#8f8f8f] flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" weight="bold" />
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
                    <CardTitle className="text-base font-medium mt-1">
                      {rel.title}
                    </CardTitle>
                  </div>

                  <Link
                    href={`/p/${projectSlug}/${encodeURIComponent(rel.version)}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-xs gap-1 shrink-0 font-medium"
                    >
                      View Notes{" "}
                      <ArrowRightIcon className="h-3 w-3" weight="bold" />
                    </Button>
                  </Link>
                </CardHeader>

                <CardContent>
                  <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed line-clamp-2">
                    {rel.executiveSummary ||
                      "Continuous improvements and feature releases."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-3">
            <p className="text-sm font-medium text-[#171717] dark:text-white">
              No published releases yet.
            </p>
            <p className="text-xs text-[#666666] dark:text-[#888888]">
              Releases published in the Studio workspace will appear here.
            </p>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ebebeb] dark:border-[#1f1f1f] py-6 text-center text-xs text-[#8f8f8f]">
        <p>stamplog • Release Intelligence</p>
      </footer>
    </div>
  );
}
