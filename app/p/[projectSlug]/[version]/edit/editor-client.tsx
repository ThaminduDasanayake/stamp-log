"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CodeIcon,
  FloppyDiskIcon,
  GlobeIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReleaseEditorProps {
  release: {
    id: string;
    version: string;
    title: string;
    status: string;
    executiveSummary: string;
    userHighlights: { feature: string; benefit: string }[];
    userFixes: string[];
    breakingChanges: { target: string; migrationStep: string }[];
    technicalUpdates: { scope: string; detail: string }[];
    projectSlug: string;
    projectName: string;
  };
}

export function InlineReleaseEditorClient({ release }: ReleaseEditorProps) {
  const [version, setVersion] = useState(release.version);
  const [title, setTitle] = useState(release.title);
  const [status, setStatus] = useState(release.status);
  const [executiveSummary, setExecutiveSummary] = useState(
    release.executiveSummary,
  );

  const [userHighlights, setUserHighlights] = useState(release.userHighlights);
  const [userFixes, setUserFixes] = useState(release.userFixes);
  const [breakingChanges, setBreakingChanges] = useState(
    release.breakingChanges,
  );
  const [technicalUpdates, setTechnicalUpdates] = useState(
    release.technicalUpdates,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<{
    publicUrl: string;
    version: string;
  } | null>(null);

  const handleAddHighlight = () => {
    setUserHighlights([
      ...userHighlights,
      { feature: "New Feature", benefit: "User benefit" },
    ]);
  };

  const handleRemoveHighlight = (index: number) => {
    setUserHighlights(userHighlights.filter((_, i) => i !== index));
  };

  const handleAddFix = () => {
    setUserFixes([...userFixes, "Resolved customer issue description"]);
  };

  const handleRemoveFix = (index: number) => {
    setUserFixes(userFixes.filter((_, i) => i !== index));
  };

  const handleAddBreaking = () => {
    setBreakingChanges([
      ...breakingChanges,
      {
        target: "Module / API",
        migrationStep: "Required developer migration action",
      },
    ]);
  };

  const handleRemoveBreaking = (index: number) => {
    setBreakingChanges(breakingChanges.filter((_, i) => i !== index));
  };

  const handleAddTech = () => {
    setTechnicalUpdates([
      ...technicalUpdates,
      { scope: "Internal Scope", detail: "Technical note" },
    ]);
  };

  const handleRemoveTech = (index: number) => {
    setTechnicalUpdates(technicalUpdates.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const res = await fetch("/api/releases/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          releaseId: release.id,
          version,
          title,
          executiveSummary,
          userHighlights,
          userFixes,
          breakingChanges,
          technicalUpdates,
          status,
        }),
      });

      const data = await res.json();
      if (data.success && data.release?.publicUrl) {
        setSaveSuccess({
          publicUrl: data.release.publicUrl,
          version: data.release.version,
        });
      }
    } catch (err) {
      console.error("Error saving edits:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Header */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="max-w-[900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/p/${release.projectSlug}/${encodeURIComponent(release.version)}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-6 w-6 bg-[#171717] dark:bg-white flex items-center justify-center rounded-[3px]">
                <svg
                  className="h-3.5 w-3.5 fill-white dark:fill-black"
                  viewBox="0 0 76 65"
                  aria-hidden="true"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>
            </Link>
            <div>
              <h1 className="text-sm font-medium tracking-tight text-[#171717] dark:text-white flex items-center gap-2">
                Edit Release Notes
                <Badge variant="pixel" className="text-[10px]">
                  {version}
                </Badge>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/p/${release.projectSlug}/${encodeURIComponent(release.version)}`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs text-[#666666] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white gap-1"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" /> Cancel
              </Button>
            </Link>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="h-8 px-3.5 gap-1.5 text-xs font-medium"
            >
              {isSaving ? (
                <SparkleIcon
                  className="h-3.5 w-3.5 animate-spin"
                  weight="fill"
                />
              ) : (
                <FloppyDiskIcon className="h-3.5 w-3.5" weight="bold" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-8 space-y-6">
        {saveSuccess && (
          <div className="p-3 rounded-[4px] bg-[#00876c]/8 border border-[#00876c]/25 flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-[#00876c] font-medium">
              <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" weight="bold" />
              Release {saveSuccess.version} saved successfully!
            </span>
            <Link href={saveSuccess.publicUrl} target="_blank">
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

        {/* Release Meta Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888]">
              Release Meta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-1">
              <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block">
                Release Title
              </label>
              <input
                type="text"
                className="w-full h-8 px-3 text-xs font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block">
                Version Tag
              </label>
              <input
                type="text"
                className="w-full h-8 px-3 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-8 px-2.5 text-xs font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f]">
            <CardTitle className="text-xs font-medium text-[#bd5200] uppercase tracking-wider flex items-center gap-1.5">
              <BriefcaseIcon className="h-3.5 w-3.5" weight="bold" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <textarea
              className="w-full h-20 p-2.5 rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-[#fafafa] dark:bg-[#111111] text-xs text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3] leading-relaxed resize-none"
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Customer Highlights */}
        <Card>
          <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-[#00876c] uppercase tracking-wider flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" weight="bold" />
              Customer Feature Highlights
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddHighlight}
              className="h-7 text-xs gap-1"
            >
              <PlusIcon className="h-3 w-3" weight="bold" /> Add Feature
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {userHighlights.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-[4px] border border-[#ebebeb] dark:border-[#222222] bg-[#fafafa] dark:bg-[#111111] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Feature Name"
                    className="flex-1 h-7 px-2 text-xs font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                    value={h.feature}
                    onChange={(e) => {
                      const updated = [...userHighlights];
                      updated[i].feature = e.target.value;
                      setUserHighlights(updated);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveHighlight(i)}
                    className="h-7 w-7 text-[#ee0000] hover:bg-[#ee0000]/10 shrink-0"
                  >
                    <TrashIcon className="h-3.5 w-3.5" weight="bold" />
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Benefit detail"
                  className="w-full h-7 px-2 text-xs rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#666666] dark:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                  value={h.benefit}
                  onChange={(e) => {
                    const updated = [...userHighlights];
                    updated[i].benefit = e.target.value;
                    setUserHighlights(updated);
                  }}
                />
              </div>
            ))}

            {/* Fixes */}
            <div className="pt-3 border-t border-[#ebebeb] dark:border-[#1f1f1f] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#666666] dark:text-[#888888]">
                  Bug Fixes
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddFix}
                  className="h-6 text-[11px] px-2 gap-1"
                >
                  <PlusIcon className="h-3 w-3" weight="bold" /> Add Fix
                </Button>
              </div>
              {userFixes.map((fix, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 h-7 px-2 text-xs rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                    value={fix}
                    onChange={(e) => {
                      const updated = [...userFixes];
                      updated[i] = e.target.value;
                      setUserFixes(updated);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveFix(i)}
                    className="h-7 w-7 text-[#ee0000] hover:bg-[#ee0000]/10 shrink-0"
                  >
                    <TrashIcon className="h-3.5 w-3.5" weight="bold" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Developer Notes */}
        <Card>
          <CardHeader className="pb-3 border-b border-[#ebebeb] dark:border-[#1f1f1f] flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-[#0070f3] uppercase tracking-wider flex items-center gap-1.5">
              <CodeIcon className="h-3.5 w-3.5" weight="bold" />
              Developer Notes &amp; Breaking Changes
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddBreaking}
              className="h-7 text-xs gap-1"
            >
              <PlusIcon className="h-3 w-3" weight="bold" /> Add Breaking Change
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {breakingChanges.map((b, i) => (
              <div
                key={i}
                className="p-3 rounded-[4px] border border-[#ee0000]/20 bg-[#ee0000]/5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Target Module / API"
                    className="flex-1 h-7 px-2 text-xs font-mono font-medium text-[#ee0000] rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                    value={b.target}
                    onChange={(e) => {
                      const updated = [...breakingChanges];
                      updated[i].target = e.target.value;
                      setBreakingChanges(updated);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveBreaking(i)}
                    className="h-7 w-7 text-[#ee0000] hover:bg-[#ee0000]/10 shrink-0"
                  >
                    <TrashIcon className="h-3.5 w-3.5" weight="bold" />
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Migration Step"
                  className="w-full h-7 px-2 text-xs rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#666666] dark:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                  value={b.migrationStep}
                  onChange={(e) => {
                    const updated = [...breakingChanges];
                    updated[i].migrationStep = e.target.value;
                    setBreakingChanges(updated);
                  }}
                />
              </div>
            ))}

            {/* Technical Scopes */}
            <div className="pt-3 border-t border-[#ebebeb] dark:border-[#1f1f1f] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#666666] dark:text-[#888888]">
                  Technical Scopes
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddTech}
                  className="h-6 text-[11px] px-2 gap-1"
                >
                  <PlusIcon className="h-3 w-3" weight="bold" /> Add Scope
                </Button>
              </div>
              {technicalUpdates.map((u, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Scope"
                    className="w-24 h-7 px-2 text-xs font-mono font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3] shrink-0"
                    value={u.scope}
                    onChange={(e) => {
                      const updated = [...technicalUpdates];
                      updated[i].scope = e.target.value;
                      setTechnicalUpdates(updated);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Technical detail"
                    className="flex-1 h-7 px-2 text-xs rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#666666] dark:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                    value={u.detail}
                    onChange={(e) => {
                      const updated = [...technicalUpdates];
                      updated[i].detail = e.target.value;
                      setTechnicalUpdates(updated);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveTech(i)}
                    className="h-7 w-7 text-[#ee0000] hover:bg-[#ee0000]/10 shrink-0"
                  >
                    <TrashIcon className="h-3.5 w-3.5" weight="bold" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
