"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Broadcast,
  CheckCircle,
  Briefcase,
  User,
  Code,
  ShieldWarning,
  ArrowLeft,
  FloppyDisk,
  Plus,
  Trash,
  Globe,
  ArrowUpRight,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  const [executiveSummary, setExecutiveSummary] = useState(release.executiveSummary);

  const [userHighlights, setUserHighlights] = useState(release.userHighlights);
  const [userFixes, setUserFixes] = useState(release.userFixes);
  const [breakingChanges, setBreakingChanges] = useState(release.breakingChanges);
  const [technicalUpdates, setTechnicalUpdates] = useState(release.technicalUpdates);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<{ publicUrl: string; version: string } | null>(null);

  // Handlers for dynamic list items
  const handleAddHighlight = () => {
    setUserHighlights([...userHighlights, { feature: "New Feature", benefit: "Explain benefit to user" }]);
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
    setBreakingChanges([...breakingChanges, { target: "Module / API", migrationStep: "Required developer action" }]);
  };

  const handleRemoveBreaking = (index: number) => {
    setBreakingChanges(breakingChanges.filter((_, i) => i !== index));
  };

  const handleAddTech = () => {
    setTechnicalUpdates([...technicalUpdates, { scope: "Internal Scope", detail: "Technical implementation note" }]);
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
        setSaveSuccess({ publicUrl: data.release.publicUrl, version: data.release.version });
      }
    } catch (err) {
      console.error("Error saving edits:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/p/${release.projectSlug}/${encodeURIComponent(release.version)}`} className="hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
                <Broadcast className="h-5 w-5" weight="bold" />
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                Edit Release Notes
                <Badge variant="outline" className="font-mono text-xs">
                  {version}
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">{release.projectName} • Interactive Multi-Persona Editor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/p/${release.projectSlug}/${encodeURIComponent(release.version)}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-4 w-4" weight="bold" /> Cancel
              </Button>
            </Link>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="gap-2 text-xs shadow-md shadow-indigo-500/20 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSaving ? (
                <Sparkle className="h-4 w-4 animate-spin" weight="bold" />
              ) : (
                <FloppyDisk className="h-4 w-4" weight="bold" />
              )}
              {isSaving ? "Saving Edits..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Editor Form */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Success Banner */}
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" weight="bold" />
              Release {saveSuccess.version} successfully updated in database!
            </span>
            <Link href={saveSuccess.publicUrl} target="_blank">
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <Globe className="h-3.5 w-3.5" weight="bold" />
                View Updated Changelog
                <ArrowUpRight className="h-3 w-3" weight="bold" />
              </Button>
            </Link>
          </div>
        )}

        {/* Release Meta Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Release Meta &amp; Status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-8 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Release Title
              </label>
              <input
                type="text"
                className="w-full h-10 px-3.5 text-sm font-bold rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Version Tag
              </label>
              <input
                type="text"
                className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>

          </CardContent>
        </Card>

        {/* Executive View Section */}
        <Card className="border-amber-500/30 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Briefcase className="h-4 w-4" weight="bold" /> Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <textarea
              className="w-full h-24 p-3 rounded-xl border border-border bg-muted/30 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-none"
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Customer View Section */}
        <Card className="border-emerald-500/30 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <User className="h-4 w-4" weight="bold" /> Customer Feature Highlights &amp; Benefits
            </CardTitle>
            <Button size="sm" variant="outline" onClick={handleAddHighlight} className="h-7 text-xs gap-1">
              <Plus className="h-3.5 w-3.5" weight="bold" /> Add Feature
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {userHighlights.map((h, i) => (
              <div key={i} className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2 relative group">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Feature Name"
                    className="flex-1 h-8 px-2.5 text-xs font-bold rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash className="h-4 w-4" weight="bold" />
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="User Benefit detail"
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={h.benefit}
                  onChange={(e) => {
                    const updated = [...userHighlights];
                    updated[i].benefit = e.target.value;
                    setUserHighlights(updated);
                  }}
                />
              </div>
            ))}

            {/* Resolved Fixes Sub-section */}
            <div className="pt-3 border-t border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resolved Customer Bug Fixes
                </span>
                <Button size="sm" variant="outline" onClick={handleAddFix} className="h-6 text-[11px] px-2 gap-1">
                  <Plus className="h-3 w-3" weight="bold" /> Add Bug Fix
                </Button>
              </div>
              {userFixes.map((fix, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash className="h-3.5 w-3.5" weight="bold" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Developer View Section */}
        <Card className="border-indigo-500/30 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Code className="h-4 w-4" weight="bold" /> Developer Breaking Changes &amp; Scopes
            </CardTitle>
            <Button size="sm" variant="outline" onClick={handleAddBreaking} className="h-7 text-xs gap-1">
              <Plus className="h-3.5 w-3.5" weight="bold" /> Add Breaking Change
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Breaking Changes */}
            {breakingChanges.map((b, i) => (
              <div key={i} className="p-3 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Target Module / API"
                    className="flex-1 h-8 px-2.5 text-xs font-mono font-bold text-destructive rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
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
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash className="h-4 w-4" weight="bold" />
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Required Developer Migration Action"
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
            <div className="pt-3 border-t border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Technical Scopes &amp; Infrastructure Items
                </span>
                <Button size="sm" variant="outline" onClick={handleAddTech} className="h-6 text-[11px] px-2 gap-1">
                  <Plus className="h-3 w-3" weight="bold" /> Add Scope
                </Button>
              </div>
              {technicalUpdates.map((u, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Scope (e.g. CI/CD, DB)"
                    className="w-28 h-8 px-2.5 text-xs font-mono font-bold rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
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
                    className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash className="h-3.5 w-3.5" weight="bold" />
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
