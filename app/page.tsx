import Link from "next/link";
import {
  BroadcastIcon,
  SparkleIcon,
  PaletteIcon,
  GithubLogoIcon,
  LockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  UserIcon,
  CodeIcon,
  ShieldWarningIcon,
  GlobeIcon,
  LightningIcon,
  GitBranchIcon,
  GitCommitIcon,
  TerminalIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Vercel Navigation Bar */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center">
        <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[#171717] dark:text-white hover:opacity-80 transition-opacity"
            >
              {/* Vercel Geometric Triangle Logo with Stamp Accent */}
              <div className="h-6 w-6 bg-[#171717] dark:bg-white flex items-center justify-center rounded-[3px]">
                <svg
                  className="h-3.5 w-3.5 fill-white dark:fill-black"
                  viewBox="0 0 76 65"
                  aria-hidden="true"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>
              <span className="font-semibold text-sm tracking-tight">
                stamplog
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-xs text-[#666666] dark:text-[#888888]">
              <a
                href="#features"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#perspectives"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Personas
              </a>
              <a
                href="#workflow"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Automation
              </a>
              <Link
                href="/design-system"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Design System
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs text-[#666666] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/app">
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3.5 text-xs font-medium gap-1.5"
              >
                <span>Launch Studio</span>
                <ArrowRightIcon className="h-3 w-3" weight="bold" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-[1100px] mx-auto w-full text-center space-y-6">
        {/* Pixel Kicker Badge */}
        <div className="flex items-center justify-center">
          <Badge
            variant="default"
            className="font-pixel text-[11px] px-3 py-1 gap-2 tracking-wider bg-white dark:bg-[#111111] border-[#ebebeb] dark:border-[#262626] shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0070f3] inline-block animate-pulse" />
            STAMPLOG ENGINE // RELEASE INTELLIGENCE
          </Badge>
        </div>

        {/* Crisp Monochromatic Headline */}
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#171717] dark:text-white max-w-4xl mx-auto leading-[1.08]">
          Transform raw Git logs into <br className="hidden sm:inline" />
          release notes stakeholders actually read.
        </h1>

        <p className="text-base sm:text-lg text-[#666666] dark:text-[#888888] max-w-2xl mx-auto leading-relaxed font-normal">
          StampLog synthesizes messy commit logs, PR titles, and release tags
          into benefit-driven changelogs tailored for Customers, Executives, and
          Engineering teams.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/app" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto px-6 h-10 gap-2 text-xs font-medium"
            >
              <BroadcastIcon className="h-4 w-4" weight="bold" />
              Launch Studio Workspace
              <ArrowRightIcon className="h-3.5 w-3.5" weight="bold" />
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-5 h-10 gap-2 text-xs font-medium"
            >
              <GithubLogoIcon className="h-4 w-4" weight="bold" />
              Continue with GitHub
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Terminal / Split Preview Showcase */}
      <section className="px-6 max-w-[1100px] mx-auto w-full pb-20">
        <div className="rounded-[6px] border border-[#ebebeb] dark:border-[#1f1f1f] bg-white dark:bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.02),0_12px_24px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Top Window Chrome */}
          <div className="h-10 px-4 bg-[#fafafa] dark:bg-[#111111] border-b border-[#ebebeb] dark:border-[#1f1f1f] flex items-center justify-between text-xs font-mono text-[#666666] dark:text-[#888888]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#e5e5e5] dark:bg-[#262626]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#e5e5e5] dark:bg-[#262626]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#e5e5e5] dark:bg-[#262626]" />
              </div>
              <span className="text-[11px] ml-2 text-[#8f8f8f]">
                stamplog-cli --synthesize --repo facebook/react
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-[#0070f3] bg-[#0070f3]/10 px-2 py-0.5 rounded-[3px]">
                LIVE PREVIEW
              </span>
            </div>
          </div>

          {/* 2-Column Split: Raw Commits -> 3-Persona Synthesized */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#ebebeb] dark:divide-[#1f1f1f]">
            {/* Left: Raw Commit Stream in Geist Mono */}
            <div className="lg:col-span-5 p-5 bg-[#fafafa] dark:bg-[#080808] font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#8f8f8f] uppercase font-sans font-medium tracking-wider pb-2 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <span className="flex items-center gap-1.5">
                  <GitCommitIcon className="h-3.5 w-3.5 text-[#171717] dark:text-white" weight="bold" />
                  Raw Git Input (Commits & PRs)
                </span>
                <span className="font-mono text-[10px]">main branch</span>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed text-[#4d4d4d] dark:text-[#a1a1aa]">
                <div className="p-2 rounded-[4px] bg-white dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]">
                  <span className="text-[#0070f3] font-semibold">feat(auth):</span>{" "}
                  add OAuth2 refresh token rotation #102
                  <div className="text-[10px] text-[#8f8f8f] mt-0.5">
                    commit 7f3a9e • 2h ago
                  </div>
                </div>

                <div className="p-2 rounded-[4px] bg-white dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]">
                  <span className="text-[#00876c] font-semibold">fix(perf):</span>{" "}
                  optimize Postgres indexes for query latency #105
                  <div className="text-[10px] text-[#8f8f8f] mt-0.5">
                    commit 3b2d1c • 4h ago
                  </div>
                </div>

                <div className="p-2 rounded-[4px] bg-white dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]">
                  <span className="text-[#ee0000] font-semibold">breaking(api):</span>{" "}
                  deprecate v1 auth headers, migrate to Bearer token
                  <div className="text-[10px] text-[#8f8f8f] mt-0.5">
                    commit 9a4f21 • 6h ago
                  </div>
                </div>

                <div className="p-2 rounded-[4px] bg-white dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]">
                  <span className="text-[#7928ca] font-semibold">ci(deploy):</span>{" "}
                  automated release dispatch webhook on git tag
                  <div className="text-[10px] text-[#8f8f8f] mt-0.5">
                    commit 1d8c4e • 8h ago
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Synthesized Multi-Audience Output */}
            <div className="lg:col-span-7 p-6 space-y-4 bg-white dark:bg-[#0a0a0a]">
              <div className="flex items-center justify-between pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="pixel">v2.4.0</Badge>
                    <Badge variant="user">Customer Shipped</Badge>
                  </div>
                  <h3 className="text-base font-medium text-[#171717] dark:text-[#ededed] mt-1">
                    Security Enhancements &amp; Performance Boost
                  </h3>
                </div>

                <span className="text-xs text-[#8f8f8f] font-mono">
                  Synthesized in 1.2s
                </span>
              </div>

              {/* Persona Segment Tabs */}
              <div className="space-y-3">
                {/* Customer View */}
                <div className="p-3 rounded-[4px] border border-[#ebebeb] dark:border-[#222222] bg-[#fafafa] dark:bg-[#111111] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#00876c] flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" weight="bold" /> Customer View
                    </span>
                    <span className="text-[10px] font-mono text-[#8f8f8f]">Plain Language</span>
                  </div>
                  <p className="text-xs text-[#4d4d4d] dark:text-[#a1a1aa] leading-relaxed">
                    Users will enjoy seamless automatic session continuation and 45% faster dashboard navigation loading speeds.
                  </p>
                </div>

                {/* Executive View */}
                <div className="p-3 rounded-[4px] border border-[#ebebeb] dark:border-[#222222] bg-[#fafafa] dark:bg-[#111111] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#bd5200] flex items-center gap-1.5">
                      <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" /> Executive Summary
                    </span>
                    <span className="text-[10px] font-mono text-[#8f8f8f]">Leadership</span>
                  </div>
                  <p className="text-xs text-[#4d4d4d] dark:text-[#a1a1aa] leading-relaxed">
                    Completes SOC-2 session security compliance and significantly reduces cloud database latency for enterprise customers.
                  </p>
                </div>

                {/* Developer View */}
                <div className="p-3 rounded-[4px] border border-[#ebebeb] dark:border-[#222222] bg-[#fafafa] dark:bg-[#111111] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#0070f3] flex items-center gap-1.5">
                      <CodeIcon className="h-3.5 w-3.5" weight="bold" /> Engineering Notes
                    </span>
                    <Badge variant="destructive" className="text-[10px] py-0 px-2">
                      Breaking
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-[#4d4d4d] dark:text-[#a1a1aa]">
                    <code>GET /v1/auth/*</code> requires <code>Authorization: Bearer &lt;token&gt;</code>. Migrate SDK to v2.4.0.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Personas Section */}
      <section
        id="perspectives"
        className="py-16 px-6 border-t border-[#ebebeb] dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#050505]"
      >
        <div className="max-w-[1100px] mx-auto space-y-10">
          <div className="text-left space-y-2 max-w-xl">
            <span className="font-pixel text-xs text-[#0070f3] tracking-wider uppercase">
              // ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#171717] dark:text-white">
              One source of truth. Three distinct lenses.
            </h2>
            <p className="text-sm text-[#666666] dark:text-[#888888] leading-relaxed">
              Different stakeholders need completely different information. StampLog analyzes commit structures and outputs three targeted views instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer */}
            <Card className="hover:border-[#8f8f8f] transition-colors">
              <CardHeader className="pb-3 space-y-2">
                <Badge variant="user" className="w-fit text-xs">
                  <UserIcon className="h-3.5 w-3.5" weight="bold" /> Customer View
                </Badge>
                <CardTitle className="text-base font-medium">
                  User-Facing Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed space-y-2">
                <p>
                  Filters out commit hashes, PR numbers, and internal refactors. Translates technical changes into tangible benefits and clear bug fixes.
                </p>
              </CardContent>
            </Card>

            {/* Executive */}
            <Card className="hover:border-[#8f8f8f] transition-colors">
              <CardHeader className="pb-3 space-y-2">
                <Badge variant="exec" className="w-fit text-xs">
                  <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" /> Executive View
                </Badge>
                <CardTitle className="text-base font-medium">
                  Strategic Milestone Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed space-y-2">
                <p>
                  A 2-sentence executive summary for VP and leadership syncs, paired with an audience impact breakdown metric bar.
                </p>
              </CardContent>
            </Card>

            {/* Engineering */}
            <Card className="hover:border-[#8f8f8f] transition-colors">
              <CardHeader className="pb-3 space-y-2">
                <Badge variant="dev" className="w-fit text-xs">
                  <CodeIcon className="h-3.5 w-3.5" weight="bold" /> Engineering View
                </Badge>
                <CardTitle className="text-base font-medium">
                  Breaking Changes &amp; Scopes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed space-y-2">
                <p>
                  Extracts API contract changes, migration instructions, and technical scope tags (<code>[Auth]</code>, <code>[CI/CD]</code>, <code>[DB]</code>).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features & Automation Section */}
      <section
        id="features"
        className="py-16 px-6 max-w-[1100px] mx-auto w-full space-y-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-[6px] bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] space-y-3 shadow-sm">
            <div className="h-8 w-8 rounded-[4px] bg-[#fafafa] dark:bg-[#171717] border border-[#ebebeb] dark:border-[#262626] flex items-center justify-center text-[#171717] dark:text-white">
              <GithubLogoIcon className="h-4 w-4" weight="bold" />
            </div>
            <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              Zero-Paste GitHub Sync
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
              Connect any GitHub repository (`owner/repo`) to stream commits automatically via the GitHub REST API.
            </p>
          </div>

          <div className="p-5 rounded-[6px] bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] space-y-3 shadow-sm">
            <div className="h-8 w-8 rounded-[4px] bg-[#fafafa] dark:bg-[#171717] border border-[#ebebeb] dark:border-[#262626] flex items-center justify-center text-[#00876c]">
              <GlobeIcon className="h-4 w-4" weight="bold" />
            </div>
            <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              Public Changelog Pages &amp; RSS
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
              Publish SEO-optimized changelog feeds (<code>/p/[slug]/[version]</code>) with built-in RSS and OpenGraph image cards.
            </p>
          </div>

          <div className="p-5 rounded-[6px] bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] space-y-3 shadow-sm">
            <div className="h-8 w-8 rounded-[4px] bg-[#fafafa] dark:bg-[#171717] border border-[#ebebeb] dark:border-[#262626] flex items-center justify-center text-[#0070f3]">
              <LightningIcon className="h-4 w-4" weight="bold" />
            </div>
            <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              Automated GitHub Action Relay
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
              Trigger release synthesis on every <code>git push --tags</code> via GitHub Actions using the webhook endpoint.
            </p>
          </div>
        </div>

        {/* GitHub Action Code Snippet Showcase */}
        <div
          id="workflow"
          className="rounded-[6px] border border-[#ebebeb] dark:border-[#1f1f1f] bg-[#0a0a0a] text-white p-5 font-mono text-xs space-y-3"
        >
          <div className="flex items-center justify-between text-[11px] text-[#888888] pb-2 border-b border-[#222222]">
            <span className="flex items-center gap-2">
              <TerminalIcon className="h-3.5 w-3.5 text-[#0070f3]" weight="bold" />
              .github/workflows/stamplog-release.yml
            </span>
            <span className="font-pixel text-[10px] text-[#50e3c2]">WEBHOOK AUTOMATION</span>
          </div>
          <pre className="overflow-x-auto text-[#d4d4d4] text-[11px] leading-relaxed">
{`name: StampLog Release Notes
on:
  push:
    tags: ['v*']
jobs:
  synthesize:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger StampLog Webhook
        run: |
          curl -X POST https://stamplog.dev/api/v1/automate \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer \${{ secrets.STAMPLOG_API_KEY }}" \\
            -d '{"projectSlug": "demo", "repo": "\${{ github.repository }}"}'`}
          </pre>
        </div>
      </section>

      {/* Vercel Clean Footer */}
      <footer className="border-t border-[#ebebeb] dark:border-[#1f1f1f] py-8 px-6 text-xs text-[#666666] dark:text-[#888888] mt-auto bg-white dark:bg-black">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#171717] dark:text-white tracking-tight">
              stamplog
            </span>
            <span>•</span>
            <span>Release Intelligence Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/app"
              className="hover:text-[#171717] dark:hover:text-white transition-colors"
            >
              Studio
            </Link>
            <Link
              href="/projects/import"
              className="hover:text-[#171717] dark:hover:text-white transition-colors"
            >
              Import Repository
            </Link>
            <Link
              href="/design-system"
              className="hover:text-[#171717] dark:hover:text-white transition-colors"
            >
              Design System
            </Link>
            <a
              href="https://github.com/ThaminduDasanayake/relay"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171717] dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#00876c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00876c]" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
