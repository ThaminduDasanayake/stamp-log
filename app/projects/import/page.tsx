"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GithubLogo,
  Broadcast,
  CheckCircle,
  ArrowRight,
  Sparkle,
  Star,
  GitBranch,
  MagnifyingGlass,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RepoItem {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  defaultBranch: string;
  isPrivate: boolean;
  stars: number;
}

export default function ImportProjectsPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [importingRepo, setImportingRepo] = useState<string | null>(null);
  const [importedProjects, setImportedProjects] = useState<Record<string, string>>({});

  const handleFetchRepos = async () => {
    if (!usernameInput.trim()) return;
    setIsLoading(true);
    setError("");
    setRepos([]);

    try {
      const res = await fetch("/api/github/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput.trim() }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.repos)) {
        setRepos(data.repos);
      } else {
        setError(data.error || "Failed to fetch repositories for username");
      }
    } catch (err: any) {
      setError(err?.message || "Connection error fetching repositories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportRepo = async (repo: RepoItem) => {
    setImportingRepo(repo.fullName);
    try {
      const res = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repo.fullName,
          name: repo.name,
          description: repo.description,
          defaultBranch: repo.defaultBranch,
        }),
      });

      const data = await res.json();
      if (data.success && data.project?.publicUrl) {
        setImportedProjects((prev) => ({
          ...prev,
          [repo.fullName]: data.project.publicUrl,
        }));
      }
    } catch (err) {
      console.error("Error importing repository:", err);
    } finally {
      setImportingRepo(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
                <Broadcast className="h-5 w-5" weight="bold" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Import GitHub Repository
              </h1>
              <p className="text-xs text-muted-foreground">Connect your GitHub repositories as StampLog projects</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-4 w-4" weight="bold" /> Workbench
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Import Wizard */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Search Input Card */}
        <Card className="shadow-sm border-indigo-500/20 bg-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <GithubLogo className="h-5 w-5" weight="bold" />
              Search GitHub User or Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter GitHub username or org (e.g. facebook, vercel, octocat)"
                className="flex-1 h-10 px-3.5 text-xs font-mono rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchRepos()}
              />
              <Button
                onClick={handleFetchRepos}
                disabled={isLoading || !usernameInput.trim()}
                className="h-10 px-5 gap-2 text-xs shadow-md shadow-indigo-500/20"
              >
                {isLoading ? (
                  <Sparkle className="h-4 w-4 animate-spin" weight="bold" />
                ) : (
                  <MagnifyingGlass className="h-4 w-4" weight="bold" />
                )}
                {isLoading ? "Fetching..." : "Fetch Repositories"}
              </Button>
            </div>
            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Repositories List */}
        {repos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center justify-between">
              <span>Public Repositories ({repos.length})</span>
              <span className="text-xs font-normal text-muted-foreground">Select a repository to import into StampLog</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => {
                const isImported = Boolean(importedProjects[repo.fullName]);
                const isImporting = importingRepo === repo.fullName;

                return (
                  <Card key={repo.id} className="border-border hover:border-indigo-500/30 transition-all hover:shadow-md">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                      <div className="space-y-1 overflow-hidden">
                        <CardTitle className="text-sm font-bold truncate text-foreground flex items-center gap-1.5">
                          <GithubLogo className="h-4 w-4 shrink-0 text-primary" weight="bold" />
                          {repo.name}
                        </CardTitle>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">{repo.fullName}</p>
                      </div>

                      {repo.isPrivate && (
                        <Badge variant="outline" className="text-[10px] font-mono shrink-0">Private</Badge>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                        {repo.description || "No repository description provided."}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" weight="bold" />
                            {repo.defaultBranch}
                          </span>
                          {repo.stars > 0 && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Star className="h-3.5 w-3.5 text-amber-500" weight="fill" />
                              {repo.stars}
                            </span>
                          )}
                        </div>

                        {isImported ? (
                          <Link href={importedProjects[repo.fullName]}>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                              Connected <ArrowRight className="h-3 w-3" weight="bold" />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            disabled={isImporting}
                            onClick={() => handleImportRepo(repo)}
                            className="h-7 px-3 text-xs gap-1 shadow-sm"
                          >
                            {isImporting ? (
                              <Sparkle className="h-3 w-3 animate-spin" weight="bold" />
                            ) : (
                              <Broadcast className="h-3 w-3" weight="bold" />
                            )}
                            {isImporting ? "Importing..." : "Import Project"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
