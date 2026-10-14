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
  const [githubRepoInput, setGithubRepoInput] = useState(
    project.githubRepo || "",
  );
  const [rawCommitsInput, setRawCommitsInput] = useState("");
  const [activeTab, setActiveTab] = useState<"user" | "exec" | "dev">("user");

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
        body: JSON.stringify({
          repo: targetRepo,
          branch: project.defaultBranch,
        }),
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] rounded-[6px] max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-[#171717] dark:text-white">
                Generate Release
              </h2>
              <Badge variant="pixel" className="text-[10px]">
                {project.name}
              </Badge>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#888888]">
              Synthesize multi-audience release notes with Gemini Flash
            </p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-[#8f8f8f] hover:text-[#171717] dark:hover:text-white"
          >
            <XIcon className="h-4 w-4" weight="bold" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1">
          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-0.5 bg-[#f5f5f5] dark:bg-[#111111] rounded-[4px] border border-[#ebebeb] dark:border-[#222222] max-w-xs">
            <button
              onClick={() => setInputMode("github")}
              className={`flex-1 py-1.5 px-3 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                inputMode === "github"
                  ? "bg-white dark:bg-[#1f1f1f] text-[#171717] dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                  : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
              }`}
            >
              <GithubLogoIcon className="h-3.5 w-3.5" weight="bold" />
              GitHub Sync
            </button>

            <button
              onClick={() => setInputMode("manual")}
              className={`flex-1 py-1.5 px-3 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                inputMode === "manual"
                  ? "bg-white dark:bg-[#1f1f1f] text-[#171717] dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                  : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
              }`}
            >
              <GitCommitIcon className="h-3.5 w-3.5" weight="bold" />
              Manual Logs
            </button>
          </div>

          {/* Mode 1: GitHub Sync */}
          {inputMode === "github" ? (
            <Card className="bg-[#fafafa] dark:bg-[#080808]">
              <CardContent className="p-4 space-y-3">
                <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block">
                  GitHub Repository (owner/repo)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. facebook/react or vercel/next.js"
                    className="flex-1 h-9 px-3 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                    value={githubRepoInput}
                    onChange={(e) => setGithubRepoInput(e.target.value)}
                  />
                  <Button
                    onClick={handleFetchAndGenerate}
                    disabled={
                      isFetchingCommits || isLoading || !githubRepoInput.trim()
                    }
                    className="h-9 px-4 gap-2 text-xs font-medium"
                  >
                    {isFetchingCommits || isLoading ? (
                      <ArrowClockwiseIcon
                        className="h-3.5 w-3.5 animate-spin"
                        weight="bold"
                      />
                    ) : (
                      <SparkleIcon className="h-3.5 w-3.5" weight="fill" />
                    )}
                    {isFetchingCommits
                      ? "Fetching..."
                      : isLoading
                        ? "Synthesizing..."
                        : "Fetch & Synthesize"}
                  </Button>
                </div>
                {fetchError && (
                  <p className="text-xs text-[#ee0000] font-medium">
                    {fetchError}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Mode 2: Manual Logs */
            <Card className="bg-[#fafafa] dark:bg-[#080808]">
              <CardContent className="p-4 space-y-3">
                <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block">
                  Paste Git Commits / PR Notes
                </label>
                <textarea
                  placeholder="feat(auth): add OAuth2 refresh token rotation #102&#10;fix(dashboard): resolve chart memory leak #105"
                  className="w-full h-32 p-3 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3] resize-none leading-relaxed"
                  value={rawCommitsInput}
                  onChange={(e) => setRawCommitsInput(e.target.value)}
                />
                <Button
                  onClick={handleManualGenerate}
                  disabled={isLoading || !rawCommitsInput.trim()}
                  className="w-full h-9 gap-2 text-xs font-medium"
                >
                  {isLoading ? (
                    <SparkleIcon
                      className="h-3.5 w-3.5 animate-spin"
                      weight="fill"
                    />
                  ) : (
                    <SparkleIcon className="h-3.5 w-3.5" weight="fill" />
                  )}
                  {isLoading ? "Synthesizing AI..." : "Generate Release Notes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* AI Output Stream Preview */}
          {object && (
            <Card className="border-[#ebebeb] dark:border-[#262626]">
              <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex flex-row items-center justify-between">
                <div>
                  <Badge variant="pixel" className="text-[10px] mb-1">
                    {object.version || "v1.0.0"}
                  </Badge>
                  <CardTitle className="text-sm font-medium">
                    {object.title || "Generating release title..."}
                  </CardTitle>
                </div>

                <Button
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSaveAndPublish("PUBLISHED")}
                  className="h-8 gap-1.5 text-xs font-medium"
                >
                  <FloppyDiskIcon className="h-3.5 w-3.5" weight="bold" />
                  {isSaving ? "Saving..." : "Publish to Timeline"}
                </Button>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Persona Segment Tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-[#f5f5f5] dark:bg-[#111111] rounded-[4px] border border-[#ebebeb] dark:border-[#222222] max-w-sm">
                  <button
                    onClick={() => setActiveTab("user")}
                    className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                      activeTab === "user"
                        ? "bg-white dark:bg-[#1f1f1f] text-[#00876c] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                        : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                    }`}
                  >
                    <UserIcon className="h-3 w-3" weight="bold" />
                    Customer
                  </button>
                  <button
                    onClick={() => setActiveTab("exec")}
                    className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                      activeTab === "exec"
                        ? "bg-white dark:bg-[#1f1f1f] text-[#bd5200] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                        : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                    }`}
                  >
                    <BriefcaseIcon className="h-3 w-3" weight="bold" />
                    Executive
                  </button>
                  <button
                    onClick={() => setActiveTab("dev")}
                    className={`flex-1 py-1 px-2.5 rounded-[3px] text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                      activeTab === "dev"
                        ? "bg-white dark:bg-[#1f1f1f] text-[#0070f3] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ebebeb] dark:border-[#262626]"
                        : "text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white"
                    }`}
                  >
                    <CodeIcon className="h-3 w-3" weight="bold" />
                    Developer
                  </button>
                </div>

                {/* View 1: Customer */}
                {activeTab === "user" && (
                  <div className="space-y-2 text-xs">
                    {object.userFacing?.highlights &&
                    object.userFacing.highlights.length > 0 ? (
                      <div className="space-y-1.5">
                        {object.userFacing.highlights.map(
                          (h: any, i: number) => (
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
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8f8f8f] italic">
                        Awaiting feature stream...
                      </p>
                    )}
                  </div>
                )}

                {/* View 2: Executive */}
                {activeTab === "exec" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-[4px] bg-[#fafafa] dark:bg-[#111111] border border-[#ebebeb] dark:border-[#222222]">
                      <p className="text-xs text-[#171717] dark:text-[#ededed] leading-relaxed">
                        {object.executiveSummary ||
                          "Generating strategic executive summary..."}
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
                {activeTab === "dev" && (
                  <div className="space-y-2 text-xs">
                    {object.developerFacing?.breakingChanges &&
                      object.developerFacing.breakingChanges.length > 0 && (
                        <div className="p-2.5 rounded-[4px] bg-[#ee0000]/5 border border-[#ee0000]/20 space-y-1">
                          <span className="text-xs font-medium text-[#ee0000] flex items-center gap-1">
                            <ShieldWarningIcon
                              className="h-3.5 w-3.5"
                              weight="bold"
                            />
                            Breaking Changes
                          </span>
                          {object.developerFacing.breakingChanges.map(
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
