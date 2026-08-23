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
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Top Marketing Navigation */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
              <BroadcastIcon className="h-6 w-6" weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">stamplog</h1>
              <p className="text-xs text-muted-foreground">Release Intelligence Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/design-system">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <PaletteIcon className="h-4 w-4 text-primary" weight="bold" />
                Design System
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <LockIcon className="h-4 w-4" weight="bold" />
                Sign In
              </Button>
            </Link>
            <Link href="/app">
              <Button size="sm" className="gap-1.5 text-xs shadow-md shadow-indigo-500/20">
                Launch App
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-[1000px] mx-auto space-y-6">
        <div className="flex items-center justify-center">
          <Badge variant="dev" className="px-3.5 py-1 text-xs gap-1.5">
            <SparkleIcon className="h-4 w-4" weight="fill" />
            Powered by Gemini 3.6 Flash &amp; pgvector
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
          Transform Raw Git Logs into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
            Multi-Audience Release Notes
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          StampLog automatically converts messy commit logs, PR titles, and release tags into structured, benefit-driven changelogs for Customers, Executives, and Engineering teams.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/app">
            <Button size="lg" className="w-full sm:w-auto px-8 gap-2 text-sm shadow-lg shadow-indigo-500/25">
              <BroadcastIcon className="h-5 w-5" weight="bold" />
              Launch Studio App
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 gap-2 text-sm">
              <LockIcon className="h-4 w-4" weight="bold" />
              Sign In to Account
            </Button>
          </Link>
        </div>
      </section>

      {/* 3-Persona Features Section */}
      <section className="py-16 px-6 bg-muted/40 border-y border-border">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One Input ➔ 3 Tailored Perspectives
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Different stakeholders need completely different information. StampLog synthesizes all three instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Customer View */}
            <Card className="border-emerald-500/30 bg-card shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <Badge variant="user" className="w-fit text-xs mb-1">
                  <UserIcon className="h-3.5 w-3.5" weight="bold" /> Customer View
                </Badge>
                <CardTitle className="text-lg font-bold">User-Facing Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Filters out commit hashes, author names, and PR numbers. Focuses purely on benefit-driven features and resolved bug fixes.
                </p>
              </CardContent>
            </Card>

            {/* Executive View */}
            <Card className="border-amber-500/30 bg-card shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <Badge variant="exec" className="w-fit text-xs mb-1">
                  <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" /> Executive View
                </Badge>
                <CardTitle className="text-lg font-bold">Strategic Milestone Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  A 2-sentence high-level executive summary for VPs and CEOs, paired with an interactive Audience Impact Breakdown Bar.
                </p>
              </CardContent>
            </Card>

            {/* Engineering View */}
            <Card className="border-indigo-500/30 bg-card shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <Badge variant="dev" className="w-fit text-xs mb-1">
                  <CodeIcon className="h-3.5 w-3.5" weight="bold" /> Engineering View
                </Badge>
                <CardTitle className="text-lg font-bold">Breaking Changes &amp; Scopes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Highlights affected API modules and required migration paths, alongside technical scope tags (`[CI/CD]`, `[Auth]`, `[DB]`).
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 px-6 max-w-[1200px] mx-auto w-full space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-primary">
              <GithubLogoIcon className="h-5 w-5" weight="bold" />
            </div>
            <h3 className="text-base font-bold">Zero-Paste GitHub Sync</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect any public or private GitHub repository (`owner/repo`) to fetch recent commits automatically via REST API.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-emerald-500">
              <GlobeIcon className="h-5 w-5" weight="bold" />
            </div>
            <h3 className="text-base font-bold">Public Changelog URLs</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Publish SEO-optimized changelog pages (`/p/[projectSlug]/[version]`) to share on Twitter/X, LinkedIn, or newsletters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-indigo-500">
              <LightningIcon className="h-5 w-5" weight="bold" />
            </div>
            <h3 className="text-base font-bold">Automated Webhooks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Trigger automated release notes on every `git tag` push via GitHub Actions using our `/api/v1/automate` endpoint.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-xs text-muted-foreground space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-foreground tracking-tight">stamplog</span>
          <span>•</span>
          <span>Official AI release notes from raw git logs</span>
        </div>
        <p className="opacity-75">Built with Next.js App Router, Google Gemini 3.6 Flash, and PostgreSQL (pgvector).</p>
      </footer>

    </div>
  );
}
