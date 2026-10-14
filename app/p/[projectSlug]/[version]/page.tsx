import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  db,
  HighlightItem,
  BreakingChangeItem,
  TechnicalUpdateItem,
} from "@/lib/db";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  PencilIcon,
  ShieldWarningIcon,
  TagIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";

interface PageProps {
  params: Promise<{
    projectSlug: string;
    version: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
    return { title: "Release Not Found — StampLog" };
  }

  const title = `${release.title} (${release.version}) — ${release.project.name}`;
  const description =
    release.executiveSummary ||
    `Official release notes and changelog for ${release.version} of ${release.project.name}.`;
  const ogImageUrl = `/p/${projectSlug}/${encodeURIComponent(release.version)}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicReleasePage({ params }: PageProps) {
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

  const userHighlights = (release.userHighlights as HighlightItem[]) || [];
  const userFixes = (release.userFixes as string[]) || [];
  const breakingChanges =
    (release.breakingChanges as BreakingChangeItem[]) || [];
  const technicalUpdates =
    (release.technicalUpdates as TechnicalUpdateItem[]) || [];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Public Header */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="max-w-[900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/p/${projectSlug}`}
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
              <Link href={`/p/${projectSlug}`} className="hover:underline">
                <h1 className="text-sm font-medium tracking-tight text-[#171717] dark:text-white flex items-center gap-2">
                  {release.project.name}
                  <Badge variant="pixel" className="text-[10px]">
                    {release.version}
                  </Badge>
                </h1>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/p/${projectSlug}/${encodeURIComponent(release.version)}/edit`}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs gap-1 font-medium"
              >
                <PencilIcon className="h-3 w-3" weight="bold" /> Edit
              </Button>
            </Link>
            <Link href={`/p/${projectSlug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs gap-1 text-[#666666] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
              >
                <ArrowLeftIcon className="h-3 w-3" weight="bold" /> Changelogs
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Release Content */}
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Title Header */}
        <div className="space-y-2 pb-6 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <Badge variant="user" className="text-[11px]">
              <CheckCircleIcon
                className="h-3 w-3 text-[#00876c]"
                weight="fill"
              />
              Published
            </Badge>
            {release.publishedAt && (
              <span className="text-[11px] font-mono text-[#8f8f8f] flex items-center gap-1">
                <ClockIcon className="h-3 w-3" weight="bold" />
                {new Date(release.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-medium tracking-tight text-[#171717] dark:text-white">
            {release.title}
          </h1>
        </div>

        {/* Executive Summary */}
        {release.executiveSummary && (
          <Card className="bg-[#fafafa] dark:bg-[#080808]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[#bd5200] uppercase tracking-wider flex items-center gap-1.5">
                <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#171717] dark:text-[#ededed] leading-relaxed">
                {release.executiveSummary}
              </p>
              <AudienceMeter
                execPercent={25}
                userPercent={50}
                devPercent={25}
                className="pt-2"
              />
            </CardContent>
          </Card>
        )}

        {/* Customer Highlights */}
        <div className="space-y-3">
          <h2 className="text-base font-medium text-[#171717] dark:text-white flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-[#00876c]" weight="bold" />
            Customer Highlights &amp; Improvements
          </h2>

          {userHighlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userHighlights.map((h, idx) => (
                <Card
                  key={idx}
                  className="hover:border-[#8f8f8f] transition-all"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-1.5">
                      <TagIcon
                        className="h-3.5 w-3.5 text-[#00876c]"
                        weight="bold"
                      />
                      {h?.feature || "Feature"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
                      {h?.benefit || "Detail"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8f8f8f] italic">
              No customer highlights for this release.
            </p>
          )}

          {/* User Fixes */}
          {userFixes.length > 0 && (
            <Card className="mt-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-[#666666] dark:text-[#888888] uppercase tracking-wider">
                  Resolved Issues &amp; Bug Fixes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-xs text-[#666666] dark:text-[#888888] space-y-1">
                  {userFixes.map((fix, idx) => (
                    <li key={idx}>{fix}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Developer Notes & Breaking Changes */}
        {(breakingChanges.length > 0 || technicalUpdates.length > 0) && (
          <div className="space-y-4 pt-4 border-t border-[#ebebeb] dark:border-[#1f1f1f]">
            <h2 className="text-base font-medium text-[#171717] dark:text-white flex items-center gap-2">
              <CodeIcon className="h-4 w-4 text-[#0070f3]" weight="bold" />
              Developer &amp; Technical Notes
            </h2>

            {breakingChanges.length > 0 && (
              <div className="p-3.5 rounded-[4px] bg-[#ee0000]/5 border border-[#ee0000]/20 space-y-2">
                <h3 className="text-xs font-medium text-[#ee0000] flex items-center gap-1.5">
                  <ShieldWarningIcon className="h-3.5 w-3.5" weight="bold" />
                  Breaking Changes
                </h3>
                {breakingChanges.map((b, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <code className="bg-white dark:bg-black px-1.5 py-0.5 rounded text-[#ee0000] font-mono text-[11px] border border-[#ee0000]/20">
                      {b?.target}
                    </code>
                    <p className="text-[#666666] dark:text-[#888888] pl-1">
                      {b?.migrationStep}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {technicalUpdates.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-[#666666] dark:text-[#888888] uppercase tracking-wider">
                    Infrastructure Scopes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {technicalUpdates.map((u, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222] flex items-start gap-2 text-xs"
                    >
                      <Badge
                        variant="dev"
                        className="font-mono text-[10px] shrink-0"
                      >
                        {u?.scope}
                      </Badge>
                      <span className="text-[#666666] dark:text-[#888888]">
                        {u?.detail}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[#ebebeb] dark:border-[#1f1f1f] py-6 text-center text-xs text-[#8f8f8f]">
        <p>stamplog • Release Intelligence</p>
      </footer>
    </div>
  );
}
