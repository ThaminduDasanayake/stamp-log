"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GithubLogoIcon,
  ArrowRightIcon,
  ShieldWarningIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="max-w-[360px] w-full space-y-6">
      {/* Header Logo */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="h-7 w-7 bg-[#171717] dark:bg-white flex items-center justify-center rounded-[3px]">
            <svg
              className="h-4 w-4 fill-white dark:fill-black"
              viewBox="0 0 76 65"
              aria-hidden="true"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">
            stamplog
          </span>
        </Link>
        <div className="space-y-1">
          <h1 className="text-xl font-medium tracking-tight text-[#171717] dark:text-white">
            Log in to StampLog
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#888888]">
            Automate multi-audience release notes directly from your GitHub
            repositories.
          </p>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3 rounded-[4px] bg-[#ee0000]/8 border border-[#ee0000]/25 text-xs text-[#ee0000] flex items-center gap-2">
          <ShieldWarningIcon className="h-4 w-4 shrink-0" weight="bold" />
          <span className="leading-tight">
            {error === "no_github_credentials"
              ? "Missing GITHUB_CLIENT_ID in environment variables."
              : error === "missing_code"
                ? "GitHub authorization code was not provided."
                : error}
          </span>
        </div>
      )}

      {/* GitHub Auth Card */}
      <Card className="p-1">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#666666] dark:text-[#888888] block text-center">
              Developer Authentication
            </span>

            {/* Exclusive GitHub OAuth Button */}
            <Button
              variant="default"
              onClick={handleGitHubLogin}
              className="w-full h-10 gap-2.5 text-xs font-medium"
            >
              <GithubLogoIcon className="h-4 w-4" weight="bold" />
              Continue with GitHub
              <ArrowRightIcon className="h-3 w-3" weight="bold" />
            </Button>
          </div>

          <p className="text-[11px] text-[#8f8f8f] text-center leading-relaxed">
            By continuing, you authenticate with GitHub to access your
            repositories and release workspaces.
          </p>
        </CardContent>
      </Card>

      {/* Footer info */}
      <div className="text-center space-y-2 text-xs text-[#8f8f8f]">
        <p>
          Preview components in the{" "}
          <Link
            href="/design-system"
            className="text-[#171717] dark:text-white underline underline-offset-4 font-medium"
          >
            Design System
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
