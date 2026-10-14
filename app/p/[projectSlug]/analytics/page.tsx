import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  BroadcastIcon,
  LightningIcon,
  CheckCircleIcon,
  ShieldWarningIcon,
  ArrowLeftIcon,
  ClockIcon,
  ChartBarIcon,
  UserIcon,
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
    title: `Analytics & Shipping Velocity — ${project?.name || "StampLog"}`,
  };
}

export default async function ProjectAnalyticsPage({ params }: PageProps) {
  const { projectSlug } = await params;

  const project = await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.slug, projectSlug),
    with: {
      releaseNotes: {
        orderBy: (r, { desc }) => [desc(r.createdAt)],
      },
    },
  });

  if (!project) {
    notFound();
  }

  const releases = project.releaseNotes || [];
  const publishedReleases = releases.filter((r) => r.status === "PUBLISHED");

  let totalFeatures = 0;
  let totalFixes = 0;
  let totalBreaking = 0;

  releases.forEach((r) => {
    totalFeatures += ((r.userHighlights as any[]) || []).length;
    totalFixes += ((r.userFixes as any[]) || []).length;
    totalBreaking += ((r.breakingChanges as any[]) || []).length;
  });

  const totalContentItems = totalFeatures + totalFixes + totalBreaking || 1;
  const featurePercent = Math.round((totalFeatures / totalContentItems) * 100);
  const fixPercent = Math.round((totalFixes / totalContentItems) * 100);
  const breakingPercent = Math.max(0, 100 - featurePercent - fixPercent);

  let avgDaysBetweenReleases = 3.5;
  if (publishedReleases.length > 1) {
    const dates = publishedReleases
      .map((r) =>
        r.publishedAt
          ? new Date(r.publishedAt).getTime()
          : new Date(r.createdAt).getTime(),
      )
      .sort((a, b) => b - a);
    const firstDate = dates[dates.length - 1];
    const lastDate = dates[0];
    const totalSpanDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    avgDaysBetweenReleases =
      Math.round((totalSpanDays / (publishedReleases.length - 1)) * 10) / 10 ||
      2.4;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Header */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="max-w-[1000px] w-full mx-auto flex items-center justify-between">
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
              <h1 className="text-sm font-medium tracking-tight text-[#171717] dark:text-white flex items-center gap-2">
                {project.name}
                <Badge variant="pixel" className="text-[10px]">
                  Analytics
                </Badge>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/p/${projectSlug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 text-[#666666] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" /> Project
                Feed
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Analytics Content */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
          <h2 className="text-2xl font-medium tracking-tight text-[#171717] dark:text-white">
            Release Analytics
          </h2>
          <p className="text-xs text-[#666666] dark:text-[#888888]">
            Deployment cadence, feature throughput, and breaking change metrics.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center justify-between">
                <span>Velocity</span>
                <LightningIcon className="h-3.5 w-3.5 text-[#0070f3]" weight="bold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono text-[#171717] dark:text-[#ededed]">
                {avgDaysBetweenReleases}{" "}
                <span className="text-xs font-normal text-[#8f8f8f]">
                  days/rel
                </span>
              </div>
              <p className="text-[11px] text-[#8f8f8f] mt-1">
                Average ship interval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center justify-between">
                <span>Releases</span>
                <CheckCircleIcon
                  className="h-3.5 w-3.5 text-[#00876c]"
                  weight="fill"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono text-[#171717] dark:text-[#ededed]">
                {publishedReleases.length}{" "}
                <span className="text-xs font-normal text-[#8f8f8f]">
                  shipped
                </span>
              </div>
              <p className="text-[11px] text-[#8f8f8f] mt-1">
                Total published versions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center justify-between">
                <span>Features</span>
                <UserIcon className="h-3.5 w-3.5 text-[#bd5200]" weight="bold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono text-[#171717] dark:text-[#ededed]">
                {totalFeatures}{" "}
                <span className="text-xs font-normal text-[#8f8f8f]">items</span>
              </div>
              <p className="text-[11px] text-[#8f8f8f] mt-1">
                Customer highlights shipped
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center justify-between">
                <span>Breaking</span>
                <ShieldWarningIcon
                  className="h-3.5 w-3.5 text-[#ee0000]"
                  weight="bold"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono text-[#171717] dark:text-[#ededed]">
                {totalBreaking}{" "}
                <span className="text-xs font-normal text-[#8f8f8f]">
                  changes
                </span>
              </div>
              <p className="text-[11px] text-[#8f8f8f] mt-1">
                Contract changes tracked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Ratio Breakdown */}
        <Card>
          <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center gap-2">
              <ChartBarIcon className="h-4 w-4 text-[#0070f3]" weight="bold" />
              Content Impact Ratio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="h-2 w-full rounded-full bg-[#f0f0f0] dark:bg-[#1a1a1a] overflow-hidden flex">
              <div
                style={{ width: `${featurePercent}%` }}
                className="bg-[#00876c] h-full transition-all"
              />
              <div
                style={{ width: `${fixPercent}%` }}
                className="bg-[#bd5200] h-full transition-all"
              />
              <div
                style={{ width: `${breakingPercent}%` }}
                className="bg-[#ee0000] h-full transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-1 text-xs font-mono text-[#666666] dark:text-[#888888]">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00876c] shrink-0" />
                <span>Features {featurePercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#bd5200] shrink-0" />
                <span>Fixes {fixPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#ee0000] shrink-0" />
                <span>Breaking {breakingPercent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
