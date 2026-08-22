# StampLog
> **AI-Powered Release Notes & Multi-Audience Changelog Synthesis Engine**

---

## 1. Project Overview & Product Vision

### Product Mission
**StampLog** is an automated, AI-driven changelog and release notes workspace built on the **Next.js App Router**, **Vercel AI SDK**, **Google Gemini (via `@ai-sdk/google`)**, and **PostgreSQL (`pgvector` via Prisma/Supabase)**. It ingests developer inputs (Git commit logs, GitHub PR dumps, Jira/Linear issue summaries) and automatically classifies, structures, and synthesizes them into tailored release documentation for three distinct audiences:
1. **Executive / Stakeholder View:** High-level strategic impacts, key metrics, and milestone summaries.
2. **End-User / Customer View:** Benefit-driven feature announcements and noticeable bug fixes in accessible language.
3. **Developer / Engineering View:** Breaking changes, migration guides, API deprecations, schema mutations, and dependency updates.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT / NEXT.JS FRONTEND                               │
│                                                                                        │
│  ┌───────────────────────┐   ┌──────────────────────────────┐   ┌───────────────────┐  │
│  │   Input Workbench     │   │  Real-Time Streaming Studio  │   │ Public Share Page │  │
│  │  - Git Diff / Commits │──►│  - useObject() Streaming UI  │──►│ /p/[slug]/[vNum]  │  │
│  │  - PR Titles & Issues │   │  - Multi-Audience Tabs       │   │ Static / SSR HTML │  │
│  │  - Tone Configuration │   │  - Live Markdown Editor      │   │                   │  │
│  └───────────────────────┘   └──────────────────────────────┘   └───────────────────┘  │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ HTTP POST / Server Actions
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             NEXT.JS APP ROUTER BACKEND                                 │
│                                                                                        │
│  ┌─────────────────────────┐   ┌───────────────────────────┐   ┌────────────────────┐  │
│  │   Text Preprocessing    │   │      Vercel AI SDK        │   │ Database Layer     │  │
│  │  - Conventional Commit  │──►│  - streamObject()         │──►│ (Prisma Client)    │  │
│  │    parser & token trim  │   │  - Zod Schema Enforcement │   │ - PostgreSQL CRUD  │  │
│  │  - Contextual Chunking  │   │  - Multi-Prompt Synthesis │   │ - pgvector RPC     │  │
│  └─────────────────────────┘   └───────────────────────────┘   └────────────────────┘  │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
┌──────────────────────────────────────┐      ┌──────────────────────────────────────────┐
│          GOOGLE GEMINI AI            │      │           POSTGRESQL DATABASE            │
│       (@ai-sdk/google)               │      │                                          │
│  - google('gemini-1.5-flash')        │      │  - Project Configuration & Style Guides  │
│  - google.textEmbeddingModel(        │      │  - ReleaseNotes & Audience Segments      │
│      'text-embedding-004')           │      │  - pgvector (Historical Tone & Memory)   │
└──────────────────────────────────────┘      └──────────────────────────────────────────┘
```

---

## 3. Core Technical Workflow

### Step 1: Input Ingestion & Normalization
* The user inputs raw commit strings (e.g. `feat(auth): add OAuth2 refresh token rotation #102`), PR lists, or raw markdown notes.
* The Next.js API layer parses conventional commit tags (`feat`, `fix`, `chore`, `refactor`, `breaking`) to create high-level semantic groups before passing them to the model.

### Step 2: Semantic Tone Matching via `pgvector`
* The system computes a vector embedding of the input summary using Google's `text-embedding-004` (768 dimensions) via Vercel AI SDK.
* It queries the PostgreSQL database for the top 3 most relevant historical releases for that specific project:
  ```sql
  SELECT id, version, dev_notes, user_notes 
  FROM "ReleaseNote" 
  WHERE "projectId" = $1 
  ORDER BY embedding <=> $2::vector 
  LIMIT 3;
  ```
* These past releases act as **few-shot in-context examples**, guaranteeing that vocabulary, tone, and formatting consistency remain stable across versions.

### Step 3: Structured Streaming Generation (`streamObject`)
* The Vercel AI SDK connects to Google Gemini via `streamObject` using the `@ai-sdk/google` provider with a strict **Zod** schema.
* As tokens arrive via Server-Sent Events (SSE), the Next.js React frontend consumes the stream with `useObject()`, rendering structured UI components (badges, collapsible diff blocks, markdown cards) dynamically without waiting for generation completion.

