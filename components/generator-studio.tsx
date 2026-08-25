"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useObject } from "@ai-sdk/react";
import { ChangelogSchema } from "@/lib/schemas/changelog";
import {
  Broadcast,
  Sparkle,
  Briefcase,
  User,
  Code,
  ShieldWarning,
  CheckCircle,
  Copy,
  GitCommit,
  FloppyDisk,
  ArrowUpRight,
  Globe,
  Clock,
  CaretDown,
  GithubLogo,
  ArrowClockwise,
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

export function GeneratorStudio({ projectId = "demo", projectName = "StampLog Project" }: GeneratorStudioProps) {
  const [inputLogs, setInputLogs] = useState("");
  const [activeTab, setActiveTab] = useState<"exec" | "user" | "dev">("user");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ publicUrl: string; version: string } | null>(null);

  // GitHub Repo Quick-Sync State
  const [githubRepoInput, setGithubRepoInput] = useState("");
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [repoError, setRepoError] = useState("");

  // Recent saved releases state
  const [recentReleases, setRecentReleases] = useState<SavedReleaseItem[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>("");
  const [loadedRelease, setLoadedRelease] = useState<SavedReleaseItem | null>(null);

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/releases/generate",
    schema: ChangelogSchema,
  });

  // Fetch recent saved releases from PostgreSQL on mount
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

  // Zero-Paste GitHub Repo Sync handler
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
        // Automatically trigger Gemini synthesis with fetched commits
        submit({ projectId, rawCommits: data.rawCommits });
      } else {
        setRepoError(data.error || "Failed to fetch GitHub commits");
      }
    } catch (err: any) {
      setRepoError(err?.message || "Connection error fetching GitHub repository");
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

  // Determine current active preview data (streaming object OR loaded saved release)
  const displayVersion = object?.version || loadedRelease?.version || "vX.X.X";
  const displayTitle = object?.title || loadedRelease?.title || "Release Title generating...";
  const displayExecSummary = object?.executiveSummary || loadedRelease?.executiveSummary || "";
  const displayHighlights = object?.userFacing?.highlights || loadedRelease?.userHighlights || [];
  const displayFixes = object?.userFacing?.fixes || loadedRelease?.userFixes || [];
  const displayBreaking = object?.developerFacing?.breakingChanges || loadedRelease?.breakingChanges || [];
  const displayTech = object?.developerFacing?.technicalUpdates || loadedRelease?.technicalUpdates || [];

  const handleCopyMarkdown = () => {
    const title = displayTitle;
    const version = displayVersion;
    const summary = displayExecSummary;
    const highlights = displayHighlights.map((h: any) => `- **${h?.feature}**: ${h?.benefit}`).join("\n");
    const tech = displayTech.map((u: any) => `- [${u?.scope}] ${u?.detail}`).join("\n");

    const md = `# ${title} (${version})\n\n## Executive Summary\n${summary}\n\n## User Highlights\n${highlights}\n\n## Technical Updates\n${tech}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRelease = async (status: "DRAFT" | "PUBLISHED") => {
    const currentVersion = displayVersion !== "vX.X.X" ? displayVersion : "v1.0.0";
    const currentTitle = displayTitle !== "Release Title generating..." ? displayTitle : "New Release";

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-[1280px] mx-auto font-sans">
      
      {/* Left Workbench Form (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Quick Sync GitHub Repo Card */}
        <Card className="shadow-sm border-indigo-500/20 bg-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <GithubLogo className="h-4 w-4" weight="bold" /> Zero-Paste GitHub Repo Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="owner/repo (e.g. facebook/react)"
                className="flex-1 h-9 px-3 text-xs font-mono rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={githubRepoInput}
                onChange={(e) => setGithubRepoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchGitHubCommits()}
              />
              <Button
                size="sm"
                onClick={handleFetchGitHubCommits}
                disabled={isFetchingRepo || isLoading || !githubRepoInput.trim()}
                className="h-9 px-3 gap-1.5 text-xs shadow-sm"
              >
                {isFetchingRepo ? (
                  <ArrowClockwise className="h-3.5 w-3.5 animate-spin" weight="bold" />
                ) : (
                  <GithubLogo className="h-3.5 w-3.5" weight="bold" />
                )}
                {isFetchingRepo ? "Fetching..." : "Sync & AI"}
              </Button>
            </div>
            {repoError && (
              <p className="text-[11px] text-destructive font-medium leading-none pt-1">
                {repoError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Input Workbench Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-primary" weight="bold" />
                Raw Input Workbench
              </CardTitle>

              {/* Selector for Saved Releases */}
              {recentReleases.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedReleaseId}
                    onChange={(e) => handleSelectRelease(e.target.value)}
                    className="h-8 pl-2.5 pr-6 text-xs font-mono rounded-lg border border-border bg-muted/50 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Load Saved Release --</option>
                    {recentReleases.map((rel) => (
                      <option key={rel.id} value={rel.id}>
                        {rel.version} — {rel.title.substring(0, 20)}...
                      </option>
                    ))}
                  </select>
                  <CaretDown className="h-3 w-3 absolute right-2 top-2.5 pointer-events-none text-muted-foreground" weight="bold" />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Paste Commit Logs / PR Titles / Issue Dumps
              </label>
              <textarea
                placeholder="feat(auth): add OAuth2 refresh token rotation #102&#10;fix(dashboard): resolve chart re-render memory leak #105&#10;breaking(api): deprecate v1 auth headers"
                className="w-full h-80 rounded-xl border border-border bg-muted/30 p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-none"
                value={inputLogs}
                onChange={(e) => setInputLogs(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !inputLogs.trim()}
                className="flex-1 gap-2 shadow-md shadow-indigo-500/20"
              >
                {isLoading ? (
                  <>
                    <Sparkle className="h-4 w-4 animate-spin text-primary-foreground" weight="bold" />
                    Synthesizing with Gemini...
                  </>
                ) : (
                  <>
                    <Broadcast className="h-4 w-4" weight="bold" />
                    Generate Multi-Audience Release
                  </>
                )}
              </Button>
              {isLoading && (
                <Button variant="outline" size="sm" onClick={() => stop()}>
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Real-Time Streaming Output (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <Card className="shadow-sm border-indigo-500/20">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs bg-muted">
                  {displayVersion}
                </Badge>
                {isLoading && (
                  <Badge variant="user" className="text-xs animate-pulse">
                    <Sparkle className="h-3 w-3" weight="fill" /> Streaming...
                  </Badge>
                )}
                {loadedRelease && (
                  <Badge variant="exec" className="text-xs">
                    <Clock className="h-3 w-3" weight="bold" /> Loaded from DB
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-bold mt-1">
                {displayTitle}
              </CardTitle>
            </div>

            {(object || loadedRelease) && (
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={handleCopyMarkdown} className="gap-1 text-xs">
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" weight="bold" /> : <Copy className="h-4 w-4" weight="bold" />}
                  {copied ? "Copied!" : "Copy MD"}
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSaveRelease("PUBLISHED")}
                  className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <FloppyDisk className="h-4 w-4" weight="bold" />
                  {isSaving ? "Saving..." : "Save & Publish"}
                </Button>
              </div>
            )}
          </CardHeader>

          {/* Success Banner if Saved or Loaded */}
          {saveResult && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" weight="bold" />
                Release {saveResult.version} is live on public changelog!
              </span>
              <Link href={saveResult.publicUrl} target="_blank">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <Globe className="h-3.5 w-3.5" weight="bold" />
                  View Public URL
                  <ArrowUpRight className="h-3 w-3" weight="bold" />
                </Button>
              </Link>
            </div>
          )}

          <CardContent className="p-6 space-y-5">
            
            {/* Multi-Audience View Tabs */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-xl border border-border/60">
              <button
                onClick={() => setActiveTab("user")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "user"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" weight="bold" /> Customer View
              </button>
              <button
                onClick={() => setActiveTab("exec")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "exec"
                    ? "bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="h-4 w-4" weight="bold" /> Executive View
              </button>
              <button
                onClick={() => setActiveTab("dev")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "dev"
                    ? "bg-card text-indigo-600 dark:text-indigo-400 shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code className="h-4 w-4" weight="bold" /> Engineering View
              </button>
            </div>

            {/* TAB CONTENT: Customer View */}
            {activeTab === "user" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    New Features & Enhancements
                  </h4>
                  {displayHighlights.length > 0 ? (
                    <ul className="space-y-2">
                      {displayHighlights.map((h: any, i: number) => (
                        <li key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs leading-relaxed">
                          <strong className="text-foreground font-semibold">{h?.feature}:</strong>{" "}
                          <span className="text-muted-foreground">{h?.benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Awaiting feature highlights stream...</p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Resolved Customer Issues
                  </h4>
                  {displayFixes.length > 0 ? (
                    <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                      {displayFixes.map((f: any, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No bug fixes reported yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Executive View */}
            {activeTab === "exec" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" weight="bold" /> Executive Summary
                  </span>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {displayExecSummary || "Generating strategic summary for leadership..."}
                  </p>
                </div>
                <AudienceMeter execPercent={30} userPercent={50} devPercent={20} />
              </div>
            )}

            {/* TAB CONTENT: Developer View */}
            {activeTab === "dev" && (
              <div className="space-y-4">
                {displayBreaking.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
                    <span className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldWarning className="h-4 w-4" weight="bold" /> Breaking Changes Detected
                    </span>
                    {displayBreaking.map((b: any, i: number) => (
                      <div key={i} className="text-xs space-y-1">
                        <code className="bg-background/80 px-1.5 py-0.5 rounded text-destructive font-mono font-semibold">
                          {b?.target}
                        </code>
                        <p className="text-muted-foreground pl-2 border-l-2 border-destructive/40">
                          {b?.migrationStep}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Technical & Infrastructure Scopes
                  </h4>
                  {displayTech.length > 0 ? (
                    <div className="space-y-2">
                      {displayTech.map((u: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-start gap-2 text-xs">
                          <Badge variant="dev" className="font-mono text-[10px] shrink-0">
                            {u?.scope}
                          </Badge>
                          <span className="text-muted-foreground">{u?.detail}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Awaiting technical updates stream...</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
