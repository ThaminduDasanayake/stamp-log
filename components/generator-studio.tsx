"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useObject } from "@ai-sdk/react";
import { ChangelogSchema } from "@/lib/schemas/changelog";
import {
  BroadcastIcon,
  SparkleIcon,
  BriefcaseIcon,
  UserIcon,
  CodeIcon,
  ShieldWarningIcon,
  CheckCircleIcon,
  CopyIcon,
  GitCommitIcon,
  FloppyDiskIcon,
  ArrowUpRightIcon,
  GlobeIcon,
  ClockIcon,
  CaretDownIcon,
  GithubLogoIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";

interface GeneratorStudioProps {
  projectId?: string;
  projectName?: string;
}

interface SavedReleaseItem {
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
  publicUrl: string;
  createdAt: string;
}

export function GeneratorStudio({
  projectId = "demo",
  projectName = "StampLog Project",
}: GeneratorStudioProps) {
  const [inputLogs, setInputLogs] = useState("");
  const [activeTab, setActiveTab] = useState<"user" | "exec" | "dev">("user");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    publicUrl: string;
    version: string;
  } | null>(null);

  // GitHub Repo Quick-Sync State
  const [githubRepoInput, setGithubRepoInput] = useState("");
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [repoError, setRepoError] = useState("");

  // Recent saved releases state
  const [recentReleases, setRecentReleases] = useState<SavedReleaseItem[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>("");
  const [loadedRelease, setLoadedRelease] = useState<SavedReleaseItem | null>(
    null,
  );

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/releases/generate",
    schema: ChangelogSchema,
  });

  const fetchRecentReleases = async () => {
    try {
      const res = await fetch("/api/releases/recent?projectSlug=demo");
      const data = await res.json();
      if (data.success && Array.isArray(data.releases)) {
        setRecentReleases(data.releases);
      }
    } catch (err) {
      console.warn("Failed to fetch recent releases:", err);
    }
  };

  useEffect(() => {
    fetchRecentReleases();
  }, []);

  const handleGenerate = () => {
    if (!inputLogs.trim()) return;
    setSaveResult(null);
    setLoadedRelease(null);
    setSelectedReleaseId("");
    submit({ projectId, rawCommits: inputLogs });
  };

  const handleFetchGitHubCommits = async () => {
    if (!githubRepoInput.trim()) return;
    setIsFetchingRepo(true);
    setRepoError("");
    setSaveResult(null);
    setLoadedRelease(null);
    setSelectedReleaseId("");

    try {
      const res = await fetch("/api/github/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: githubRepoInput }),
      });
      const data = await res.json();

      if (data.success && data.rawCommits) {
        setInputLogs(data.rawCommits);
        submit({ projectId, rawCommits: data.rawCommits });
      } else {
        setRepoError(data.error || "Failed to fetch GitHub commits");
      }
    } catch (err: any) {
      setRepoError(
        err?.message || "Connection error fetching GitHub repository",
      );
    } finally {
      setIsFetchingRepo(false);
    }
  };

  const handleSelectRelease = (id: string) => {
    setSelectedReleaseId(id);
    if (!id) {
      setLoadedRelease(null);
      return;
    }

    const rel = recentReleases.find((r) => r.id === id);
    if (rel) {
      setLoadedRelease(rel);
      if (rel.rawCommits) {
        setInputLogs(rel.rawCommits);
      }
      setSaveResult({ publicUrl: rel.publicUrl, version: rel.version });
    }
  };

  const displayVersion = object?.version || loadedRelease?.version || "vX.X.X";
  const displayTitle =
    object?.title || loadedRelease?.title || "Release Title generating...";
  const displayExecSummary =
    object?.executiveSummary || loadedRelease?.executiveSummary || "";
  const displayHighlights =
    object?.userFacing?.highlights || loadedRelease?.userHighlights || [];
  const displayFixes =
    object?.userFacing?.fixes || loadedRelease?.userFixes || [];
  const displayBreaking =
    object?.developerFacing?.breakingChanges ||
    loadedRelease?.breakingChanges ||
    [];
  const displayTech =
    object?.developerFacing?.technicalUpdates ||
    loadedRelease?.technicalUpdates ||
    [];

  const handleCopyMarkdown = () => {
    const title = displayTitle;
    const version = displayVersion;
    const summary = displayExecSummary;
    const highlights = displayHighlights
      .map((h: any) => `- **${h?.feature}**: ${h?.benefit}`)
      .join("\n");
    const tech = displayTech
      .map((u: any) => `- [${u?.scope}] ${u?.detail}`)
      .join("\n");

    const md = `# ${title} (${version})\n\n## Executive Summary\n${summary}\n\n## User Highlights\n${highlights}\n\n## Technical Updates\n${tech}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRelease = async (status: "DRAFT" | "PUBLISHED") => {
    const currentVersion =
      displayVersion !== "vX.X.X" ? displayVersion : "v1.0.0";
    const currentTitle =
      displayTitle !== "Release Title generating..."
        ? displayTitle
        : "New Release";

    setIsSaving(true);
    try {
      const res = await fetch("/api/releases/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          projectSlug: "demo",
          projectName,
          version: currentVersion,
          title: currentTitle,
          rawCommits: inputLogs,
          executiveSummary: displayExecSummary,
          userHighlights: displayHighlights,
          userFixes: displayFixes,
          breakingChanges: displayBreaking,
          technicalUpdates: displayTech,
          status,
        }),
      });

      const data = await res.json();
      if (data.success && data.publicUrl) {
        setSaveResult({ publicUrl: data.publicUrl, version: data.version });
        fetchRecentReleases();
      }
    } catch (err) {
      console.error("Error saving release note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-[1240px] mx-auto font-sans">
      {/* Left Workbench (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Quick Sync GitHub Repo Card */}
        <Card className="bg-[#fafafa] dark:bg-[#080808]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888] flex items-center gap-2">
              <GithubLogoIcon className="h-4 w-4 text-[#171717] dark:text-white" weight="bold" />
              1-Click GitHub Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="owner/repo (e.g. vercel/next.js)"
                className="flex-1 h-8 px-3 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                value={githubRepoInput}
                onChange={(e) => setGithubRepoInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleFetchGitHubCommits()
                }
              />
              <Button
                size="sm"
                onClick={handleFetchGitHubCommits}
                disabled={isFetchingRepo || isLoading || !githubRepoInput.trim()}
                className="h-8 px-3 gap-1.5 text-xs font-medium"
              >
                {isFetchingRepo ? (
                  <ArrowClockwiseIcon
                    className="h-3.5 w-3.5 animate-spin"
                    weight="bold"
                  />
                ) : (
                  <GithubLogoIcon className="h-3.5 w-3.5" weight="bold" />
                )}
                {isFetchingRepo ? "Fetching..." : "Fetch"}
              </Button>
            </div>
            {repoError && (
              <p className="text-[11px] text-[#ee0000] font-medium leading-none pt-1">
                {repoError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Input Workbench Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GitCommitIcon className="h-4 w-4 text-[#171717] dark:text-white" weight="bold" />
                Raw Input Workbench
              </CardTitle>

              {recentReleases.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedReleaseId}
                    onChange={(e) => handleSelectRelease(e.target.value)}
                    className="h-7 pl-2 pr-6 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-[#fafafa] dark:bg-[#111111] text-[#171717] dark:text-[#ededed] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                  >
                    <option value="">Load saved...</option>
                    {recentReleases.map((rel) => (
                      <option key={rel.id} value={rel.id}>
                        {rel.version} — {rel.title.substring(0, 18)}...
                      </option>
                    ))}
                  </select>
                  <CaretDownIcon
                    className="h-3 w-3 absolute right-1.5 top-2 pointer-events-none text-[#8f8f8f]"
                    weight="bold"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block mb-1.5">
                Commit Logs / PR Titles
              </label>
              <textarea
                placeholder="feat(auth): add OAuth2 refresh token rotation #102&#10;fix(dashboard): resolve chart memory leak #105"
                className="w-full h-72 rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-[#fafafa] dark:bg-[#111111] p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0070f3] leading-relaxed resize-none text-[#171717] dark:text-[#ededed]"
                value={inputLogs}
                onChange={(e) => setInputLogs(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !inputLogs.trim()}
                className="flex-1 h-9 gap-2 text-xs font-medium"
              >
                {isLoading ? (
                  <>
                    <SparkleIcon
                      className="h-3.5 w-3.5 animate-spin"
                      weight="fill"
                    />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <SparkleIcon className="h-3.5 w-3.5" weight="fill" />
                    Synthesize Release Notes
                  </>
                )}
              </Button>
              {isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => stop()}
                  className="h-9 px-3 text-xs"
                >
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Streaming Output (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <Card>
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="pixel" className="text-[10px]">
                  {displayVersion}
                </Badge>
                {isLoading && (
                  <Badge variant="user" className="text-[11px] animate-pulse">
                    Streaming...
                  </Badge>
                )}
                {loadedRelease && (
                  <Badge variant="outline" className="text-[11px]">
                    <ClockIcon className="h-3 w-3" weight="bold" /> Loaded
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-medium mt-1">
                {displayTitle}
              </CardTitle>
            </div>

            {(object || loadedRelease) && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMarkdown}
                  className="h-7 px-2.5 text-xs gap-1"
                >
                  {copied ? (
                    <CheckCircleIcon
                      className="h-3.5 w-3.5 text-[#00876c]"
                      weight="bold"
                    />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" weight="bold" />
                  )}
                  {copied ? "Copied" : "Copy MD"}
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSaveRelease("PUBLISHED")}
                  className="h-7 px-3 text-xs gap-1.5 font-medium"
                >
                  <FloppyDiskIcon className="h-3.5 w-3.5" weight="bold" />
                  {isSaving ? "Saving..." : "Save & Publish"}
                </Button>
              </div>
            )}
          </CardHeader>

          {/* Success Banner */}
          {saveResult && (
            <div className="mx-5 mt-4 p-3 rounded-[4px] bg-[#00876c]/8 border border-[#00876c]/25 flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-[#00876c] font-medium">
                <CheckCircleIcon
                  className="h-3.5 w-3.5 shrink-0"
                  weight="bold"
                />
                Release {saveResult.version} is live on changelog!
              </span>
              <Link href={saveResult.publicUrl} target="_blank">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 border-[#00876c]/30 text-[#00876c]"
                >
                  <GlobeIcon className="h-3 w-3" weight="bold" />
                  View
                  <ArrowUpRightIcon className="h-3 w-3" weight="bold" />
                </Button>
              </Link>
            </div>
          )}

          <CardContent className="p-5 space-y-4">
            {/* Persona Segment Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-[#f5f5f5] dark:bg-[#111111] rounded-[4px] border border-[#ebebeb] dark:border-[#222222] max-w-sm">
              <button
                onClick={() => setActiveTab("user")}
                className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "user"
                    ? "bg-white dark:bg-[#1f1f1f] text-[#00876c] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                    : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                }`}
              >
                <UserIcon className="h-3 w-3" weight="bold" /> Customer
              </button>
              <button
                onClick={() => setActiveTab("exec")}
                className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "exec"
                    ? "bg-white dark:bg-[#1f1f1f] text-[#bd5200] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                    : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                }`}
              >
                <BriefcaseIcon className="h-3 w-3" weight="bold" /> Executive
              </button>
              <button
                onClick={() => setActiveTab("dev")}
                className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "dev"
                    ? "bg-white dark:bg-[#1f1f1f] text-[#0070f3] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                    : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                }`}
              >
                <CodeIcon className="h-3 w-3" weight="bold" /> Developer
              </button>
            </div>

            {/* TAB CONTENT: Customer */}
            {activeTab === "user" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-[#666666] dark:text-[#888888] uppercase tracking-wider">
                    Feature Highlights
                  </h4>
                  {displayHighlights.length > 0 ? (
                    <div className="space-y-1.5">
                      {displayHighlights.map((h: any, i: number) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222] text-xs leading-relaxed"
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
                  ) : (
                    <p className="text-xs text-[#8f8f8f] italic">
                      Awaiting feature stream...
                    </p>
                  )}
                </div>

                {displayFixes.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-medium text-[#666666] dark:text-[#888888] uppercase tracking-wider">
                      Bug Fixes
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-[#666666] dark:text-[#888888] space-y-1">
                      {displayFixes.map((f: any, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Executive */}
            {activeTab === "exec" && (
              <div className="space-y-3">
                <div className="p-3 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222] space-y-2">
                  <span className="text-xs font-medium text-[#bd5200] flex items-center gap-1.5">
                    <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" />
                    Strategic Summary
                  </span>
                  <p className="text-xs text-[#171717] dark:text-[#ededed] leading-relaxed">
                    {displayExecSummary ||
                      "Generating strategic summary for leadership..."}
                  </p>
                </div>
                <AudienceMeter
                  execPercent={30}
                  userPercent={50}
                  devPercent={20}
                />
              </div>
            )}

            {/* TAB CONTENT: Developer */}
            {activeTab === "dev" && (
              <div className="space-y-3">
                {displayBreaking.length > 0 && (
                  <div className="p-2.5 rounded-[4px] bg-[#ee0000]/5 border border-[#ee0000]/20 space-y-1.5">
                    <span className="text-xs font-medium text-[#ee0000] flex items-center gap-1">
                      <ShieldWarningIcon
                        className="h-3.5 w-3.5"
                        weight="bold"
                      />
                      Breaking Changes
                    </span>
                    {displayBreaking.map((b: any, i: number) => (
                      <div key={i} className="text-xs space-y-1">
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

                {displayTech.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-medium text-[#666666] dark:text-[#888888] uppercase tracking-wider">
                      Technical Scopes
                    </h4>
                    <div className="space-y-1.5">
                      {displayTech.map((u: any, i: number) => (
                        <div
                          key={i}
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
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