### Step 4: Storage, Editability & Public Delivery
* The completed payload is persisted to PostgreSQL using Prisma.
* Users can edit any section inline using a rich Markdown editor.
* Published changelogs generate a public, SEO-optimized route (`/p/[projectSlug]/[version]`) rendered using Next.js ISR/SSR.

---

## 4. Database Schema (`schema.prisma`)

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum ReleaseStatus {
  DRAFT
  REVIEW
  PUBLISHED
}

model Organization {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Project {
  id           String        @id @default(cuid())
  orgId        String
  organization Organization  @relation(fields: [orgId], references: [id], onDelete: Cascade)
  name         String
  slug         String
  description  String?
  toneGuide    String?       @db.Text // e.g. "Action-oriented, enthusiastic for users; precise for devs"
  customPrompt String?       @db.Text
  releaseNotes ReleaseNote[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@unique([orgId, slug])
}

model ReleaseNote {
  id               String         @id @default(cuid())
  projectId        String
  project          Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)
  version          String         // e.g., "v2.1.0"
  title            String         // e.g., "Performance Overhaul & SSO Launch"
  rawCommits       String         @db.Text
  
  // Segmented Content
  executiveSummary String         @db.Text
  userHighlights   Json           // Array of { feature: string, benefit: string }
  userFixes        Json           // Array of string descriptions
  breakingChanges  Json           // Array of { target: string, migrationStep: string }
  technicalUpdates Json           // Array of { scope: string, detail: string }
  
  // Historical Vector for Tone and Semantic Similarity (Google text-embedding-004 is 768 dimensions)
  embedding        Unsupported("vector(768)")?

  status           ReleaseStatus  @default(DRAFT)
  publishedAt      DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@index([projectId, version])
}
```

---

## 5. API & Type-Safe Generation Architecture

### 5.1 Zod Validation Contract (`lib/schemas/changelog.ts`)

```typescript
import { z } from 'zod';

export const ChangelogSchema = z.object({
  version: z.string().describe('Inferred semantic version increment (e.g., v1.4.0)'),
  title: z.string().describe('Catchy executive release title'),
  executiveSummary: z.string().describe('2-sentence high-level summary for leadership'),
  userFacing: z.object({
    highlights: z.array(
      z.object({
        feature: z.string().describe('Feature name'),
        benefit: z.string().describe('Why this matters to the user'),
      })
    ),
    fixes: z.array(z.string()).describe('Bugs resolved with user impact explained'),
  }),
  developerFacing: z.object({
    breakingChanges: z.array(
      z.object({
        target: z.string().describe('Affected API/Module/DB column'),
        migrationStep: z.string().describe('Action required by engineers'),
      })
    ),
    technicalUpdates: z.array(
      z.object({
        scope: z.string().describe('Internal area e.g., CI/CD, Auth, Cache'),
        detail: z.string().describe('Technical change explanation'),
      })
    ),
  }),
});

export type ChangelogData = z.infer<typeof ChangelogSchema>;
```

### 5.2 Next.js Route Handler with Google Gemini (`app/api/releases/generate/route.ts`)

```typescript
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { ChangelogSchema } from '@/lib/schemas/changelog';
import { db } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { projectId, rawCommits, customTone } = await req.json();

    if (!rawCommits || !projectId) {
      return new Response('Missing required fields', { status: 400 });
    }

    // 1. Fetch project tone preferences
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { toneGuide: true, customPrompt: true, name: true }
    });

    const systemPrompt = `
      You are StampLog, an elite technical communicator and Product Lead for ${project?.name || 'the software project'}.
      Your job is to transform raw commit logs, PR titles, and ticket notes into high-quality, structured release documentation.
      
      TONE & STYLE:
      ${project?.toneGuide || 'Professional, concise, engaging for users, and technically rigorous for developers.'}
      
      RULES:
      1. Never expose raw internal commit hashes or developer names in the user-facing section.
      2. If a breaking change is detected, highlight the exact migration path.
      3. For user-facing highlights, lead with user benefits, not engineering implementation details.
    `;

    // 2. Stream structured object using Gemini 1.5 Flash (fast & generous rate limits)
    const result = await streamObject({
      model: google('gemini-1.5-flash'),
      schema: ChangelogSchema,
      system: systemPrompt,
      prompt: `Analyze the following raw input and generate the structured changelog:

${rawCommits}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error generating changelog:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

---

## 6. Frontend Architecture & Component Hierarchy

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── [orgSlug]/
│   │   ├── [projectSlug]/
│   │   │   ├── page.tsx               # Releases list & metrics
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Interactive Ingestion & Generation Studio
│   │   │   └── [version]/
│   │   │       ├── edit/page.tsx      # Multi-pane Markdown & Segment editor
│   │   │       └── page.tsx           # Internal preview
│   │   └── settings/page.tsx          # Tone guide & project configurations
├── p/
│   └── [projectSlug]/
│       └── [version]/
│           └── page.tsx               # Public, customer-facing changelog page
├── api/
│   └── releases/
│       ├── generate/route.ts          # Vercel AI SDK streamObject endpoint (Gemini)
│       └── publish/route.ts           # Publish & trigger webhook route
```

### Key UI Component: Real-Time Stream Consumer (`components/generator-studio.tsx`)

```tsx
'use client';

import React, { useState } from 'react';
import { useObject } from 'ai/react';
import { ChangelogSchema } from '@/lib/schemas/changelog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function GeneratorStudio({ projectId }: { projectId: string }) {
  const [inputLogs, setInputLogs] = useState('');

  const { object, submit, isLoading } = useObject({
    api: '/api/releases/generate',
    schema: ChangelogSchema,
  });

  const handleGenerate = () => {
    if (!inputLogs.trim()) return;
    submit({ projectId, rawCommits: inputLogs });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Left Column: Input Form */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Input Raw Changes</h2>
        <Textarea
          placeholder="Paste git commit logs, PR list, or Jira ticket dumps here..."
          className="h-80 font-mono text-sm"
          value={inputLogs}
          onChange={(e) => setInputLogs(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Synthesizing with Gemini...' : 'Generate Multi-Audience Notes'}
        </Button>
      </div>

      {/* Right Column: Live Streaming Multi-Audience Preview */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Generated Output Preview</h2>
        
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="exec">Leadership</TabsTrigger>
            <TabsTrigger value="user">Customer</TabsTrigger>
            <TabsTrigger value="dev">Engineering</TabsTrigger>
          </TabsList>

          {/* Leadership View */}
          <TabsContent value="exec">
            <Card>
              <CardHeader>
                <CardTitle>{object?.title || 'Title generating...'}</CardTitle>
                <span className="text-xs text-muted-foreground">{object?.version || 'vX.X.X'}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{object?.executiveSummary || 'Awaiting summary...'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer View */}
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>Customer Highlights & Fixes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">New Features:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                    {object?.userFacing?.highlights?.map((h, i) => (
                      <li key={i}><strong>{h?.feature}:</strong> {h?.benefit}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Resolved Issues:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                    {object?.userFacing?.fixes?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Developer View */}
          <TabsContent value="dev">
            <Card>
              <CardHeader>
                <CardTitle>Developer & Technical Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {object?.developerFacing?.breakingChanges && object.developerFacing.breakingChanges.length > 0 && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <h4 className="font-bold text-sm text-destructive">Breaking Changes:</h4>
                    {object.developerFacing.breakingChanges.map((b, i) => (
                      <div key={i} className="text-xs mt-1">
                        <code>{b?.target}</code>: {b?.migrationStep}
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm">Technical Updates:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                    {object?.developerFacing?.technicalUpdates?.map((u, i) => (
                      <li key={i}><code>[{u?.scope}]</code> {u?.detail}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

---

## 7. 3-Day Execution Milestone Plan

| Phase | Timeframe | Tasks & Objectives |
| :--- | :--- | :--- |
| **Day 1** | **Foundation & Schema** | • Initialize Next.js App Router with Tailwind CSS & shadcn/ui.<br>• Setup Supabase PostgreSQL instance and apply Prisma migrations with `vector(768)`.<br>• Build base dashboard layout with project creation and tone settings forms. |
| **Day 2** | **Gemini AI SDK & Streaming** | • Install `@ai-sdk/google` and implement `/api/releases/generate` using `streamObject` with `gemini-1.5-flash`.<br>• Create the interactive generator studio with `useObject` streaming.<br>• Hook up real-time tab previews for Customer, Dev, and Executive views.<br>• Add database persistence to save draft releases. |
| **Day 3** | **Polishing, Public Sharing & Deploy** | • Build the public changelog page at `/p/[projectSlug]/[version]` with dynamic OG image tags.<br>• Implement Markdown copy-to-clipboard (Markdown, HTML, Slack/Discord webhook format).<br>• Deploy on Vercel and verify edge streaming performance. |

---

## 8. Resume Highlights & Metrics

* **System Design & Generative UI:** *“Architected a full-stack AI changelog generator using Next.js App Router and Vercel AI SDK with Google Gemini, implementing schema-constrained real-time streaming with Zod.”*
* **Multi-Persona Synthesis:** *“Built an automated context transformation pipeline that parses messy Git commits and synthesizes audience-tailored releases (Executive, End-User, Technical).”*
* **Database & Memory Engine:** *“Leveraged PostgreSQL and `pgvector` with Prisma to retain repository tone history and perform semantic few-shot retrieval for style consistency.”*

---

## 9. StampLog Design System & UI Specifications

### 9.1 Brand & Product Vision
* **Product Name:** **StampLog**
* **Tagline:** *Official release notes from raw git logs, powered by AI.*
* **Aesthetic:** Modern developer workspace & infrastructure tooling (sleek dark mode accents, high legibility, clean card surfaces, precise 4px alignment grid).

### 9.2 Iconography Standard
* **Strict Requirement:** **`@phosphor-icons/react` ONLY** across the entire application.
* **Usage:** Line style, 2px stroke, regular / duotone / bold variants depending on context (e.g. `<GitCommit />`, `<GitPullRequest />`, `<RocketLaunch />`, `<Lightning />`, `<ShieldWarning />`, `<Tag />`, `<Sparkle />`).

### 9.3 Typography Scale
* **Font Families:**
  * Primary Sans: `Plus Jakarta Sans` (`var(--font-sans)`)
  * Code / Technical: `Geist Mono` (`var(--font-mono)`)
* **Scale Matrix:**

| Style Level | Size | Weight | Line Height | Application |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | `32px` (`2rem`) | Bold (`700`) | `1.2` | Page Titles, Public Changelog Headers |
| **H2** | `24px` (`1.5rem`) | SemiBold (`600`) | `1.3` | Section Titles, Workspace Headers |
| **H3** | `20px` (`1.25rem`) | SemiBold (`600`) | `1.3` | Module / Audience Card Titles |
| **H4** | `16px` (`1rem`) | Medium (`500`) | `1.4` | Subheadings, Segment Labels |
| **Body Large** | `16px` (`1rem`) | Regular (`400`) | `1.6` | Lead Statements, Executive Summaries |
| **Body Medium** | `14px` (`0.875rem`)| Regular (`400`) | `1.6` | Default Body Text, Changelog Bullet Points |
| **Body Small** | `13px` (`0.8125rem`)| Regular (`400`) | `1.6` | Meta Info, Helper Descriptions |
| **Caption** | `11px` (`0.6875rem`)| Medium (`500`) | `1.4` | Badges, Timestamps, Tag Labels |
| **Code Mono** | `13px` (`0.8125rem`)| Regular (`400`) | `1.5` | Commit Hashes, Technical Scopes, Diff Blocks |

### 9.4 Color Palette & Semantic Tokens

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STAMPLOG COLOR SYSTEM                                  │
│                                                                                        │
│  ┌───────────────────────┐   ┌──────────────────────────────┐   ┌───────────────────┐  │
│  │   Primary Accent      │   │     Secondary Accent         │   │  Base Background  │  │
│  │   Electric Indigo     │   │     Mint Emerald             │   │  Light: #FAFAFA   │  │
│  │   #6366F1 / #4F46E5   │   │     #10B981 / #059669          │   │  Dark:  #09090B   │  │
│  └───────────────────────┘   └──────────────────────────────┘   └───────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Brand & Core Neutrals:**
  * Text Primary: `#09090B` (Light) / `#FAFAFA` (Dark)
  * Text Secondary: `#71717A` (Light) / `#A1A1AA` (Dark)
  * Surface Card: `#FFFFFF` (Light) / `#121215` (Dark)
  * Border / Divider: `#E4E4E7` (Light) / `#27272A` (Dark)
* **Audience Semantic Colors:**
  * **Executive / Leadership View:** Amber (`#F59E0B`) — Strategic milestones & metrics.
  * **Customer / End-User View:** Emerald (`#10B981`) — Benefit-driven features & bug fixes.
  * **Developer / Engineering View:** Indigo (`#6366F1`) — Technical updates & breaking changes (`#EF4444`).

### 9.5 Grid, Spacing, Shadows & Elevation
* **Base Grid Unit:** `4px` ($4px, 8px, 16px, 24px, 32px, 40px, 64px$).
* **Layout Grid:** 12-column system, `1280px` maximum container width, `24px` gutter & margins.
* **Border Radii:** `4px` (`rounded-sm`), `8px` (`rounded-md`), `12px` (`rounded-lg`), `9999px` (`rounded-full`).
* **Shadow Scale:**
  * **Small:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  * **Medium:** `0 4px 12px -2px rgba(0, 0, 0, 0.08)`
  * **Large:** `0 12px 24px -4px rgba(0, 0, 0, 0.12)`

### 9.6 Live Showcase
* A complete, interactive visual design system board is built and accessible at `/design-system`.