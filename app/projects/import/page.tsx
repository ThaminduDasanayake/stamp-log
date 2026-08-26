"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GithubLogoIcon,
  BroadcastIcon,
  CheckCircleIcon,
  SparkleIcon,
  GitBranchIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  CaretDownIcon,
  FolderSimpleIcon,
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
                <BroadcastIcon className="h-5 w-5" weight="bold" />
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
                <ArrowLeftIcon className="h-4 w-4" weight="bold" /> Back to Studio App
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
                <GithubLogoIcon className="h-4 w-4 absolute left-3.5 text-primary pointer-events-none" weight="bold" />
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
                <CaretDownIcon className="h-3.5 w-3.5 absolute right-3 pointer-events-none text-muted-foreground" weight="bold" />
              </div>

              {/* Search Filter Input */}
              <div className="sm:col-span-7 relative flex items-center">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3.5 text-muted-foreground pointer-events-none" weight="bold" />
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
                  <GithubLogoIcon className="h-4 w-4 text-primary" weight="bold" />
                  GitHub Repositories ({filteredRepos.length})
                </CardTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Connected Account: @{username}
                </Badge>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-border/60">
                {isLoadingRepos ? (
                  <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
                    <SparkleIcon className="h-6 w-6 animate-spin text-primary mx-auto" weight="bold" />
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
                          <FolderSimpleIcon className="h-5 w-5" weight="bold" />
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
                              <GitBranchIcon className="h-3 w-3" weight="bold" />
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
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              New Project
            </h2>

            <Card className="shadow-lg border-border bg-card overflow-hidden">
              
              {/* "Importing from GitHub" Banner */}
              <div className="p-4 sm:px-6 bg-muted/30 border-b border-border/60">
                <p className="text-xs text-muted-foreground mb-2">Importing from GitHub</p>
                <div className="flex items-center gap-3 text-sm font-mono text-foreground">
                  <GithubLogoIcon className="h-5 w-5 text-foreground" weight="fill" />
                  <span className="font-semibold">{selectedRepo.fullName}</span>
                  <div className="flex items-center gap-1.5 text-muted-foreground ml-1">
                    <GitBranchIcon className="h-3.5 w-3.5" weight="bold" />
                    <span>{defaultBranch}</span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <CardContent className="p-4 sm:p-6 space-y-6">
                
                <p className="text-sm text-foreground">
                  Choose where you want to create the project and give it a name.
                </p>

                {/* Team & Project Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end relative">
                  
                  {/* Decorative Slash between cols (hidden on mobile) */}
                  <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 text-2xl font-light text-muted-foreground/30 pointer-events-none">
                    /
                  </div>

                  {/* Left: Connected Account (Read-only Team equivalent) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Connected Account
                    </label>
                    <div className="w-full h-10 px-3 flex items-center justify-between rounded-md border border-border/60 bg-muted/40 text-foreground cursor-not-allowed">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-xs font-semibold">@{username}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] opacity-80 border-border/60 bg-background">Owner</Badge>
                    </div>
                  </div>

                  {/* Right: Project Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 px-3.5 text-xs font-mono font-medium rounded-md border border-border/60 bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleDeployProject}
                    disabled={isDeploying || !projectName.trim()}
                    className="w-full h-11 text-sm font-semibold shadow-sm bg-foreground hover:bg-foreground/90 text-background rounded-md transition-all"
                  >
                    {isDeploying ? (
                      <SparkleIcon className="h-4 w-4 animate-spin mr-2" weight="bold" />
                    ) : null}
                    {isDeploying ? "Deploying..." : "Deploy"}
                  </Button>
                </div>
                
              </CardContent>
            </Card>

            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRepo(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel and pick another repository
              </Button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
