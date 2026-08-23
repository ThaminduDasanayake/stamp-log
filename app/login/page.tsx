"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Broadcast,
  GithubLogo,
  GoogleLogo,
  ArrowRight,
  Sparkle,
  Lock,
  EnvelopeSimple,
  Key,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGitHubLogin = () => {
    // Redirect to GitHub OAuth or Auth Provider
    window.location.href = "/api/auth/github";
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Container Card */}
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-indigo-500/20">
              <Broadcast className="h-7 w-7" weight="bold" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">stamplog</span>
          </Link>
          <p className="text-xs text-muted-foreground font-medium max-w-xs">
            Sign in to access your project workspaces, saved releases, and automated GitHub actions.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-base font-bold flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-primary" weight="bold" />
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Social OAuth Buttons */}
            <div className="space-y-2.5">
              <Button
                variant="outline"
                onClick={handleGitHubLogin}
                className="w-full h-10 gap-2 text-xs font-semibold border-border hover:bg-muted shadow-sm"
              >
                <GithubLogo className="h-4 w-4" weight="bold" />
                Continue with GitHub
              </Button>

              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-10 gap-2 text-xs font-semibold border-border hover:bg-muted shadow-sm"
              >
                <GoogleLogo className="h-4 w-4 text-red-500" weight="bold" />
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-border w-full" />
              <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase font-mono shrink-0">
                Or work email
              </span>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full h-10 pl-9 pr-3.5 text-xs font-mono rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <EnvelopeSimple className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" weight="bold" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full h-10 gap-2 text-xs font-semibold shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? (
                  <Sparkle className="h-4 w-4 animate-spin text-primary-foreground" weight="bold" />
                ) : (
                  <Key className="h-4 w-4" weight="bold" />
                )}
                {isSubmitting ? "Signing in..." : "Send Magic Link"}
              </Button>
            </form>

          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/" className="text-primary font-semibold hover:underline">
              Try Workbench as Guest
            </Link>
          </p>
          <p className="text-[11px] text-muted-foreground opacity-80 pt-2">
            stamplog • Official AI release notes from raw git logs
          </p>
        </div>

      </div>
    </div>
  );
}
