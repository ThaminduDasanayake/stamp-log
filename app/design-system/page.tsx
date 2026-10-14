"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] p-4 sm:p-8 font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header / Brand Banner */}
        <header className="bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] rounded-[6px] p-5 sm:p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_0_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 bg-[#171717] dark:bg-white flex items-center justify-center rounded-[3px]">
                <svg
                  className="h-3.5 w-3.5 fill-white dark:fill-black"
                  viewBox="0 0 76 65"
                  aria-hidden="true"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>
              <h1 className="text-xl font-medium tracking-tight text-[#171717] dark:text-white">
                Vercel Design System
              </h1>
              <Badge variant="pixel" className="text-[10px]">
                GEIST SPEC
              </Badge>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#888888]">
              Minimalist, content-first design specifications for StampLog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/app">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs gap-1.5 font-medium"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" /> Back to
                Studio
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Brand & Colors) - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* BRAND & LOGO */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <CardTitle className="text-xs uppercase tracking-wider text-[#666666] dark:text-[#888888] font-medium flex items-center gap-2">
                  <PackageIcon
                    className="h-3.5 w-3.5 text-[#171717] dark:text-white"
                    weight="bold"
                  />
                  Brand Principles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="p-4 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222] text-center space-y-1">
                  <span className="font-pixel text-lg text-[#171717] dark:text-white">
                    STAMPLOG
                  </span>
                  <p className="text-[11px] font-mono text-[#8f8f8f]">
                    RELEASE INTELLIGENCE ENGINE
                  </p>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
                  Precision, generous breathing room, high contrast dark text on
                  near-white surfaces, and reserved accent moments.
                </p>
              </CardContent>
            </Card>

            {/* COLOR PALETTE */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <CardTitle className="text-xs uppercase tracking-wider text-[#666666] dark:text-[#888888] font-medium">
                  Color Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Primary & Base */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[#8f8f8f] uppercase">
                    Primary Neutrals
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-[4px] bg-[#171717] text-white text-[10px] font-mono border border-black">
                      Dark Text
                      <br />
                      #171717
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-white text-[#171717] text-[10px] font-mono border border-[#ebebeb]">
                      Surface
                      <br />
                      #FFFFFF
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-[#fafafa] text-[#171717] text-[10px] font-mono border border-[#ebebeb]">
                      Near-White
                      <br />
                      #FAFAFA
                    </div>
                  </div>
                </div>

                {/* Vercel Accents */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[#8f8f8f] uppercase">
                    Accent Accents
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-[4px] bg-[#0070f3] text-white text-[10px] font-mono">
                      Blue
                      <br />
                      #0070F3
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-[#7928ca] text-white text-[10px] font-mono">
                      Purple
                      <br />
                      #7928CA
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-[#00876c] text-white text-[10px] font-mono">
                      Teal
                      <br />
                      #00876C
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-[4px] bg-[#bd5200] text-white text-[10px] font-mono">
                      Orange
                      <br />
                      #BD5200
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-[#ee0000] text-white text-[10px] font-mono">
                      Error
                      <br />
                      #EE0000
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RADIUS SCALE */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <CardTitle className="text-xs uppercase tracking-wider text-[#666666] dark:text-[#888888] font-medium">
                  Radius Scale
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs font-mono text-[#666666] dark:text-[#888888]">
                <div className="flex items-center justify-between p-2 rounded-[4px] border border-[#ebebeb] dark:border-[#262626]">
                  <span>4px (Buttons, Inputs)</span>
                  <span className="h-4 w-8 rounded-[4px] bg-[#171717] dark:bg-white" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-[6px] border border-[#ebebeb] dark:border-[#262626]">
                  <span>6px (Cards, Modals)</span>
                  <span className="h-4 w-8 rounded-[6px] bg-[#171717] dark:bg-white" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-full border border-[#ebebeb] dark:border-[#262626]">
                  <span>9999px (Pills, Badges)</span>
                  <span className="h-4 w-8 rounded-full bg-[#171717] dark:bg-white" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Typography & Components) - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* TYPOGRAPHY SCALE: GEIST SANS, MONO, PIXEL */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex flex-row items-center justify-between">
                <CardTitle className="text-xs uppercase tracking-wider text-[#666666] dark:text-[#888888] font-medium">
                  Geist Typography Family
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Geist Sans
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Geist Mono
                  </Badge>
                  <Badge variant="pixel" className="text-[10px]">
                    Geist Pixel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="border border-[#ebebeb] dark:border-[#1f1f1f] rounded-[6px] overflow-hidden divide-y divide-[#ebebeb] dark:divide-[#1f1f1f] text-xs">
                  <div className="p-3 bg-[#fafafa] dark:bg-[#111111] grid grid-cols-12 gap-2 text-[11px] font-mono text-[#8f8f8f] uppercase">
                    <span className="col-span-3">Role</span>
                    <span className="col-span-6">Preview</span>
                    <span className="col-span-3 text-right">Font / Weight</span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-mono text-[#8f8f8f]">
                      Display Title
                    </span>
                    <h2 className="col-span-6 text-xl font-medium tracking-tight text-[#171717] dark:text-white">
                      Automated Release Notes
                    </h2>
                    <span className="col-span-3 text-right font-mono text-[#8f8f8f]">
                      GeistSans 500
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-mono text-[#8f8f8f]">
                      Section Header
                    </span>
                    <h3 className="col-span-6 text-base font-medium text-[#171717] dark:text-white">
                      Synthesize Multi-Audience
                    </h3>
                    <span className="col-span-3 text-right font-mono text-[#8f8f8f]">
                      GeistSans 500
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-mono text-[#8f8f8f]">
                      Body Prose
                    </span>
                    <p className="col-span-6 text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
                      Converts raw commits and PR titles into stakeholder notes.
                    </p>
                    <span className="col-span-3 text-right font-mono text-[#8f8f8f]">
                      GeistSans 400
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-mono text-[#8f8f8f]">
                      Code Snippet
                    </span>
                    <code className="col-span-6 font-mono text-[11px] text-[#0070f3] bg-[#0070f3]/8 px-2 py-0.5 rounded-[3px] w-fit">
                      git push origin v2.4.0 --tags
                    </code>
                    <span className="col-span-3 text-right font-mono text-[#8f8f8f]">
                      GeistMono 400
                    </span>
                  </div>

                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 font-mono text-[#8f8f8f]">
                      Pixel Badge
                    </span>
                    <div className="col-span-6">
                      <span className="font-pixel text-[11px] uppercase tracking-wider text-[#171717] dark:text-white bg-[#fafafa] dark:bg-[#111111] px-2 py-0.5 border border-[#ebebeb] dark:border-[#262626] rounded-[3px]">
                        [STAMPLOG // STABLE]
                      </span>
                    </div>
                    <span className="col-span-3 text-right font-mono text-[#8f8f8f]">
                      GeistPixel
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BUTTONS & BADGES */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <CardTitle className="text-xs uppercase tracking-wider text-[#666666] dark:text-[#888888] font-medium">
                  Buttons &amp; Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#8f8f8f] uppercase">
                    Buttons
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button variant="default">Primary CTA</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button disabled variant="secondary">
                      Disabled
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#8f8f8f] uppercase">
                    Status Badges
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="user">
                      <UserIcon className="h-3 w-3" weight="bold" /> Customer
                      View
                    </Badge>
                    <Badge variant="exec">
                      <BriefcaseIcon className="h-3 w-3" weight="bold" />{" "}
                      Executive
                    </Badge>
                    <Badge variant="dev">
                      <CodeIcon className="h-3 w-3" weight="bold" /> Engineering
                    </Badge>
                    <Badge variant="destructive">
                      <ShieldWarningIcon className="h-3 w-3" weight="bold" />{" "}
                      Breaking
                    </Badge>
                    <Badge variant="pixel">v2.4.0</Badge>
                  </div>
                </div>

                {/* Audience Meter */}
                <div className="pt-2 border-t border-[#ebebeb] dark:border-[#1f1f1f] space-y-2">
                  <span className="text-xs font-mono text-[#8f8f8f] uppercase">
                    Audience Meter Tracker
                  </span>
                  <AudienceMeter
                    execPercent={30}
                    userPercent={50}
                    devPercent={20}
                  />
                </div>
              </CardContent>
            </Card>

            {/* PHOSPHOR ICONS */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex flex-row items-center justify-between">
                <CardTitle className="text-xs uppercase tracking-wider text-[#666666] dark:text-[#888888] font-medium">
                  Iconography (@phosphor-icons/react ONLY)
                </CardTitle>
                <span className="font-mono text-[10px] text-[#00876c]">
                  Bold Stroke Style
                </span>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
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
                      className="flex flex-col items-center justify-center p-2.5 rounded-[4px] border border-[#ebebeb] dark:border-[#222222] bg-[#fafafa] dark:bg-[#111111] hover:border-[#8f8f8f] transition-all group"
                    >
                      <item.icon
                        className="h-4 w-4 text-[#666666] dark:text-[#888888] group-hover:text-[#171717] dark:group-hover:text-white"
                        weight="bold"
                      />
                      <span className="text-[10px] font-mono mt-1 text-[#8f8f8f] truncate w-full text-center">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] rounded-[6px] p-4 flex flex-col sm:flex-row justify-between items-center text-xs text-[#8f8f8f] gap-2">
          <span>stamplog • Vercel Design Specifications</span>
          <span>Geist Sans • Geist Mono • Geist Pixel</span>
        </footer>
      </div>
    </div>
  );
}
