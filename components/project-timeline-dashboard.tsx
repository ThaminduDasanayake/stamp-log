"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BellRingingIcon,
  BriefcaseIcon,
  BroadcastIcon,
  CaretDownIcon,
  CaretRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  CodeIcon,
  FolderSimpleIcon,
  GitBranchIcon,
  GitCommitIcon,
  GithubLogoIcon,
  GlobeIcon,
  PencilIcon,
  ShieldWarningIcon,
  SparkleIcon,
  TerminalWindowIcon,
  UserIcon,
  PlusIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";
import { GenerateReleaseModal } from "@/components/generate-release-modal";
import { UserProfileMenu } from "@/components/user-profile-menu";
import {
  exportToGitHubRelease,
  exportToHtmlEmail,
  exportToMarkdown,
  exportToNotion,
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
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );
  const [releases, setReleases] = useState<ReleaseItem[]>([]);

  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active view tab per release card ID
  const [activeTabs, setActiveTabs] = useState<
    Record<string, "user" | "exec" | "dev">
  >({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch all user projects on mount
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects/list");
      const data = await res.json();
      if (
        data.success &&
        Array.isArray(data.projects) &&
        data.projects.length > 0
      ) {
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
      const res = await fetch(
        `/api/releases/recent?projectSlug=${encodeURIComponent(projectSlug)}`,
      );
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
    recentCommits?: Array<{
      sha: string;
      message: string;
      author: string;
      date?: string;
    }>;
  } | null>(null);

  const [showCommitsDrawer, setShowCommitsDrawer] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

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
          recentCommits: data.recentCommits || [],
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
    if (slug === "IMPORT_NEW") {
      window.location.href = "/projects/import";
      return;
    }
    const proj = projects.find((p) => p.slug === slug);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  const handleTabChange = (releaseId: string, tab: "user" | "exec" | "dev") => {
    setActiveTabs((prev) => ({ ...prev, [releaseId]: tab }));
  };

  const handleExportFormat = (
    rel: ReleaseItem,
    format: "md" | "notion" | "email" | "github",
  ) => {
    let content = "";
    if (format === "md") content = exportToMarkdown(rel);
    else if (format === "notion") content = exportToNotion(rel);
    else if (format === "email") content = exportToHtmlEmail(rel);
    else if (format === "github") content = exportToGitHubRelease(rel);

    navigator.clipboard.writeText(content);
    setCopiedId(`${rel.id}-${format}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Vercel Workspace Header with Breadcrumb Switcher */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-40 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Vercel Geometric Triangle Logo */}
            <div className="h-6 w-6 bg-[#171717] dark:bg-white flex items-center justify-center rounded-[3px]">
              <svg
                className="h-3.5 w-3.5 fill-white dark:fill-black"
                viewBox="0 0 76 65"
                aria-hidden="true"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:inline">
              stamplog
            </span>
          </Link>

          <span className="text-[#8f8f8f] text-sm">/</span>

          {/* Vercel Breadcrumb Project Switcher */}
          <div className="relative flex items-center">
            <select
              value={selectedProject?.slug || ""}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="h-8 pl-2.5 pr-7 text-xs font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0070f3] hover:border-[#8f8f8f] transition-colors"
            >
              {projects.length === 0 && (
                <option value="">No projects found</option>
              )}
              {projects.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
              <option value="IMPORT_NEW">+ Import Project...</option>
            </select>
            <CaretDownIcon
              className="h-3 w-3 absolute right-2 pointer-events-none text-[#8f8f8f]"
              weight="bold"
            />
          </div>

          <span className="text-[#8f8f8f] text-sm hidden md:inline">/</span>
          <span className="text-xs text-[#8f8f8f] font-mono hidden md:inline">
            releases
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedProject && (
            <>
              <Link href={`/p/${selectedProject.slug}/analytics`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-[#666666] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white gap-1.5"
                >
                  <ChartBarIcon className="h-3.5 w-3.5 text-[#0070f3]" weight="bold" />
                  Analytics
                </Button>
              </Link>

              <Link href={selectedProject.publicUrl} target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs gap-1.5"
                >
                  <GlobeIcon className="h-3.5 w-3.5 text-[#00876c]" weight="bold" />
                  Public Feed
                  <ArrowUpRightIcon className="h-3 w-3" weight="bold" />
                </Button>
              </Link>
            </>
          )}

          <UserProfileMenu />
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 md:p-8">
        {!selectedProject && !isLoadingProjects ? (
          <div className="max-w-md w-full mx-auto my-16 text-center space-y-6">
            <Card className="p-8 space-y-5 text-center">
              <div className="h-10 w-10 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222] flex items-center justify-center text-[#171717] dark:text-white mx-auto">
                <BroadcastIcon className="h-5 w-5" weight="bold" />
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-medium text-[#171717] dark:text-white">
                  Welcome to StampLog
                </h2>
                <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed max-w-xs mx-auto">
                  Connect a GitHub repository to start generating multi-audience changelogs.
                </p>
              </div>

              <Link href="/projects/import">
                <Button className="w-full h-9 gap-2 text-xs font-medium">
                  <GithubLogoIcon className="h-4 w-4" weight="bold" />
                  Import GitHub Repository
                </Button>
              </Link>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* Left Column: Timeline Feed (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium tracking-tight text-[#171717] dark:text-white">
                      Release History
                    </h2>
                    {selectedProject && (
                      <Badge variant="pixel" className="text-[10px]">
                        {selectedProject.releaseCount} Releases
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#666666] dark:text-[#888888] mt-0.5">
                    Multi-audience release changelog for{" "}
                    <span className="font-mono text-[#171717] dark:text-[#ededed]">
                      {selectedProject?.githubRepo || selectedProject?.name}
                    </span>
                  </p>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!selectedProject}
                  variant="default"
                  size="sm"
                  className="h-8 px-3.5 gap-1.5 text-xs font-medium"
                >
                  <SparkleIcon className="h-3.5 w-3.5" weight="fill" />
                  Generate New Release
                </Button>
              </div>

              {/* Unreleased Changes Notification Banner */}
              {alertInfo?.hasNewChanges && (
                <div className="rounded-[6px] border border-[#bd5200]/30 bg-[#bd5200]/5 overflow-hidden transition-all">
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#bd5200] shrink-0 animate-pulse" />
                      <div>
                        <div className="text-xs font-medium text-[#171717] dark:text-white flex items-center gap-2">
                          <span>Unreleased commits detected</span>
                          <Badge variant="exec" className="font-mono text-[10px] py-0 px-1.5">
                            {alertInfo.newCommitCount} commits
                          </Badge>
                        </div>
                        <p className="text-[11px] text-[#666666] dark:text-[#888888] mt-0.5">
                          New changes pushed to branch since {alertInfo.latestVersion}. Ready to synthesize.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {alertInfo.recentCommits && alertInfo.recentCommits.length > 0 && (
                        <Button
                          onClick={() => setShowCommitsDrawer(!showCommitsDrawer)}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-[#666666] dark:text-[#888888] border-[#bd5200]/30 hover:border-[#bd5200]"
                        >
                          {showCommitsDrawer ? "Hide Commits" : `Preview (${alertInfo.recentCommits.length})`}
                        </Button>
                      )}
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        size="sm"
                        className="h-7 px-3 text-xs shrink-0 bg-[#bd5200] hover:bg-[#a34600] text-white border-[#bd5200]"
                      >
                        Generate Notes
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Commits Drawer inside banner */}
                  {showCommitsDrawer && alertInfo.recentCommits && alertInfo.recentCommits.length > 0 && (
                    <div className="border-t border-[#bd5200]/20 bg-black/5 dark:bg-black/30 p-3 space-y-1.5">
                      <div className="text-[11px] font-mono text-[#8f8f8f] uppercase tracking-wider px-1">
                        Recent Commits on {selectedProject?.defaultBranch || "main"}:
                      </div>
                      <div className="space-y-1">
                        {alertInfo.recentCommits.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-3 text-xs font-mono py-1 px-2.5 rounded-[4px] bg-white dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <GitCommitIcon className="h-3.5 w-3.5 text-[#bd5200] shrink-0" weight="bold" />
                              <span className="truncate text-[#171717] dark:text-[#ededed]">{c.message}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-[11px] text-[#8f8f8f]">
                              <span className="text-[#666666] dark:text-[#888888] hidden sm:inline">{c.author}</span>
                              <Badge variant="pixel" className="text-[10px] px-1 py-0">{c.sha}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Releases List */}
              {isLoadingReleases ? (
                <div className="p-12 text-center text-xs text-[#8f8f8f] space-y-2">
                  <div className="h-4 w-4 border-2 border-[#171717] dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Loading project releases...</p>
                </div>
              ) : releases.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-px before:bg-[#ebebeb] dark:before:bg-[#1f1f1f]">
                  {releases.map((rel) => {
                    const currentTab = activeTabs[rel.id] || "user";
                    const userHighlights = rel.userHighlights || [];
                    const breakingChanges = rel.breakingChanges || [];
                    const technicalUpdates = rel.technicalUpdates || [];

                    return (
                      <div key={rel.id} className="relative pl-8">
                        {/* Minimalist Timeline Marker */}
                        <div className="absolute left-2.5 top-6 h-2 w-2 rounded-full bg-[#171717] dark:bg-white ring-4 ring-[#fafafa] dark:ring-black" />

                        <Card className="hover:border-[#8f8f8f] transition-all">
                          {/* Card Header */}
                          <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="pixel" className="text-[10px]">
                                  {rel.version}
                                </Badge>
                                <Badge
                                  variant={
                                    rel.status === "PUBLISHED" ? "user" : "outline"
                                  }
                                  className="text-[11px]"
                                >
                                  {rel.status === "PUBLISHED" && (
                                    <CheckCircleIcon
                                      className="h-3 w-3 text-[#00876c]"
                                      weight="fill"
                                    />
                                  )}
                                  {rel.status}
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

                            {/* Actions & Export */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="relative">
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleExportFormat(
                                        rel,
                                        e.target.value as any,
                                      );
                                      e.target.value = "";
                                    }
                                  }}
                                  className="h-7 pl-2 pr-6 text-xs font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                                >
                                  <option value="">
                                    {copiedId?.startsWith(rel.id)
                                      ? "Copied!"
                                      : "Export..."}
                                  </option>
                                  <option value="md">Markdown (.md)</option>
                                  <option value="notion">Notion Blocks</option>
                                  <option value="email">HTML Email</option>
                                  <option value="github">
                                    GitHub Release
                                  </option>
                                </select>
                                <CaretDownIcon
                                  className="h-3 w-3 absolute right-1.5 top-2 pointer-events-none text-[#8f8f8f]"
                                  weight="bold"
                                />
                              </div>

                              {selectedProject && (
                                <Link
                                  href={`/p/${selectedProject.slug}/${encodeURIComponent(rel.version)}/edit`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2.5 text-xs gap-1"
                                  >
                                    <PencilIcon
                                      className="h-3 w-3"
                                      weight="bold"
                                    />
                                    Edit
                                  </Button>
                                </Link>
                              )}

                              <Link href={rel.publicUrl} target="_blank">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-[#8f8f8f] hover:text-[#171717] dark:hover:text-white"
                                >
                                  <ArrowUpRightIcon
                                    className="h-3.5 w-3.5"
                                    weight="bold"
                                  />
                                </Button>
                              </Link>
                            </div>
                          </CardHeader>

                          {/* Card Content with 3 Persona Views */}
                          <CardContent className="p-5 space-y-4">
                            {/* Segmented Persona Tabs */}
                            <div className="flex items-center gap-1 p-0.5 bg-[#f5f5f5] dark:bg-[#111111] rounded-[4px] border border-[#ebebeb] dark:border-[#222222] max-w-sm">
                              <button
                                onClick={() => handleTabChange(rel.id, "user")}
                                className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                                  currentTab === "user"
                                    ? "bg-white dark:bg-[#1f1f1f] text-[#00876c] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                                    : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                                }`}
                              >
                                <UserIcon className="h-3 w-3" weight="bold" />
                                Customer
                              </button>
                              <button
                                onClick={() => handleTabChange(rel.id, "exec")}
                                className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                                  currentTab === "exec"
                                    ? "bg-white dark:bg-[#1f1f1f] text-[#bd5200] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                                    : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                                }`}
                              >
                                <BriefcaseIcon
                                  className="h-3 w-3"
                                  weight="bold"
                                />
                                Executive
                              </button>
                              <button
                                onClick={() => handleTabChange(rel.id, "dev")}
                                className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                                  currentTab === "dev"
                                    ? "bg-white dark:bg-[#1f1f1f] text-[#0070f3] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                                    : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                                }`}
                              >
                                <CodeIcon className="h-3 w-3" weight="bold" />
                                Developer
                              </button>
                            </div>

                            {/* View 1: Customer */}
                            {currentTab === "user" && (
                              <div className="space-y-2 text-xs">
                                {userHighlights.map((h: any, i: number) => (
                                  <div
                                    key={i}
                                    className="p-2.5 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]"
                                  >
                                    <strong className="text-[#171717] dark:text-[#ededed] font-medium">
                                      {h?.feature}:
                                    </strong>{" "}
                                    <span className="text-[#666666] dark:text-[#888888]">
                                      {h?.benefit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* View 2: Executive */}
                            {currentTab === "exec" && (
                              <div className="space-y-3">
                                <div className="p-3 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]">
                                  <p className="text-xs text-[#171717] dark:text-[#ededed] leading-relaxed">
                                    {rel.executiveSummary ||
                                      "No executive summary provided."}
                                  </p>
                                </div>
                                <AudienceMeter
                                  execPercent={30}
                                  userPercent={50}
                                  devPercent={20}
                                />
                              </div>
                            )}

                            {/* View 3: Developer */}
                            {currentTab === "dev" && (
                              <div className="space-y-2 text-xs">
                                {breakingChanges.length > 0 && (
                                  <div className="p-2.5 rounded-[4px] bg-[#ee0000]/5 border border-[#ee0000]/20 space-y-1">
                                    <span className="text-xs font-medium text-[#ee0000] flex items-center gap-1">
                                      <ShieldWarningIcon
                                        className="h-3.5 w-3.5"
                                        weight="bold"
                                      />
                                      Breaking Changes
                                    </span>
                                    {breakingChanges.map(
                                      (b: any, i: number) => (
                                        <div key={i} className="pt-1">
                                          <code className="bg-white dark:bg-black px-1.5 py-0.5 rounded text-[#ee0000] font-mono text-[11px] border border-[#ee0000]/20">
                                            {b?.target}
                                          </code>
                                          <p className="text-[#666666] dark:text-[#888888] mt-1 pl-1">
                                            {b?.migrationStep}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}

                                {technicalUpdates.map((u: any, i: number) => (
                                  <div
                                    key={i}
                                    className="p-2 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222] flex items-center gap-2 text-xs"
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
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Primary Hero Action Card */}
                  <Card className="p-5 border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="pixel" className="text-[10px]">
                            Repository Connected
                          </Badge>
                          <span className="text-[11px] text-[#8f8f8f] font-mono">
                            {selectedProject?.githubRepo}
                          </span>
                        </div>
                        <h3 className="text-base font-medium text-[#171717] dark:text-white mt-1">
                          No releases published for this project yet
                        </h3>
                        <p className="text-xs text-[#666666] dark:text-[#888888] max-w-lg leading-relaxed">
                          Synthesize your raw git commits into distinct views: plain-English value for users, bulleted rollups for leadership, and breaking migration notes for engineers.
                        </p>
                      </div>

                      <Button
                        onClick={() => setIsModalOpen(true)}
                        size="sm"
                        className="h-8 px-4 gap-1.5 text-xs font-medium shrink-0"
                      >
                        <SparkleIcon className="h-3.5 w-3.5" weight="fill" />
                        Generate First Release
                      </Button>
                    </div>

                    {/* Detected Unreleased Commits Feed in Empty State */}
                    {alertInfo?.hasNewChanges && alertInfo.recentCommits && alertInfo.recentCommits.length > 0 && (
                      <div className="pt-3.5 border-t border-[#ebebeb] dark:border-[#1f1f1f] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8f8f8f] flex items-center gap-1.5">
                            <GitCommitIcon className="h-3.5 w-3.5 text-[#0070f3]" weight="bold" />
                            Unreleased Commits On {selectedProject?.defaultBranch || "main"}
                          </span>
                          <Badge variant="exec" className="font-mono text-[10px]">
                            {alertInfo.newCommitCount} commits detected
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          {alertInfo.recentCommits.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-3 text-xs font-mono py-1.5 px-3 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]"
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#0070f3] shrink-0" />
                                <span className="truncate text-[#171717] dark:text-[#ededed]">
                                  {c.message}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 text-[11px] text-[#8f8f8f]">
                                <span className="text-[#666666] dark:text-[#888888] hidden sm:inline">
                                  {c.author}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-black border border-[#ebebeb] dark:border-[#262626] text-[10px] text-[#171717] dark:text-[#ededed]">
                                  {c.sha}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* 3-Step Feature Process Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="p-3.5 space-y-1.5 bg-[#fafafa] dark:bg-[#0d0d0d] border-[#ebebeb] dark:border-[#1f1f1f]">
                      <div className="h-6 w-6 rounded-[3px] bg-white dark:bg-[#1a1a1a] border border-[#ebebeb] dark:border-[#262626] flex items-center justify-center text-[10px] font-mono text-[#0070f3]">
                        01
                      </div>
                      <h4 className="text-xs font-medium text-[#171717] dark:text-white">
                        Conventional Commit Intake
                      </h4>
                      <p className="text-[11px] text-[#666666] dark:text-[#888888] leading-relaxed">
                        Deterministic categorization for feats, fixes, refactors, and breaking changes directly from git.
                      </p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 bg-[#fafafa] dark:bg-[#0d0d0d] border-[#ebebeb] dark:border-[#1f1f1f]">
                      <div className="h-6 w-6 rounded-[3px] bg-white dark:bg-[#1a1a1a] border border-[#ebebeb] dark:border-[#262626] flex items-center justify-center text-[10px] font-mono text-[#00876c]">
                        02
                      </div>
                      <h4 className="text-xs font-medium text-[#171717] dark:text-white">
                        Multi-Audience Synthesis
                      </h4>
                      <p className="text-[11px] text-[#666666] dark:text-[#888888] leading-relaxed">
                        Gemini Flash extracts user value highlights, executive rollups, and developer migration specs.
                      </p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 bg-[#fafafa] dark:bg-[#0d0d0d] border-[#ebebeb] dark:border-[#1f1f1f]">
                      <div className="h-6 w-6 rounded-[3px] bg-white dark:bg-[#1a1a1a] border border-[#ebebeb] dark:border-[#262626] flex items-center justify-center text-[10px] font-mono text-[#bd5200]">
                        03
                      </div>
                      <h4 className="text-xs font-medium text-[#171717] dark:text-white">
                        Universal Multi-Channel Export
                      </h4>
                      <p className="text-[11px] text-[#666666] dark:text-[#888888] leading-relaxed">
                        Live RSS feeds, web release page, and 1-click export to Markdown, Notion blocks, and HTML email.
                      </p>
                    </Card>
                  </div>

                  {/* GitHub Actions CI/CD Integration Card */}
                  <Card className="p-4 border-[#ebebeb] dark:border-[#1f1f1f] bg-white dark:bg-[#0a0a0a] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TerminalWindowIcon className="h-4 w-4 text-[#8f8f8f]" weight="bold" />
                        <span className="text-xs font-medium text-[#171717] dark:text-white">
                          Automate via GitHub Actions
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          const yaml = `name: StampLog Automated Release
on:
  push:
    tags:
      - 'v*'
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Generate Release Notes
        run: |
          COMMITS=$(git log -n 25 --oneline)
          curl -X POST \${{ secrets.STAMPLOG_URL }}/api/v1/automate \\
            -H "Content-Type: application/json" \\
            -d "{\\"projectSlug\\": \\"${selectedProject?.slug}\\", \\"version\\": \\"\${{ github.ref_name }}\\", \\"rawCommits\\": \\"$COMMITS\\", \\"status\\": \\"PUBLISHED\\"}"`;
                          navigator.clipboard.writeText(yaml);
                          setCopiedSnippet(true);
                          setTimeout(() => setCopiedSnippet(false), 2000);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs font-mono gap-1 text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                      >
                        {copiedSnippet ? (
                          <>
                            <CheckIcon className="h-3 w-3 text-[#00876c]" weight="bold" />
                            Copied
                          </>
                        ) : (
                          <>
                            <CopyIcon className="h-3 w-3" weight="bold" />
                            Copy Workflow YAML
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-[11px] text-[#666666] dark:text-[#888888] leading-relaxed">
                      Drop this workflow into <code className="font-mono text-[#171717] dark:text-[#ededed] bg-[#fafafa] dark:bg-[#161616] px-1 py-0.5 rounded border border-[#ebebeb] dark:border-[#262626]">.github/workflows/stamplog.yml</code> to automatically synthesize and publish release notes every time a git tag is pushed.
                    </p>
                  </Card>
                </div>
              )}
            </div>

            {/* Right Sidebar: Connected Repository (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card>
                <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                  <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center gap-2">
                    <GithubLogoIcon className="h-4 w-4 text-[#171717] dark:text-white" weight="bold" />
                    Connected Repository
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                      {selectedProject?.name || "No Project Selected"}
                    </h3>
                    <p className="text-xs font-mono text-[#8f8f8f] mt-0.5">
                      {selectedProject?.githubRepo || "github.com/repository"}
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs text-[#666666] dark:text-[#888888] border-t border-[#ebebeb] dark:border-[#1f1f1f] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <GitBranchIcon
                          className="h-3.5 w-3.5 text-[#8f8f8f]"
                          weight="bold"
                        />
                        Default Branch
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {selectedProject?.defaultBranch || "main"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Total Releases</span>
                      <span className="font-mono text-[#171717] dark:text-[#ededed]">
                        {selectedProject?.releaseCount || 0}
                      </span>
                    </div>

                    {selectedProject?.latestVersion && (
                      <div className="flex items-center justify-between">
                        <span>Latest Release</span>
                        <Badge variant="pixel" className="text-[10px]">
                          {selectedProject.latestVersion}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {selectedProject && (
                    <Link href={selectedProject.publicUrl} target="_blank">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-8 gap-1.5 text-xs font-medium"
                      >
                        <GlobeIcon
                          className="h-3.5 w-3.5 text-[#00876c]"
                          weight="bold"
                        />
                        Open Public Changelog Feed
                        <ArrowUpRightIcon className="h-3 w-3" weight="bold" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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
