"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpenIcon,
  GithubLogoIcon,
  PaletteIcon,
  PlusIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";

interface UserProfile {
  name: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
}

export function UserProfileMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    router.push("/login");
  };

  const userName = user?.name || user?.username || "Developer";
  const userHandle =
    user?.email || (user?.username ? `@${user.username}` : "Signed In");

  return (
    <div className="relative font-sans" ref={menuRef}>
      {/* Trigger: User Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-7 w-7 rounded-full overflow-hidden border border-[#ebebeb] dark:border-[#262626] hover:border-[#171717] dark:hover:border-white focus:outline-none focus:ring-1 focus:ring-[#0070f3] transition-all shrink-0 bg-[#fafafa] dark:bg-[#111111] flex items-center justify-center cursor-pointer"
        title={userName}
      >
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={userName}
            width={28}
            height={28}
            className="object-cover h-full w-full"
            unoptimized
          />
        ) : (
          <UserIcon className="h-3.5 w-3.5 text-[#8f8f8f]" weight="bold" />
        )}
      </button>

      {/* Vercel-Style Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-[#ebebeb] dark:border-[#1f1f1f] rounded-[6px] shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] p-1.5 z-50 space-y-0.5">
          {/* Header Profile Info */}
          <div className="px-2.5 py-2 border-b border-[#ebebeb] dark:border-[#1f1f1f] space-y-0.5">
            <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">
              {userName}
            </p>
            <p className="text-[11px] font-mono text-[#8f8f8f] truncate">
              {userHandle}
            </p>
          </div>

          {/* Menu Links */}
          <div className="py-1">
            {user?.username && (
              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#141414] transition-colors"
              >
                <span>GitHub Profile</span>
                <GithubLogoIcon
                  className="h-3.5 w-3.5 text-[#8f8f8f]"
                  weight="bold"
                />
              </a>
            )}

            <Link
              href="/projects/import"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#141414] transition-colors"
            >
              <span>Import Project</span>
              <PlusIcon className="h-3.5 w-3.5 text-[#8f8f8f]" weight="bold" />
            </Link>

            <Link
              href="/design-system"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#141414] transition-colors"
            >
              <span>Design System</span>
              <PaletteIcon
                className="h-3.5 w-3.5 text-[#8f8f8f]"
                weight="bold"
              />
            </Link>

            <a
              href="https://github.com/ThaminduDasanayake/relay"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs text-[#666666] dark:text-[#888888] hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#141414] transition-colors"
            >
              <span>Documentation</span>
              <BookOpenIcon
                className="h-3.5 w-3.5 text-[#8f8f8f]"
                weight="bold"
              />
            </a>
          </div>

          {/* Log Out Option */}
          <div className="pt-1 border-t border-[#ebebeb] dark:border-[#1f1f1f]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs text-[#ee0000] hover:bg-[#ee0000]/8 transition-colors cursor-pointer"
            >
              <span>Log Out</span>
              <SignOutIcon className="h-3.5 w-3.5" weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
