"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GithubLogo, SignOut, CaretDown } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  name: string;
  username: string;
  email: string | null;
  avatarUrl: string;
}

export function UserProfileMenu() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.warn("Failed to load user profile:", err));
  }, []);

  const handleSignOut = () => {
    document.cookie = "stamplog_session=; path=/; max-age=0";
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <button
        onClick={handleSignOut}
        className="h-8 px-2.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5"
      >
        <SignOut className="h-3.5 w-3.5" weight="bold" />
        Sign Out
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 pl-1.5 pr-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-all flex items-center gap-2 shadow-sm"
      >
        {/* GitHub Avatar */}
        <div className="relative h-6 w-6 rounded-full overflow-hidden border border-border shrink-0">
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={24}
            height={24}
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <span className="hidden sm:inline">{user.name}</span>
          <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
            @{user.username}
          </Badge>
        </div>

        <CaretDown className="h-3 w-3 text-muted-foreground" weight="bold" />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl p-2 z-50 space-y-1 font-sans">
          <div className="p-2 border-b border-border/60">
            <p className="text-xs font-bold text-foreground">{user.name}</p>
            <p className="text-[11px] font-mono text-muted-foreground">@{user.username}</p>
            {user.email && <p className="text-[10px] text-muted-foreground opacity-80 mt-0.5">{user.email}</p>}
          </div>

          <a
            href={`https://github.com/${user.username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <GithubLogo className="h-4 w-4" weight="bold" />
            GitHub Profile
          </a>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <SignOut className="h-4 w-4" weight="bold" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
