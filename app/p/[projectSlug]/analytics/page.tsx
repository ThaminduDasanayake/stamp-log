import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  Broadcast,
  Lightning,
  CheckCircle,
  ShieldWarning,
  ArrowLeft,
  Clock,
  ChartBar,
  User,
  Bug,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PageProps {
  params: Promise<{
    projectSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = await db.project.findFirst({ where: { slug: projectSlug } });
  return {
    title: `Analytics & Shipping Velocity — ${project?.name || "StampLog"}`,
  };
}

export default async function ProjectAnalyticsPage({ params }: PageProps) {
  const { projectSlug } = await params;

  const project = await db.project.findFirst({
    where: { slug: projectSlug },
    include: {
      releaseNotes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const releases = project.releaseNotes || [];
  const totalReleases = releases.length;
  const publishedReleases = releases.filter((r) => r.status === "PUBLISHED");
  const draftReleases = releases.filter((r) => r.status === "DRAFT");

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

  // Velocity calculation
  let avgDaysBetweenReleases = 3.5;
  if (publishedReleases.length > 1) {
    const dates = publishedReleases
      .map((r) => (r.publishedAt ? new Date(r.publishedAt).getTime() : new Date(r.createdAt).getTime()))
      .sort((a, b) => b - a);
    const firstDate = dates[dates.length - 1];
    const lastDate = dates[0];
    const totalSpanDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    avgDaysBetweenReleases = Math.round((totalSpanDays / (publishedReleases.length - 1)) * 10) / 10 || 2.4;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/p/${projectSlug}`} className="hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
                <Broadcast className="h-5 w-5" weight="bold" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {project.name}
                <Badge variant="dev" className="font-mono text-xs">
                  Analytics
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">Release Velocity &amp; Shipping Health Metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/p/${projectSlug}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-4 w-4" weight="bold" /> Project Changelogs
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Analytics Content */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="border-indigo-500/30 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Shipping Velocity</span>
                <Lightning className="h-4 w-4 text-primary" weight="bold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground font-mono">
                {avgDaysBetweenReleases} <span className="text-xs font-normal text-muted-foreground">days/release</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Average deployment interval</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/30 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Published Releases</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" weight="bold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground font-mono">
                {publishedReleases.length} <span className="text-xs font-normal text-muted-foreground">shipped</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Total live version tags</p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>User Features</span>
                <User className="h-4 w-4 text-amber-500" weight="bold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground font-mono">
                {totalFeatures} <span className="text-xs font-normal text-muted-foreground">highlights</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Customer value items shipped</p>
            </CardContent>
          </Card>

          <Card className="border-rose-500/30 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Breaking Changes</span>
                <ShieldWarning className="h-4 w-4 text-rose-500" weight="bold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground font-mono">
                {totalBreaking} <span className="text-xs font-normal text-muted-foreground">items</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Migration actions required</p>
            </CardContent>
          </Card>

        </div>

        {/* Content Ratio Breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-primary" weight="bold" />
              Content Impact Distribution Ratio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Visual Ratio Bar */}
            <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
              <div style={{ width: `${featurePercent}%` }} className="bg-emerald-500 h-full transition-all" />
              <div style={{ width: `${fixPercent}%` }} className="bg-amber-500 h-full transition-all" />
              <div style={{ width: `${breakingPercent}%` }} className="bg-rose-500 h-full transition-all" />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 pt-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
                <span>User Features ({featurePercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500 shrink-0" />
                <span>Bug Fixes ({fixPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500 shrink-0" />
                <span>Breaking Changes ({breakingPercent}%)</span>
              </div>
            </div>

          </CardContent>
        </Card>

      </main>
    </div>
  );
}
