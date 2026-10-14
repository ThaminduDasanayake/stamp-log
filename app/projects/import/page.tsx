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

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
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
        router.push("/app");
      }
    } catch (err) {
      console.error("Error deploying project:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      {/* Vercel Header */}
      <header className="border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="max-w-[1000px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
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
              <span className="font-semibold text-sm tracking-tight">
                stamplog
              </span>
            </Link>

            <span className="text-[#8f8f8f] text-sm">/</span>
            <span className="text-xs text-[#8f8f8f]">Import Git Repository</span>
          </div>

          <Link href="/app">
            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs gap-1.5">
              <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" /> Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-8 space-y-6">
        {!selectedRepo ? (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-[#171717] dark:text-white">
                Import Git Repository
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#888888] mt-1">
                Select a GitHub repository to configure automated release synthesis.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative flex items-center">
                <GithubLogoIcon
                  className="h-4 w-4 absolute left-3 text-[#171717] dark:text-white pointer-events-none"
                  weight="bold"
                />
                <select
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    fetchReposForUsername(e.target.value);
                  }}
                  className="w-full h-9 pl-9 pr-8 text-xs font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                >
                  <option value={username}>GitHub / @{username}</option>
                  <option value="facebook">GitHub / @facebook</option>
                  <option value="vercel">GitHub / @vercel</option>
                </select>
                <CaretDownIcon
                  className="h-3 w-3 absolute right-2.5 pointer-events-none text-[#8f8f8f]"
                  weight="bold"
                />
              </div>

              <div className="sm:col-span-7 relative flex items-center">
                <MagnifyingGlassIcon
                  className="h-4 w-4 absolute left-3 text-[#8f8f8f] pointer-events-none"
                  weight="bold"
                />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  className="w-full h-9 pl-9 pr-3 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Repository List */}
            <Card className="overflow-hidden">
              <CardHeader className="py-2.5 px-4 border-b border-[#ebebeb] dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#111111] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-[#666666] dark:text-[#888888]">
                  Repositories ({filteredRepos.length})
                </CardTitle>
                <span className="font-mono text-[11px] text-[#8f8f8f]">
                  @{username}
                </span>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-[#ebebeb] dark:divide-[#1f1f1f]">
                {isLoadingRepos ? (
                  <div className="p-12 text-center text-xs text-[#8f8f8f] space-y-2">
                    <div className="h-4 w-4 border-2 border-[#171717] dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Loading repositories from GitHub API...</p>
                  </div>
                ) : filteredRepos.length > 0 ? (
                  filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="p-3.5 px-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-[#fafafa] dark:hover:bg-[#111111] transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FolderSimpleIcon className="h-4 w-4 text-[#8f8f8f] shrink-0" weight="bold" />
                        <div className="space-y-0.5 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">
                              {repo.name}
                            </h3>
                            {repo.isPrivate && (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono py-0 px-1"
                              >
                                Private
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[#8f8f8f] truncate flex items-center gap-2">
                            <span>{repo.fullName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <GitBranchIcon className="h-3 w-3" weight="bold" />
                              {repo.defaultBranch}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleStartImport(repo)}
                        className="h-7 px-3 text-xs font-medium shrink-0"
                      >
                        Import
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-[#8f8f8f]">
                    No repositories found matching &quot;{searchQuery}&quot;.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Step 2: Configure & Deploy */
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-[#171717] dark:text-white">
                New Project
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#888888] mt-1">
                Configure your repository workspace settings.
              </p>
            </div>

            <Card className="overflow-hidden">
              <div className="p-4 px-5 bg-[#fafafa] dark:bg-[#111111] border-b border-[#ebebeb] dark:border-[#1f1f1f]">
                <p className="text-[11px] text-[#8f8f8f] uppercase font-mono mb-1.5">
                  Importing from GitHub
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#171717] dark:text-white">
                  <GithubLogoIcon className="h-4 w-4" weight="fill" />
                  <span className="font-semibold">{selectedRepo.fullName}</span>
                  <span className="text-[#8f8f8f] flex items-center gap-1 ml-1">
                    <GitBranchIcon className="h-3 w-3" weight="bold" />
                    {defaultBranch}
                  </span>
                </div>
              </div>

              <CardContent className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end relative">
                  <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1 text-2xl font-light text-[#8f8f8f]/40 pointer-events-none">
                    /
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#666666] dark:text-[#888888]">
                      Account
                    </label>
                    <div className="w-full h-9 px-3 flex items-center justify-between rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-[#fafafa] dark:bg-[#111111] text-xs font-medium text-[#171717] dark:text-[#ededed]">
                      <span>@{username}</span>
                      <Badge variant="outline" className="text-[10px] py-0">
                        Owner
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#666666] dark:text-[#888888]">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-9 px-3 text-xs font-mono font-medium rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleDeployProject}
                    disabled={isDeploying || !projectName.trim()}
                    className="w-full h-10 text-xs font-medium"
                  >
                    {isDeploying ? "Importing Project..." : "Deploy Workspace"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRepo(null)}
                className="text-xs text-[#666666] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
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
