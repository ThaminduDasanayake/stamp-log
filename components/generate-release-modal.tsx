"use client";

import React, { useState, useEffect } from "react";
import { useObject } from "@ai-sdk/react";
import { ChangelogSchema } from "@/lib/schemas/changelog";
import {
  BroadcastIcon,
  SparkleIcon,
  GithubLogoIcon,
  BriefcaseIcon,
  UserIcon,
  CodeIcon,
  ShieldWarningIcon,
  FloppyDiskIcon,
  XIcon,
  ArrowClockwiseIcon,
  GitCommitIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";

interface GenerateReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    slug: string;
    githubRepo?: string | null;
    defaultBranch?: string;
  };
  onReleaseCreated: () => void;
}

export function GenerateReleaseModal({
  isOpen,
  onClose,
  project,
  onReleaseCreated,
}: GenerateReleaseModalProps) {
  const [inputMode, setInputMode] = useState<"github" | "manual">("github");
  const [githubRepoInput, setGithubRepoInput] = useState(project.githubRepo || "");
  const [rawCommitsInput, setRawCommitsInput] = useState("");
  const [activeTab, setActiveTab] = useState<"exec" | "user" | "dev">("user");

  const [isFetchingCommits, setIsFetchingCommits] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/releases/generate",
    schema: ChangelogSchema,
  });

  useEffect(() => {
    if (project.githubRepo) {
      setGithubRepoInput(project.githubRepo);
    }
  }, [project]);

  if (!isOpen) return null;

  // Auto-fetch commits from GitHub and trigger AI synthesis
  const handleFetchAndGenerate = async () => {
    const targetRepo = githubRepoInput.trim() || project.githubRepo;
    if (!targetRepo) {
      setFetchError("Please enter a GitHub repository (owner/repo)");
      return;
    }

    setIsFetchingCommits(true);
    setFetchError("");

    try {
      const res = await fetch("/api/github/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: targetRepo, branch: project.defaultBranch }),
      });
      const data = await res.json();

      if (data.success && data.rawCommits) {
        setRawCommitsInput(data.rawCommits);
        submit({ projectId: project.id, rawCommits: data.rawCommits });
      } else {
        setFetchError(data.error || "Failed to fetch GitHub commits");
      }
    } catch (err: any) {
      setFetchError(err?.message || "Connection error fetching commits");
    } finally {
      setIsFetchingCommits(false);
    }
  };

  const handleManualGenerate = () => {
    if (!rawCommitsInput.trim()) return;
    submit({ projectId: project.id, rawCommits: rawCommitsInput });
  };

  const handleSaveAndPublish = async (status: "DRAFT" | "PUBLISHED") => {
    if (!object) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/releases/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          projectSlug: project.slug,
          projectName: project.name,
          version: object.version || "v1.0.0",
          title: object.title || "New Release",
          rawCommits: rawCommitsInput,
          executiveSummary: object.executiveSummary || "",
          userHighlights: object.userFacing?.highlights || [],
          userFixes: object.userFacing?.fixes || [],
          breakingChanges: object.developerFacing?.breakingChanges || [],
          technicalUpdates: object.developerFacing?.technicalUpdates || [],
          status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onReleaseCreated();
        onClose();
      }
    } catch (err) {
      console.error("Error saving release note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
              <BroadcastIcon className="h-6 w-6" weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Generate New Release
                <Badge variant="dev" className="text-xs">
                  <SparkleIcon className="h-3.5 w-3.5" weight="fill" /> Gemini 3.6 Flash
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">Project: {project.name}</p>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} className="rounded-xl">
            <XIcon className="h-5 w-5" weight="bold" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Input Mode Selector */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-xl border border-border/60 max-w-md">
            <button
              onClick={() => setInputMode("github")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                inputMode === "github"
                  ? "bg-card text-primary shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GithubLogoIcon className="h-4 w-4" weight="bold" /> 1-Click GitHub Sync
            </button>

            <button
              onClick={() => setInputMode("manual")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                inputMode === "manual"
                  ? "bg-card text-primary shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitCommitIcon className="h-4 w-4" weight="bold" /> Manual Paste
            </button>
          </div>

          {/* Mode 1: GitHub Sync Input */}
          {inputMode === "github" ? (
            <Card className="border-indigo-500/20 bg-accent/20">
              <CardContent className="p-4 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-primary block">
                  GitHub Repository (owner/repo)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ThaminduDasanayake/relay or facebook/react"
                    className="flex-1 h-10 px-3.5 text-xs font-mono rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={githubRepoInput}
                    onChange={(e) => setGithubRepoInput(e.target.value)}
                  />
                  <Button
                    onClick={handleFetchAndGenerate}
                    disabled={isFetchingCommits || isLoading || !githubRepoInput.trim()}
                    className="h-10 px-5 gap-2 text-xs shadow-md shadow-indigo-500/20"
                  >
                    {isFetchingCommits || isLoading ? (
                      <ArrowClockwiseIcon className="h-4 w-4 animate-spin" weight="bold" />
                    ) : (
                      <GithubLogoIcon className="h-4 w-4" weight="bold" />
                    )}
                    {isFetchingCommits ? "Fetching Commits..." : isLoading ? "Streaming AI..." : "Sync & Synthesize"}
                  </Button>
                </div>
                {fetchError && (
                  <p className="text-xs text-destructive font-medium">{fetchError}</p>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Mode 2: Manual Textarea Input */
            <Card>
              <CardContent className="p-4 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Paste Raw Commit Logs / PR Titles / Issue Notes
                </label>
                <textarea
                  placeholder="feat(auth): add OAuth2 refresh token rotation #102&#10;fix(dashboard): resolve chart re-render memory leak #105"
                  className="w-full h-36 p-3 text-xs font-mono rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  value={rawCommitsInput}
                  onChange={(e) => setRawCommitsInput(e.target.value)}
                />
                <Button
                  onClick={handleManualGenerate}
                  disabled={isLoading || !rawCommitsInput.trim()}
                  className="w-full h-10 gap-2 text-xs shadow-md shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <SparkleIcon className="h-4 w-4 animate-spin text-primary-foreground" weight="bold" />
                  ) : (
                    <BroadcastIcon className="h-4 w-4" weight="bold" />
                  )}
                  {isLoading ? "Synthesizing AI..." : "Generate Multi-Audience Release"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* AI Output Stream Preview */}
          {object && (
            <Card className="border-indigo-500/30 shadow-md">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <Badge variant="outline" className="font-mono text-xs mb-1">
                    {object.version || "v1.0.0"}
                  </Badge>
                  <CardTitle className="text-base font-bold text-foreground">
                    {object.title || "Generating release title..."}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isSaving}
                    onClick={() => handleSaveAndPublish("PUBLISHED")}
                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    <FloppyDiskIcon className="h-4 w-4" weight="bold" />
                    {isSaving ? "Publishing..." : "Save & Publish to Timeline"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                
                {/* Multi-Audience Tabs */}
                <div className="flex items-center gap-2 p-1 bg-muted rounded-xl border border-border/60">
                  <button
                    onClick={() => setActiveTab("user")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === "user"
                        ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserIcon className="h-4 w-4" weight="bold" /> Customer View
                  </button>
                  <button
                    onClick={() => setActiveTab("exec")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === "exec"
                        ? "bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BriefcaseIcon className="h-4 w-4" weight="bold" /> Executive View
                  </button>
                  <button
                    onClick={() => setActiveTab("dev")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === "dev"
                        ? "bg-card text-indigo-600 dark:text-indigo-400 shadow-sm border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CodeIcon className="h-4 w-4" weight="bold" /> Engineering View
                  </button>
                </div>

                {/* Tab 1: Customer View */}
                {activeTab === "user" && (
                  <div className="space-y-3 text-xs">
                    {object.userFacing?.highlights && object.userFacing.highlights.length > 0 ? (
                      <div className="space-y-2">
                        {object.userFacing.highlights.map((h: any, i: number) => (
                          <div key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                            <strong className="text-foreground font-semibold">{h?.feature}:</strong>{" "}
                            <span className="text-muted-foreground">{h?.benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Awaiting feature highlights...</p>
                    )}
                  </div>
                )}

                {/* Tab 2: Executive View */}
                {activeTab === "exec" && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs font-medium text-foreground leading-relaxed">
                        {object.executiveSummary || "Generating strategic summary..."}
                      </p>
                    </div>
                    <AudienceMeter execPercent={30} userPercent={50} devPercent={20} />
                  </div>
                )}

                {/* Tab 3: Engineering View */}
                {activeTab === "dev" && (
                  <div className="space-y-3 text-xs">
                    {object.developerFacing?.breakingChanges && object.developerFacing.breakingChanges.length > 0 && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1">
                        <span className="text-xs font-bold text-destructive flex items-center gap-1">
                          <ShieldWarningIcon className="h-4 w-4" weight="bold" /> Breaking Changes
                        </span>
                        {object.developerFacing.breakingChanges.map((b: any, i: number) => (
                          <div key={i}>
                            <code className="bg-background px-1.5 py-0.5 rounded text-destructive font-mono font-semibold">
                              {b?.target}
                            </code>
                            <p className="text-muted-foreground pl-2">{b?.migrationStep}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
