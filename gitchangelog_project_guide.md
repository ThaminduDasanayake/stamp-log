# GitChangelog: Project Specification & Implementation Guide

A lightweight, developer-first Next.js web application that connects directly to GitHub via OAuth, parses Git commits using the Conventional Commits specification, categorizes release changes into structured groups, and generates Markdown release drafts with one-click export.

---

## 1. Project Overview & Architecture

### 1.1 Goal

Solo developers often ship features rapidly but neglect release notes because manually scanning `git log` and formatting Markdown is tedious. GitChangelog automates this by inspecting repository history, categorizing commits deterministically, and generating publish-ready release notes or drafts.

### 1.2 Architectural Principles

- **Stateless by Design:** No external database or Redis cache is mandatory. GitHub acts as the single source of truth; session tokens reside inside encrypted HTTP-only session cookies.
- **Deterministic Parsing:** Zero LLM hallucinations. All categorization is performed using strict regex matching on Conventional Commits standards.
- **Server-Side API Security:** GitHub personal tokens and OAuth exchange keys never leak to the client browser.

```
┌─────────────────┐       OAuth 2.0 Flow       ┌──────────────────────┐
│  Client Browser │ ◄────────────────────────► │ Next.js Server Route │
└────────┬────────┘                            └──────────┬───────────┘
         │                                                │
         │ Trigger Server Action                          │ Octokit Authenticated Call
         ▼                                                ▼
┌─────────────────┐      Commits & Metadata    ┌──────────────────────┐
│ Conventional    │ ◄───────────────────────── │ GitHub REST API      │
│ Regex Parser    │                            └──────────────────────┘
         │
         ▼
┌─────────────────┐
│ Markdown Export │
└─────────────────┘
```

---

## 2. Tech Stack

| Layer              | Tool / Library                             | Purpose                                           |
| ------------------ | ------------------------------------------ | ------------------------------------------------- |
| **Framework**      | Next.js (App Router, React Server Actions) | SSR, secure cookie sessions, zero-overhead RPC    |
| **Styling**        | Tailwind CSS + `lucide-react`              | Clean developer utility UI                        |
| **Authentication** | Auth.js (NextAuth v5 beta)                 | Automated GitHub OAuth handshake & token rotation |
| **GitHub SDK**     | `@octokit/rest`                            | Typed interaction with the GitHub REST API        |
| **State / Form**   | React 19 / standard React Hooks            | Local client-state filtering & Markdown editing   |

---

## 3. Directory Layout

```text
git-changelog/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts         # NextAuth OAuth router
│   ├── actions/
│   │   └── github.ts                # Server Actions for GitHub API operations
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Main Changelog Dashboard
├── components/
│   ├── header.tsx                   # Auth status and user profile
│   ├── repo-selector.tsx            # Repository search and selector dropdown
│   ├── commit-inspector.tsx         # Commit list with inclusion checkboxes
│   └── markdown-preview.tsx         # Live editable Markdown output
├── lib/
│   ├── auth.ts                      # NextAuth configuration and token callbacks
│   └── parser.ts                    # Conventional commit parsing and formatting engine
├── types/
│   └── index.ts                     # TypeScript interfaces
├── .env.local                       # Local environment secrets
├── package.json
└── tsconfig.json
```

---

## 4. Setup & Configuration

### 4.1 GitHub OAuth App Registration

1. Navigate to **GitHub Settings > Developer Settings > OAuth Apps > New OAuth App**.
2. Set the following fields:
   - **Application name:** `GitChangelog Local`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Generate a **Client Secret** and copy both the Client ID and Client Secret.

### 4.2 Environment Variables (`.env.local`)

```env
AUTH_SECRET="use-openssl-rand-hex-32-to-generate"
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4.3 Dependencies Installation

```bash
npm install next@latest react@latest react-dom@latest next-auth@beta @octokit/rest lucide-react
npm install -D tailwindcss @tailwindcss/postcss postcss typescript @types/node @types/react
```

---

## 5. Core Implementation Code

### 5.1 Type Definitions (`types/index.ts`)

```typescript
export type CommitType =
  "feat" | "fix" | "perf" | "refactor" | "docs" | "chore" | "other";

export interface ParsedCommit {
  id: string;
  hash: string;
  type: CommitType;
  scope?: string;
  description: string;
  raw: string;
  isBreaking: boolean;
  author: string;
  date: string;
  selected: boolean;
}

export interface RepoSummary {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  isPrivate: boolean;
  defaultBranch: string;
}
```

### 5.2 The Conventional Commit Parser (`lib/parser.ts`)

```typescript
import { ParsedCommit, CommitType } from "@/types";

