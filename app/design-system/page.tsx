"use client";

import {
  ArrowUpRightIcon,
  BookmarkSimpleIcon,
  BriefcaseIcon,
  BroadcastIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  CompassIcon,
  FunnelIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  LightningIcon,
  PackageIcon,
  RocketLaunchIcon,
  ShareNetworkIcon,
  ShieldWarningIcon,
  SlidersIcon,
  SparkleIcon,
  TagIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F6] text-foreground p-4 sm:p-8 font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header / Brand Banner */}
        <header className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
                <BroadcastIcon className="h-6 w-6" weight="bold" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                stamplog
              </h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Automated Release Intelligence & Multi-Audience Synthesis Engine
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="dev" className="px-3 py-1 text-xs">
              <SparkleIcon className="h-3.5 w-3.5" weight="fill" /> Design
              System v1.0
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono">
              @phosphor-icons/react ONLY
            </Badge>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Brand & Colors & Spacing) - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* BRAND SPEC */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-primary" weight="bold" />{" "}
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-xl bg-muted/60 border border-border/60 text-center">
                  <span className="text-2xl font-black tracking-tight text-foreground">
                    stamplog
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Official AI release notes from raw git logs
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  StampLog transforms raw Git commit strings and PR notes into
                  structured release notes for Leadership, Customers, and
                  Developers.
                </p>
              </CardContent>
            </Card>

            {/* COLOR PALETTE */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Color Tokens & Semantics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Brand Colors */}
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Brand Primary
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    <div className="p-3 rounded-lg bg-[#4F46E5] text-white text-[11px] font-medium shadow-sm">
                      Indigo Primary
                      <br />
                      <span className="font-mono text-[10px] opacity-80">
                        #4F46E5
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#10B981] text-white text-[11px] font-medium shadow-sm">
                      Mint Accent
                      <br />
                      <span className="font-mono text-[10px] opacity-80">
                        #10B981
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#09090B] text-white text-[11px] font-medium shadow-sm border border-zinc-800">
                      Obsidian
                      <br />
                      <span className="font-mono text-[10px] opacity-80">
                        #09090B
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audience Semantics */}
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Audience Semantics
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[11px] font-medium">
                      Executive
                      <br />
                      <span className="font-mono text-[10px] opacity-80">
                        #F59E0B
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-[11px] font-medium">
                      Customer
                      <br />
                      <span className="font-mono text-[10px] opacity-80">
                        #10B981
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 text-[11px] font-medium">
                      Developer
                      <br />
                      <span className="font-mono text-[10px] opacity-80">
                        #6366F1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Neutrals */}
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Base Neutrals
                  </span>
                  <div className="grid grid-cols-4 gap-2 mt-1.5">
                    <div className="p-2 rounded-md bg-white border border-border text-center text-[10px] font-mono text-zinc-900 shadow-sm">
                      #FFFFFF
                    </div>
                    <div className="p-2 rounded-md bg-[#FAFAFA] border border-border text-center text-[10px] font-mono text-zinc-700">
                      #FAFAFA
                    </div>
                    <div className="p-2 rounded-md bg-[#F4F4F5] border border-border text-center text-[10px] font-mono text-zinc-700">
                      #F4F4F5
                    </div>
                    <div className="p-2 rounded-md bg-[#E4E4E7] border border-border text-center text-[10px] font-mono text-zinc-800">
                      #E4E4E7
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SPACING SYSTEM */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Spacing Scale (4px Base Unit)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end gap-2 h-16 pt-2">
                  {[
                    { label: "4px", h: "h-2", w: "w-4" },
                    { label: "8px", h: "h-4", w: "w-5" },
                    { label: "16px", h: "h-6", w: "w-6" },
                    { label: "24px", h: "h-8", w: "w-7" },
                    { label: "32px", h: "h-10", w: "w-8" },
                    { label: "40px", h: "h-12", w: "w-9" },
                    { label: "64px", h: "h-14", w: "w-10" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 flex-1"
                    >
                      <div
                        className={`${s.h} w-full bg-primary/20 rounded-sm border border-primary/40`}
                      />
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Typography & Icons & UI Components & Cards) - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* TYPOGRAPHY SCALE */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                  <span>Typography (Plus Jakarta Sans + Geist Mono)</span>
                  <span className="font-mono text-[10px] normal-case text-primary bg-accent px-2 py-0.5 rounded-full">
                    8 Hierarchy Levels
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60 text-sm">
                  <div className="p-3 bg-muted/40 grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground uppercase">
                    <span className="col-span-3">Style</span>
                    <span className="col-span-6">Preview</span>
                    <span className="col-span-3 text-right">Size / Weight</span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      H1 Page Title
                    </span>
                    <h1 className="col-span-6 text-2xl font-bold tracking-tight text-foreground">
                      StampLog Release Notes
                    </h1>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      32px / Bold
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      H2 Section Title
                    </span>
                    <h2 className="col-span-6 text-xl font-semibold text-foreground">
                      Synthesis Workbench
                    </h2>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      24px / SemiBold
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      H3 Module Title
                    </span>
                    <h3 className="col-span-6 text-base font-semibold text-foreground">
                      Executive Overview
                    </h3>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      20px / SemiBold
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      H4 Subheading
                    </span>
                    <h4 className="col-span-6 text-sm font-medium text-foreground">
                      Breaking Changes & API Mutations
                    </h4>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      16px / Medium
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      Body Large
                    </span>
                    <p className="col-span-6 text-sm font-normal text-foreground">
                      Strategic milestones and feature highlights.
                    </p>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      16px / Regular
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      Body Medium
                    </span>
                    <p className="col-span-6 text-xs font-normal text-muted-foreground">
                      Added OAuth2 refresh token rotation to auth module.
                    </p>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      14px / Regular
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      Caption
                    </span>
                    <p className="col-span-6 text-[11px] font-medium text-muted-foreground">
                      Published 2h ago • 14 commits analyzed
                    </p>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      11px / Medium
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-semibold text-xs text-muted-foreground">
                      Code Mono
                    </span>
                    <code className="col-span-6 font-mono text-xs bg-muted px-2 py-0.5 rounded text-indigo-600">
                      feat(auth): rotate token #102
                    </code>
                    <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                      13px / Mono
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PHOSPHOR ICONS SHOWCASE */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                  <span>Iconography (@phosphor-icons/react ONLY)</span>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    2px Stroke Line Style
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {[
                    { icon: GitCommitIcon, name: "GitCommit" },
                    { icon: GitPullRequestIcon, name: "GitPull" },
                    { icon: RocketLaunchIcon, name: "Rocket" },
                    { icon: LightningIcon, name: "Lightning" },
                    { icon: ShieldWarningIcon, name: "Warning" },
                    { icon: TagIcon, name: "Tag" },
                    { icon: BroadcastIcon, name: "Broadcast" },
                    { icon: SparkleIcon, name: "Sparkle" },
                    { icon: CompassIcon, name: "Compass" },
                    { icon: FunnelIcon, name: "Funnel" },
                    { icon: CheckCircleIcon, name: "Check" },
                    { icon: ClockIcon, name: "Clock" },
                    { icon: ShareNetworkIcon, name: "Share" },
                    { icon: CodeIcon, name: "Code" },
                    { icon: UserIcon, name: "User" },
                    { icon: BriefcaseIcon, name: "Executive" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-accent/50 hover:border-primary/40 transition-all text-foreground group"
                    >
                      <item.icon
                        className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-transform"
                        weight="bold"
                      />
                      <span className="text-[10px] font-mono mt-1.5 text-muted-foreground group-hover:text-foreground">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* UI PRIMITIVES & BUTTONS */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  UI Elements & Buttons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Button States */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Button Variants
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default">
                      <RocketLaunchIcon className="h-4 w-4" weight="bold" />{" "}
                      Primary Button
                    </Button>
                    <Button variant="secondary">
                      <SlidersIcon className="h-4 w-4" weight="bold" />{" "}
                      Secondary
                    </Button>
                    <Button variant="outline">
                      <ShareNetworkIcon className="h-4 w-4" weight="bold" />{" "}
                      Outline
                    </Button>
                    <Button variant="ghost">
                      <BookmarkSimpleIcon className="h-4 w-4" weight="bold" />{" "}
                      Ghost
                    </Button>
                    <Button variant="destructive">
                      <ShieldWarningIcon className="h-4 w-4" weight="bold" />{" "}
                      Delete
                    </Button>
                    <Button disabled variant="secondary">
                      Disabled
                    </Button>
                  </div>
                </div>

                {/* Badges & Category Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Audience Chips & Feature Pills
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="exec">
                      <BriefcaseIcon className="h-3 w-3" weight="bold" />{" "}
                      Executive View
                    </Badge>
                    <Badge variant="user">
                      <UserIcon className="h-3 w-3" weight="bold" /> End-User
                      Highlights
                    </Badge>
                    <Badge variant="dev">
                      <CodeIcon className="h-3 w-3" weight="bold" /> Developer
                      Migration
                    </Badge>
                    <Badge variant="outline">
                      <TagIcon className="h-3 w-3" weight="bold" /> v2.4.0
                    </Badge>
                    <Badge variant="destructive">
                      <ShieldWarningIcon className="h-3 w-3" weight="bold" />{" "}
                      Breaking Change
                    </Badge>
                  </div>
                </div>

                {/* Audience Breakdown Meter */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Audience Impact Meter
                  </span>
                  <AudienceMeter
                    execPercent={25}
                    userPercent={50}
                    devPercent={25}
                  />
                </div>
              </CardContent>
            </Card>

            {/* LIVE CARD EXAMPLE */}
            <Card className="border-indigo-500/20 shadow-md">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[11px] bg-muted/50"
                    >
                      v2.4.0
                    </Badge>
                    <Badge variant="user" className="text-[11px]">
                      <SparkleIcon className="h-3 w-3" weight="fill" /> AI
                      Synthesized
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2">
                    Performance Overhaul & OAuth2 SSO Launch
                  </CardTitle>
                </div>
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  Public Share{" "}
                  <ArrowUpRightIcon className="h-3.5 w-3.5" weight="bold" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This release introduces automated enterprise SSO integration,
                  cuts query latency by 45% using PostgreSQL index optimization,
                  and updates dev SDK migration paths.
                </p>

                {/* Segmented Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                      <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" />{" "}
                      Leadership
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unlocks SAML2 enterprise sales pipeline.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <UserIcon className="h-3.5 w-3.5" weight="bold" />{" "}
                      Customers
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dashboard loads 2x faster with smooth navigation.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                      <CodeIcon className="h-3.5 w-3.5" weight="bold" />{" "}
                      Developers
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Deprecated v1 auth header scheme.
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <GitCommitIcon
                        className="h-4 w-4 text-primary"
                        weight="bold"
                      />{" "}
                      18 commits
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" weight="bold" /> 2h ago
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircleIcon className="h-4 w-4" weight="bold" />{" "}
                    Published
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Design System Footer */}
        <footer className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground tracking-tight">
              stamplog
            </span>
            <span>•</span>
            <span>Design System & Architecture Specifications</span>
          </div>
          <span>Official release notes from raw git logs.</span>
        </footer>
      </div>
    </div>
  );
}
