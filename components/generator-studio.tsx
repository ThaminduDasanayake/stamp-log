"use client";

import React, { useState } from "react";
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
  ArrowRight,
  GitCommit,
  Clock,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudienceMeter } from "@/components/ui/audience-meter";

interface GeneratorStudioProps {
  projectId?: string;
  projectName?: string;
}

export function GeneratorStudio({ projectId, projectName = "StampLog Project" }: GeneratorStudioProps) {
  const [inputLogs, setInputLogs] = useState("");
  const [activeTab, setActiveTab] = useState<"exec" | "user" | "dev">("user");
  const [copied, setCopied] = useState(false);

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/releases/generate",
    schema: ChangelogSchema,
  });

  const handleGenerate = () => {
    if (!inputLogs.trim()) return;
    submit({ projectId, rawCommits: inputLogs });
  };

  const handleCopyMarkdown = () => {
    if (!object) return;
    const md = `# ${object.title || "Release Notes"} (${object.version || "v1.0.0"})\n\n## Executive Summary\n${object.executiveSummary || ""}\n\n## User Highlights\n${object.userFacing?.highlights?.map((h: any) => `- **${h?.feature}**: ${h?.benefit}`).join("\n") || ""}\n\n## Technical Updates\n${object.developerFacing?.technicalUpdates?.map((u: any) => `- [${u?.scope}] ${u?.detail}`).join("\n") || ""}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-[1280px] mx-auto font-sans">
      
      {/* Left Workbench Form (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-primary" weight="bold" />
                Raw Input Workbench
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                Gemini 3.6 Flash
              </Badge>
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
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs bg-muted">
                  {object?.version || "vX.X.X"}
                </Badge>
                {isLoading && (
                  <Badge variant="user" className="text-xs animate-pulse">
                    <Sparkle className="h-3 w-3" weight="fill" /> Streaming...
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-bold mt-1">
                {object?.title || "Release Title generating..."}
              </CardTitle>
            </div>

            {object && (
              <Button variant="outline" size="sm" onClick={handleCopyMarkdown} className="gap-1.5 text-xs">
                {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" weight="bold" /> : <Copy className="h-4 w-4" weight="bold" />}
                {copied ? "Copied!" : "Copy MD"}
              </Button>
            )}
          </CardHeader>

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
                  {object?.userFacing?.highlights && object.userFacing.highlights.length > 0 ? (
                    <ul className="space-y-2">
                      {object.userFacing.highlights.map((h: any, i: number) => (
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
                  {object?.userFacing?.fixes && object.userFacing.fixes.length > 0 ? (
                    <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                      {object.userFacing.fixes.map((f: any, i: number) => (
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
                    {object?.executiveSummary || "Generating strategic summary for leadership..."}
                  </p>
                </div>
                <AudienceMeter execPercent={30} userPercent={50} devPercent={20} />
              </div>
            )}

            {/* TAB CONTENT: Developer View */}
            {activeTab === "dev" && (
              <div className="space-y-4">
                {object?.developerFacing?.breakingChanges && object.developerFacing.breakingChanges.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
                    <span className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldWarning className="h-4 w-4" weight="bold" /> Breaking Changes Detected
                    </span>
                    {object.developerFacing.breakingChanges.map((b: any, i: number) => (
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
                  {object?.developerFacing?.technicalUpdates && object.developerFacing.technicalUpdates.length > 0 ? (
                    <div className="space-y-2">
                      {object.developerFacing.technicalUpdates.map((u: any, i: number) => (
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