const CONVENTIONAL_REGEX =
  /^(?<type>\w+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s(?<description>.+)$/;

export function parseCommitMessage(
  message: string,
  sha: string,
  author: string,
  date: string,
): ParsedCommit {
  const [firstLine] = message.split("\n");
  const cleanLine = firstLine.trim();
  const match = cleanLine.match(CONVENTIONAL_REGEX);

  const isBreakingFooter = message.includes("BREAKING CHANGE:");

  if (!match || !match.groups) {
    return {
      id: sha,
      hash: sha.slice(0, 7),
      type: "other",
      description: cleanLine,
      raw: cleanLine,
      isBreaking: isBreakingFooter,
      author,
      date,
      selected: true,
    };
  }

  const { type, scope, breaking, description } = match.groups;
  const isBreaking = Boolean(breaking) || isBreakingFooter;

  const validTypes: CommitType[] = [
    "feat",
    "fix",
    "perf",
    "refactor",
    "docs",
    "chore",
  ];
  const normalizedType: CommitType = validTypes.includes(type as CommitType)
    ? (type as CommitType)
    : "other";

  return {
    id: sha,
    hash: sha.slice(0, 7),
    type: normalizedType,
    scope: scope || undefined,
    description: description.trim(),
    raw: cleanLine,
    isBreaking,
    author,
    date,
    selected: true,
  };
}

export function generateReleaseMarkdown(
  commits: ParsedCommit[],
  tag: string = "v1.0.0",
): string {
  const activeCommits = commits.filter((c) => c.selected);

  const buckets: { title: string; list: ParsedCommit[] }[] = [
    {
      title: "💥 Breaking Changes",
      list: activeCommits.filter((c) => c.isBreaking),
    },
    {
      title: "🚀 Features",
      list: activeCommits.filter((c) => c.type === "feat" && !c.isBreaking),
    },
    {
      title: "🐛 Bug Fixes",
      list: activeCommits.filter((c) => c.type === "fix" && !c.isBreaking),
    },
    {
      title: "⚡ Performance Improvements",
      list: activeCommits.filter((c) => c.type === "perf"),
    },
    {
      title: "🔧 Maintenance & Refactoring",
      list: activeCommits.filter((c) =>
        ["chore", "refactor", "docs"].includes(c.type),
      ),
    },
    {
      title: "📝 Other Changes",
      list: activeCommits.filter((c) => c.type === "other" && !c.isBreaking),
    },
  ];

  let md = `## Release ${tag}\n\n`;

  for (const bucket of buckets) {
    if (bucket.list.length === 0) continue;
    md += `### ${bucket.title}\n`;
    for (const commit of bucket.list) {
      const scopeBadge = commit.scope ? `**${commit.scope}:** ` : "";
      md += `- ${scopeBadge}${commit.description} (\`${commit.hash}\`)\n`;
    }
    md += "\n";
  }

  return md.trim();
}
```

### 5.3 Authentication Configuration (`lib/auth.ts`)

```typescript
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          // 'repo' scope grants read/write to private repos and release publishing.
          // Replace with 'public_repo' if you only target public code.
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
```

### 5.4 OAuth Route Handler (`app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

### 5.5 Server Actions for GitHub Operations (`app/actions/github.ts`)

```typescript
"use server";

import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/rest";
import { parseCommitMessage } from "@/lib/parser";
import { ParsedCommit, RepoSummary } from "@/types";

async function getAuthenticatedClient(): Promise<Octokit> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("Authentication required. Access token missing.");
  }
  return new Octokit({ auth: session.accessToken });
}

export async function fetchUserRepos(): Promise<RepoSummary[]> {
  const octokit = await getAuthenticatedClient();
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 50,
  });

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    owner: r.owner.login,
    isPrivate: r.private,
    defaultBranch: r.default_branch,
  }));
}

export async function fetchCommitsForRepo(
  owner: string,
  repo: string,
  perPage: number = 40,
): Promise<ParsedCommit[]> {
  const octokit = await getAuthenticatedClient();
  const { data: rawCommits } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: perPage,
  });

  return rawCommits.map((item) =>
    parseCommitMessage(
      item.commit.message,
      item.sha,
      item.commit.author?.name || "Unknown",
      item.commit.author?.date || new Date().toISOString(),
    ),
  );
}

export async function createGitHubDraftRelease(
  owner: string,
  repo: string,
  tagName: string,
  releaseBody: string,
) {
  const octokit = await getAuthenticatedClient();
  const { data } = await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    name: `Release ${tagName}`,
    body: releaseBody,
    draft: true,
  });

  return { url: data.html_url, id: data.id };
}
```

---

## 6. Verification & Step-by-Step Testing

1. **Login Test:** Start `npm run dev`. Visit `http://localhost:3000`. Trigger `signIn('github')`. Verify the browser redirects to GitHub consent and returns without error.
2. **Token Inspection:** In the callback, ensure the session object has `accessToken` populated.
3. **Repo Listing:** Call `fetchUserRepos()` to ensure both public and private repos (depending on scope granted) are listed.
4. **Parsing Accuracy Test:**
   - Test commit: `feat(auth): add github oauth provider!` $\rightarrow$ flagged as **Breaking** and categorised under **Features**.
   - Test commit: `fix: correct token expiration handler` $\rightarrow$ categorised under **Bug Fixes**.
5. **Release Draft Verification:** Call `createGitHubDraftRelease()` and navigate to `https://github.com/{owner}/{repo}/releases` to see the newly drafted release notes.
