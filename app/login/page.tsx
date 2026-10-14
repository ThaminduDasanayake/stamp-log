"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BroadcastIcon,
  GithubLogoIcon,
  SparkleIcon,
  LockIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/github";
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = "/app";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      <div className="max-w-[380px] w-full space-y-6">
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
              Automated release notes from your GitHub repositories.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="p-1">
          <CardContent className="p-5 space-y-4">
            {/* Primary GitHub OAuth Button */}
            <Button
              variant="default"
              onClick={handleGitHubLogin}
              className="w-full h-9 gap-2 text-xs font-medium"
            >
              <GithubLogoIcon className="h-4 w-4" weight="bold" />
              Continue with GitHub
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-[#ebebeb] dark:border-[#222222] w-full" />
              <span className="bg-white dark:bg-[#0a0a0a] px-2 text-[10px] text-[#8f8f8f] uppercase font-mono shrink-0">
                or
              </span>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#666666] dark:text-[#888888] block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full h-9 px-3 text-xs font-mono rounded-[4px] border border-[#ebebeb] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#0070f3]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting || !email}
                className="w-full h-9 text-xs font-medium"
              >
                {isSubmitting ? "Sending Link..." : "Continue with Email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center space-y-2 text-xs text-[#8f8f8f]">
          <p>
            Explore components in the{" "}
            <Link
              href="/design-system"
              className="text-[#171717] dark:text-white underline underline-offset-4 font-medium"
            >
              Design System
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
