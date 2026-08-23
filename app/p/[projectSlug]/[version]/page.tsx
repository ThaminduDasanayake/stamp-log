import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  Broadcast,
  CheckCircle,
  Briefcase,
  User,
  Code,
  ShieldWarning,
  ArrowLeft,
  Clock,
  GitCommit,
  Tag,
  ShareNetwork,
  Pencil,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  const release = await db.releaseNote.findFirst({
    where: {
      version: decodedVersion,
      project: { slug: projectSlug },
    },
    include: { project: true },
  });

  if (!release) {
    return { title: "Release Not Found — StampLog" };
  }

  return {
    title: `${release.title} (${release.version}) — ${release.project.name}`,
    description:
      release.executiveSummary ||
      `Changelog for ${release.version} of ${release.project.name}`,
  };
}

export default async function PublicReleasePage({ params }: PageProps) {
  const { projectSlug, version } = await params;
  const decodedVersion = decodeURIComponent(version);

  const release = await db.releaseNote.findFirst({
    where: {
      version: decodedVersion,
      project: { slug: projectSlug },
    },
    include: { project: true },
  });

  if (!release) {
    notFound();
  }

  const userHighlights = (release.userHighlights as any[]) || [];
  const userFixes = (release.userFixes as any[]) || [];
  const breakingChanges = (release.breakingChanges as any[]) || [];
  const technicalUpdates = (release.technicalUpdates as any[]) || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Public Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/p/${projectSlug}`}
              className="hover:opacity-80 transition-opacity"
            >
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
                <Broadcast className="h-5 w-5" weight="bold" />
              </div>
            </Link>
            <div>
              <Link href={`/p/${projectSlug}`} className="hover:underline">
                <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                  {release.project.name}
                  <Badge variant="outline" className="font-mono text-xs">
                    {release.version}
                  </Badge>
                </h1>
              </Link>
              <p className="text-xs text-muted-foreground">
                Official Customer Changelog & Release Notes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/p/${projectSlug}/${encodeURIComponent(release.version)}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-indigo-500/30 text-primary hover:bg-muted">
                <Pencil className="h-4 w-4" weight="bold" /> Edit Release
              </Button>
            </Link>
            <Link href={`/p/${projectSlug}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-4 w-4" weight="bold" /> All Releases
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Release Content Container */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Title & Metadata Header */}
        <div className="space-y-3 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="user" className="text-xs">
              <CheckCircle
                className="h-3.5 w-3.5 text-emerald-500"
                weight="fill"
              />
              Published Release
            </Badge>
            {release.publishedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" weight="bold" />
                {new Date(release.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {release.title}
          </h1>
        </div>

        {/* Executive Summary Card */}
        {release.executiveSummary && (
          <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4" weight="bold" /> Strategic
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm font-medium text-foreground leading-relaxed">
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

        {/* Customer Highlights Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-500" weight="bold" />
            Customer Highlights & Improvements
          </h2>

          {userHighlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userHighlights.map((h, idx) => (
                <Card
                  key={idx}
                  className="border-emerald-500/20 bg-card hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-500" weight="bold" />
                      {h?.feature || "Feature Feature"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {h?.benefit || "User benefit detail"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No customer highlights for this release.
            </p>
          )}

          {/* User Bug Fixes */}
          {userFixes.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Resolved Issues & Fixes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5">
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
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Code className="h-5 w-5 text-indigo-500" weight="bold" />
              Developer & Technical Notes
            </h2>

            {/* Breaking Changes */}
            {breakingChanges.length > 0 && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-3">
                <h3 className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-2">
                  <ShieldWarning className="h-4 w-4" weight="bold" /> Breaking
                  Changes
                </h3>
                {breakingChanges.map((b, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <code className="bg-background px-2 py-0.5 rounded text-destructive font-mono font-semibold">
                      {b?.target}
                    </code>
                    <p className="text-muted-foreground pl-3 border-l-2 border-destructive/40">
                      {b?.migrationStep}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Updates */}
            {technicalUpdates.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Infrastructure & Internal Scopes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {technicalUpdates.map((u, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-start gap-2.5 text-xs"
                    >
                      <Badge
                        variant="dev"
                        className="font-mono text-[10px] shrink-0"
                      >
                        {u?.scope}
                      </Badge>
                      <span className="text-muted-foreground">{u?.detail}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
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
