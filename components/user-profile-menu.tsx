"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GithubLogoIcon,
  SignOutIcon,
  GearIcon,
  PaletteIcon,
  PlusIcon,
  BookOpenIcon,
  UserIcon,
} from "@phosphor-icons/react";

interface UserProfile {
  name: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
}

export function UserProfileMenu() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        console.log("🎨 Frontend Profile Response (/api/auth/me):", data);
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.warn("Failed to load user profile:", err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    document.cookie = "stamplog_session=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const userName = user?.name || user?.username || "Developer";
  const userHandle = user?.email || (user?.username ? `@${user.username}` : "Signed In");

  return (
    <div className="relative font-sans" ref={menuRef}>
      
      {/* Trigger: ONLY the User Avatar Image */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 rounded-full overflow-hidden border border-border/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm shrink-0 bg-muted flex items-center justify-center"
        title={userName}
      >
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={userName}
            width={32}
            height={32}
            className="object-cover h-full w-full"
            unoptimized
          />
        ) : (
          <UserIcon className="h-4 w-4 text-muted-foreground" weight="bold" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border/80 rounded-2xl shadow-2xl p-2 z-50 space-y-1 backdrop-blur-md">
          
          {/* Header Profile Info */}
          <div className="p-3 border-b border-border/60 flex items-start justify-between gap-2">
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate">{userName}</p>
              <p className="text-[11px] font-mono text-muted-foreground truncate">{userHandle}</p>
            </div>
            <Link
              href="/projects/import"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Settings & Import"
            >
              <GearIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>

          {/* Menu Links */}
          <div className="py-1 space-y-0.5">
            {user?.username && (
              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>GitHub Profile</span>
                <GithubLogoIcon className="h-4 w-4" weight="bold" />
              </a>
            )}

            <Link
              href="/projects/import"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span>Import New Project</span>
              <PlusIcon className="h-4 w-4 text-primary" weight="bold" />
            </Link>

            <Link
              href="/design-system"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span>Design System</span>
              <PaletteIcon className="h-4 w-4" weight="bold" />
            </Link>

            <a
              href="https://github.com/ThaminduDasanayake/relay"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span>Documentation &amp; Help</span>
              <BookOpenIcon className="h-4 w-4" weight="bold" />
            </a>
          </div>

          {/* Log Out Option */}
          <div className="pt-1 border-t border-border/60">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <span>Log Out</span>
              <SignOutIcon className="h-4 w-4" weight="bold" />
            </button>
          </div>

          {/* Footer Status Badge */}
          <div className="pt-2 px-3 pb-1 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems normal.
            </span>
            <span className="font-mono text-muted-foreground/70">v1.2.0</span>
          </div>

        </div>
      )}
    </div>
  );
}
