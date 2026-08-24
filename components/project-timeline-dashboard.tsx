"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Broadcast,
  Sparkle,
  GithubLogo,
  Briefcase,
  User,
  Code,
  ShieldWarning,
  CheckCircle,
  Copy,
  Clock,
  CaretDown,
  Globe,
  Plus,
  Pencil,
  ArrowUpRight,
  GitBranch,
  SignOut,
  FolderSimple,
  BellRinging,
  ChartBar,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";
import { GenerateReleaseModal } from "@/components/generate-release-modal";
import { UserProfileMenu } from "@/components/user-profile-menu";
import {
  exportToMarkdown,
  exportToNotion,
  exportToHtmlEmail,
  exportToGitHubRelease,
} from "@/lib/exporters";

interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  githubRepo: string | null;
  defaultBranch: string;
  releaseCount: number;
  latestVersion: string | null;
  lastShippedAt: string | null;
  publicUrl: string;
}

interface ReleaseItem {
  id: string;
  version: string;
  title: string;
  rawCommits: string;
  executiveSummary: string;
  userHighlights: any[];
  userFixes: any[];
  breakingChanges: any[];
  technicalUpdates: any[];
  status: string;
  publishedAt: string | null;
  createdAt: string;
  publicUrl: string;
}

export function ProjectTimelineDashboard() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [releases, setReleases] = useState<ReleaseItem[]>([]);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active view tab per release card ID
  const [activeTabs, setActiveTabs] = useState<Record<string, "exec" | "user" | "dev">>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchProjects();
      }
    } catch (err) {
      console.error("Failed to seed sample data:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Fetch all user projects on mount
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects/list");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects);
        setSelectedProject(data.projects[0]);
      }
    } catch (err) {
      console.warn("Failed to fetch projects list:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch timeline release notes when selected project changes
  const fetchReleasesForProject = async (projectSlug: string) => {
    setIsLoadingReleases(true);
    try {
      const res = await fetch(`/api/releases/recent?projectSlug=${encodeURIComponent(projectSlug)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.releases)) {
        setReleases(data.releases);
      } else {
        setReleases([]);
      }
    } catch (err) {
      console.warn("Failed to fetch project releases:", err);
      setReleases([]);
    } finally {
      setIsLoadingReleases(false);
    }
  };

  const [alertInfo, setAlertInfo] = useState<{
    hasNewChanges: boolean;
    newCommitCount: number;
    latestVersion: string;
    rawCommits: string;
  } | null>(null);

  const checkUnreleasedCommits = async (projectSlug: string) => {
    try {
      const res = await fetch("/api/github/check-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug }),
      });
      const data = await res.json();
      if (data.success && data.hasNewChanges) {
        setAlertInfo({
          hasNewChanges: data.hasNewChanges,
          newCommitCount: data.newCommitCount,
          latestVersion: data.latestVersion,
          rawCommits: data.rawCommits,
        });
      } else {
        setAlertInfo(null);
      }
    } catch (err) {
      console.warn("Failed to check unreleased commits:", err);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchReleasesForProject(selectedProject.slug);
      checkUnreleasedCommits(selectedProject.slug);
    }
  }, [selectedProject]);

  const handleSelectProject = (slug: string) => {
    const proj = projects.find((p) => p.slug === slug);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  const handleTabChange = (releaseId: string, tab: "exec" | "user" | "dev") => {
    setActiveTabs((prev) => ({ ...prev, [releaseId]: tab }));
  };

  const handleExportFormat = (rel: ReleaseItem, format: "md" | "notion" | "email" | "github") => {
    let content = "";
    if (format === "md") content = exportToMarkdown(rel);
    else if (format === "notion") content = exportToNotion(rel);
    else if (format === "email") content = exportToHtmlEmail(rel);
    else if (format === "github") content = exportToGitHubRelease(rel);

    navigator.clipboard.writeText(content);
    setCopiedId(`${rel.id}-${format}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignOut = () => {
    document.cookie = "stamplog_session=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Top Application Header with Project Switcher */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
              <Broadcast className="h-4.5 w-4.5" weight="bold" />
            </div>
            <span className="text-lg font-extrabold tracking-tight hidden sm:inline">stamplog</span>
          </Link>

          <span className="text-border text-lg hidden sm:inline">•</span>

          {/* Project Switcher Dropdown */}
          <div className="relative flex items-center">
            <FolderSimple className="h-4 w-4 absolute left-3 text-primary pointer-events-none" weight="bold" />
            <select
              value={selectedProject?.slug || ""}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="h-9 pl-9 pr-8 text-xs font-bold rounded-xl border border-border bg-card text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name} ({p.githubRepo || p.slug})
                </option>
              ))}
            </select>
            <CaretDown className="h-3.5 w-3.5 absolute right-2.5 pointer-events-none text-muted-foreground" weight="bold" />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/projects/import">
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-xs gap-1.5 border-indigo-500/30 hover:bg-muted transition-colors cursor-pointer"
            >
              <GithubLogo className="h-3.5 w-3.5 text-primary" weight="bold" />
              Import Repo
            </Badge>
          </Link>

          {selectedProject && (
            <>
              <Link href={`/p/${selectedProject.slug}/analytics`}>
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-xs gap-1.5 border-indigo-500/30 hover:bg-muted transition-colors cursor-pointer"
                >
                  <ChartBar className="h-3.5 w-3.5 text-primary" weight="bold" />
                  Analytics
                </Badge>
              </Link>

              <Link href={selectedProject.publicUrl} target="_blank">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-xs gap-1.5 hover:bg-muted transition-colors cursor-pointer"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-500" weight="bold" />
                  Public History
                </Badge>
              </Link>
            </>
          )}

          <Link href="/design-system">
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-xs gap-1.5 hover:bg-muted transition-colors cursor-pointer hidden md:flex"
            >
              Design System
            </Badge>
          </Link>

          <UserProfileMenu />
        </div>
      </header>

      {/* Main Timeline Workspace (Grid) */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Timeline Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Release History Timeline
                {selectedProject && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedProject.name}
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                Multi-audience changelog feed for {selectedProject?.githubRepo || selectedProject?.name}
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedProject}
              className="gap-2 text-xs shadow-md shadow-indigo-500/20"
            >
              <Sparkle className="h-4 w-4" weight="fill" />
              Generate New Release
            </Button>
          </div>

          {/* Animated Unreleased Changes Alert Banner */}
          {alertInfo?.hasNewChanges && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0">
                  <BellRinging className="h-5 w-5" weight="bold" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                    Unreleased Changes Alert
                    <Badge variant="exec" className="font-mono text-[10px]">
                      {alertInfo.newCommitCount} New Commits
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    New commits pushed to default branch since {alertInfo.latestVersion}. Ready for multi-audience release synthesis.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="gap-1.5 text-xs shrink-0 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
              >
                <Sparkle className="h-3.5 w-3.5" weight="fill" />
                Generate Release Notes Now
              </Button>
            </div>
          )}

          {/* Timeline Releases List */}
          {isLoadingReleases ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <Sparkle className="h-6 w-6 animate-spin text-primary mx-auto" weight="bold" />
              <p>Loading project timeline...</p>
            </div>
          ) : releases.length > 0 ? (
            <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
              {releases.map((rel) => {
                const currentTab = activeTabs[rel.id] || "user";
                const userHighlights = rel.userHighlights || [];
                const userFixes = rel.userFixes || [];
                const breakingChanges = rel.breakingChanges || [];
                const technicalUpdates = rel.technicalUpdates || [];

                return (
                  <div key={rel.id} className="relative pl-10">
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-2.5 top-5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-background ring-2 ring-indigo-500/20" />

                    <Card className="border-border hover:border-indigo-500/30 transition-all shadow-sm">
                      <CardHeader className="pb-3 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs bg-muted">
                              {rel.version}
                            </Badge>
                            <Badge variant={rel.status === "PUBLISHED" ? "user" : "outline"} className="text-xs">
                              {rel.status === "PUBLISHED" ? <CheckCircle className="h-3 w-3 text-emerald-500" weight="fill" /> : null}
                              {rel.status}
                            </Badge>
                            {rel.publishedAt && (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" weight="bold" />
                                {new Date(rel.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-lg font-bold mt-1 text-foreground">
                            {rel.title}
                          </CardTitle>
                        </div>

                        {/* Action Buttons & Multi-Format Exporter */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="relative">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleExportFormat(rel, e.target.value as any);
                                  e.target.value = "";
                                }
                              }}
                              className="h-8 pl-2.5 pr-6 text-xs font-semibold rounded-lg border border-border bg-card text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                            >
                              <option value="">{copiedId?.startsWith(rel.id) ? "Copied!" : "Export As..."}</option>
                              <option value="md">Raw Markdown (.md)</option>
                              <option value="notion">Notion Blocks</option>
                              <option value="email">HTML Email Newsletter</option>
                              <option value="github">GitHub Release Payload</option>
                            </select>
                            <CaretDown className="h-3 w-3 absolute right-2 top-2.5 pointer-events-none text-muted-foreground" weight="bold" />
                          </div>

                          {selectedProject && (
                            <Link href={`/p/${selectedProject.slug}/${encodeURIComponent(rel.version)}/edit`}>
                              <Button variant="outline" size="sm" className="gap-1 text-xs border-indigo-500/30 text-primary hover:bg-muted">
                                <Pencil className="h-3.5 w-3.5" weight="bold" /> Edit
                              </Button>
                            </Link>
                          )}

                          <Link href={rel.publicUrl} target="_blank">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <ArrowUpRight className="h-4 w-4" weight="bold" />
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 space-y-4">
                        
                        {/* Audience View Tabs */}
                        <div className="flex items-center gap-2 p-1 bg-muted rounded-xl border border-border/60 max-w-md">
                          <button
                            onClick={() => handleTabChange(rel.id, "user")}
                            className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                              currentTab === "user"
                                ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-border/60"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <User className="h-3.5 w-3.5" weight="bold" /> Customer
                          </button>
                          <button
                            onClick={() => handleTabChange(rel.id, "exec")}
                            className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                              currentTab === "exec"
                                ? "bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border/60"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Briefcase className="h-3.5 w-3.5" weight="bold" /> Executive
                          </button>
                          <button
                            onClick={() => handleTabChange(rel.id, "dev")}
                            className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                              currentTab === "dev"
                                ? "bg-card text-indigo-600 dark:text-indigo-400 shadow-sm border border-border/60"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Code className="h-3.5 w-3.5" weight="bold" /> Engineering
                          </button>
                        </div>

                        {/* Customer View */}
                        {currentTab === "user" && (
                          <div className="space-y-2 text-xs">
                            {userHighlights.map((h: any, i: number) => (
                              <div key={i} className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                <strong className="text-foreground font-semibold">{h?.feature}:</strong>{" "}
                                <span className="text-muted-foreground">{h?.benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Executive View */}
                        {currentTab === "exec" && (
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                              <p className="text-xs font-medium text-foreground leading-relaxed">
                                {rel.executiveSummary || "No executive summary provided."}
                              </p>
                            </div>
                            <AudienceMeter execPercent={30} userPercent={50} devPercent={20} />
                          </div>
                        )}

                        {/* Developer View */}
                        {currentTab === "dev" && (
                          <div className="space-y-2 text-xs">
                            {breakingChanges.length > 0 && (
                              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 space-y-1">
                                <span className="text-xs font-bold text-destructive flex items-center gap-1">
                                  <ShieldWarning className="h-3.5 w-3.5" weight="bold" /> Breaking Changes
                                </span>
                                {breakingChanges.map((b: any, i: number) => (
                                  <div key={i}>
                                    <code className="bg-background px-1.5 py-0.5 rounded text-destructive font-mono font-semibold">
                                      {b?.target}
                                    </code>
                                    <p className="text-muted-foreground pl-2">{b?.migrationStep}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {technicalUpdates.map((u: any, i: number) => (
                              <div key={i} className="p-2 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-2 text-xs">
                                <Badge variant="dev" className="font-mono text-[10px]">
                                  {u?.scope}
                                </Badge>
                                <span className="text-muted-foreground">{u?.detail}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">No releases published for this project yet.</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Generate a new release note with AI or populate sample release data to explore the timeline UI.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5 text-xs shadow-sm">
                  <Sparkle className="h-3.5 w-3.5" weight="fill" /> Generate First Release
                </Button>
                <Button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs border-indigo-500/30 text-primary"
                >
                  <Broadcast className="h-3.5 w-3.5" weight="bold" />
                  {isSeeding ? "Seeding..." : "Load Sample Releases"}
                </Button>
              </div>
            </Card>
          )}

        </div>

        {/* Right Sidebar: Project Overview & Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <Card className="shadow-sm border-indigo-500/20">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <GithubLogo className="h-4 w-4" weight="bold" /> Connected Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedProject?.name}</h3>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {selectedProject?.githubRepo || selectedProject?.slug}
                </p>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-primary" weight="bold" /> Default Branch
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {selectedProject?.defaultBranch || "main"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>Total Releases</span>
                  <span className="font-bold text-foreground font-mono">{selectedProject?.releaseCount || 0}</span>
                </div>

                {selectedProject?.latestVersion && (
                  <div className="flex items-center justify-between">
                    <span>Latest Version</span>
                    <Badge variant="user" className="font-mono text-[10px]">
                      {selectedProject.latestVersion}
                    </Badge>
                  </div>
                )}
              </div>

              {selectedProject && (
                <Link href={selectedProject.publicUrl} target="_blank">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" weight="bold" />
                    Open Public Changelog Feed
                    <ArrowUpRight className="h-3 w-3" weight="bold" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Link href="/projects/import">
            <Button variant="outline" className="w-full h-11 gap-2 text-xs font-bold border-indigo-500/30">
              <Plus className="h-4 w-4 text-primary" weight="bold" />
              Import Another GitHub Repo
            </Button>
          </Link>

        </div>

      </main>

      {/* AI Release Generation Modal */}
      {selectedProject && (
        <GenerateReleaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
          onReleaseCreated={() => {
            fetchProjects();
            fetchReleasesForProject(selectedProject.slug);
          }}
        />
      )}

    </div>
  );
}
