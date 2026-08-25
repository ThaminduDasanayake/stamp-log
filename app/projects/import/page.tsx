"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GithubLogo,
  Broadcast,
  CheckCircle,
  ArrowRight,
  Sparkle,
  GitBranch,
  MagnifyingGlass,
  ArrowLeft,
  CaretDown,
  Clock,
  FolderSimple,
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
  updatedAt?: string;
}

export default function VercelStyleImportPage() {
  const router = useRouter();

  const [username, setUsername] = useState("ThaminduDasanayake");
  const [searchQuery, setSearchQuery] = useState("");
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);

  // Selected Repo to Configure & Deploy
  const [selectedRepo, setSelectedRepo] = useState<RepoItem | null>(null);
  const [projectName, setProjectName] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [toneGuide, setToneGuide] = useState(
    "Professional, concise, engaging for users, and technically rigorous for developers."
  );
  const [isDeploying, setIsDeploying] = useState(false);

  // 1. Fetch current logged-in user profile on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.username) {
          setUsername(data.user.username);
          fetchReposForUsername(data.user.username);
        } else {
          fetchReposForUsername("ThaminduDasanayake");
        }
      })
      .catch(() => {
        fetchReposForUsername("ThaminduDasanayake");
      });
  }, []);

  const fetchReposForUsername = async (userToFetch: string) => {
    setIsLoadingRepos(true);
    try {
      const res = await fetch("/api/github/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userToFetch }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.repos)) {
        setRepos(data.repos);
      }
    } catch (err) {
      console.warn("Failed to fetch user repos:", err);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  // Filter repos by search query
  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartImport = (repo: RepoItem) => {
    setSelectedRepo(repo);
    setProjectName(repo.name);
    setDefaultBranch(repo.defaultBranch || "main");
  };

  const handleDeployProject = async () => {
    if (!selectedRepo || !projectName.trim()) return;
    setIsDeploying(true);

    try {
      const res = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: selectedRepo.fullName,
          name: projectName.trim(),
          description: selectedRepo.description,
          defaultBranch,
          toneGuide,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect to Studio App Workspace
        router.push("/app");
      }
    } catch (err) {
      console.error("Error deploying project:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Top StampLog Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/app" className="hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
                <Broadcast className="h-5 w-5" weight="bold" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Import Git Repository
              </h1>
              <p className="text-xs text-muted-foreground">Vercel-Style Project Import Wizard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/app">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-4 w-4" weight="bold" /> Back to Studio App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Step 1: Repository Picker (Vercel Style) */}
        {!selectedRepo ? (
          <div className="space-y-5">
            
            {/* Top Control Bar: Account Selector & Live Search Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Account Selector Pill */}
              <div className="sm:col-span-5 relative flex items-center">
                <GithubLogo className="h-4 w-4 absolute left-3.5 text-primary pointer-events-none" weight="bold" />
                <select
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    fetchReposForUsername(e.target.value);
                  }}
                  className="w-full h-10 pl-10 pr-8 text-xs font-bold rounded-xl border border-border bg-card text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                >
                  <option value={username}>GitHub / @{username}</option>
                  <option value="facebook">GitHub / @facebook</option>
                  <option value="vercel">GitHub / @vercel</option>
                </select>
                <CaretDown className="h-3.5 w-3.5 absolute right-3 pointer-events-none text-muted-foreground" weight="bold" />
              </div>

              {/* Search Filter Input */}
              <div className="sm:col-span-7 relative flex items-center">
                <MagnifyingGlass className="h-4 w-4 absolute left-3.5 text-muted-foreground pointer-events-none" weight="bold" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  className="w-full h-10 pl-10 pr-3 text-xs font-mono rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

            </div>

            {/* Vercel-Style Dark Repository List Container */}
            <Card className="shadow-lg border-border bg-card overflow-hidden">
              <CardHeader className="py-3 px-5 border-b border-border/60 bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <GithubLogo className="h-4 w-4 text-primary" weight="bold" />
                  GitHub Repositories ({filteredRepos.length})
                </CardTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Connected Account: @{username}
                </Badge>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-border/60">
                {isLoadingRepos ? (
                  <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
                    <Sparkle className="h-6 w-6 animate-spin text-primary mx-auto" weight="bold" />
                    <p>Loading repositories from GitHub API...</p>
                  </div>
                ) : filteredRepos.length > 0 ? (
                  filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* StampLog Styled Repo Icon */}
                        <div className="h-9 w-9 rounded-xl bg-accent/60 border border-border flex items-center justify-center text-primary shrink-0">
                          <FolderSimple className="h-5 w-5" weight="bold" />
                        </div>

                        <div className="space-y-0.5 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {repo.name}
                            </h3>
                            {repo.isPrivate && (
                              <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                                Private
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-muted-foreground truncate flex items-center gap-2">
                            <span>{repo.fullName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" weight="bold" />
                              {repo.defaultBranch}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Vercel-Style Import Button */}
                      <Button
                        size="sm"
                        onClick={() => handleStartImport(repo)}
                        className="h-8 px-4 text-xs font-bold shadow-md shadow-indigo-500/20 shrink-0"
                      >
                        Import
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                    <p>No repositories found matching &quot;{searchQuery}&quot;.</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        ) : (
          /* Step 2: Configure & Deploy Project Card (Vercel Style) */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  Configure Project
                  <Badge variant="user" className="font-mono text-xs">
                    {selectedRepo.name}
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">Connected to {selectedRepo.fullName}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRepo(null)}
                className="text-xs"
              >
                Change Repository
              </Button>
            </div>

            <Card className="shadow-lg border-indigo-500/30 border">
              <CardContent className="p-6 space-y-5">
                
                {/* Project Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Project Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 px-3.5 text-xs font-bold rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                {/* Default Branch */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Default Branch
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full h-10 pl-9 pr-3 text-xs font-mono rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      value={defaultBranch}
                      onChange={(e) => setDefaultBranch(e.target.value)}
                    />
                    <GitBranch className="h-4 w-4 absolute left-3 top-3 text-primary" weight="bold" />
                  </div>
                </div>

                {/* AI Brand Tone Guide */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    AI Brand Tone Guide
                  </label>
                  <textarea
                    className="w-full h-24 p-3 text-xs font-medium rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-none"
                    value={toneGuide}
                    onChange={(e) => setToneGuide(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Guides Gemini 3.6 Flash on writing release notes that match your product&apos;s brand voice.
                  </p>
                </div>

                {/* Deploy & Create Project Button */}
                <Button
                  onClick={handleDeployProject}
                  disabled={isDeploying || !projectName.trim()}
                  className="w-full h-11 gap-2 text-xs font-bold shadow-lg shadow-indigo-500/25 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isDeploying ? (
                    <Sparkle className="h-4 w-4 animate-spin text-white" weight="bold" />
                  ) : (
                    <CheckCircle className="h-4 w-4" weight="bold" />
                  )}
                  {isDeploying ? "Deploying Project..." : "Deploy & Create Project"}
                </Button>

              </CardContent>
            </Card>
          </div>
        )}

      </main>

    </div>
  );
}
