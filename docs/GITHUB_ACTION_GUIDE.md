# Automated GitHub Action Integration Guide for StampLog

Automatically synthesize and publish multi-audience release notes to **StampLog** whenever a developer pushes a `git tag` (e.g., `git tag v2.4.0 && git push --tags`) or merges a release PR.

---

## ⚡ How It Works

```
┌─────────────────────────┐       ┌───────────────────────────┐       ┌─────────────────────────┐
│   Developer Pushes      │       │     GitHub Action         │       │    StampLog Webhook     │
│   Git Tag (e.g. v2.4.0) │──►──► │  Extracts git commits     │──►──► │   /api/v1/automate      │
│   or merges Release PR  │       │  & sends payload          │       │   (Gemini 3.6 Flash)    │
└─────────────────────────┘       └───────────────────────────┘       └─────────────────────────┘
                                                                                  │
                                                                                  ▼
                                                                      ┌─────────────────────────┐
                                                                      │   Saved to PostgreSQL   │
                                                                      │   & Live on Public URL  │
                                                                      │   /p/demo/v2.4.0        │
                                                                      └─────────────────────────┘
```

---

## 🚀 Step 1: Add GitHub Action Workflow File

In your repository, create a new workflow file at `.github/workflows/stamplog.yml`:

```yaml
name: StampLog Automated Release Notes

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  synthesize-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Extract Commit History Since Last Tag
        id: git_commits
        run: |
          PREV_TAG=$(git describe --tags --abbrev=0 ${GITHUB_REF_NAME}^ 2>/dev/null || git rev-list --max-parents=0 HEAD)
          echo "Previous tag/commit: $PREV_TAG"
          COMMITS=$(git log ${PREV_TAG}..HEAD --pretty=format:"%s (%h by %an)")
          echo "COMMITS<<EOF" >> $GITHUB_ENV
          echo "$COMMITS" >> $GITHUB_ENV
          echo "EOF" >> $GITHUB_ENV

      - name: Send Commit Payload to StampLog Webhook
        run: |
          curl -X POST "${{ secrets.STAMPLOG_URL }}/api/v1/automate" \
            -H "Content-Type: application/json" \
            -d '{
              "rawCommits": '"$(jq -R -s '.' <<< "$COMMITS")"',
              "version": "'"${GITHUB_REF_NAME}"'",
              "projectSlug": "demo",
              "status": "PUBLISHED"
            }'
```

---

## 🔑 Step 2: Add Repository Secrets

In your GitHub repository:
1. Go to **Settings ➔ Secrets and variables ➔ Actions**.
2. Click **New repository secret**.
3. Name: `STAMPLOG_URL`
4. Value: `https://your-stamplog-domain.com` (or your Vercel deployment URL).

---

## 🧪 Testing the Automation via cURL

You can also test the automated webhook directly from your local terminal using `curl`:

```bash
curl -X POST "http://localhost:3000/api/v1/automate" \
  -H "Content-Type: application/json" \
  -d '{
    "rawCommits": "feat(auth): add OAuth2 SSO refresh token rotation #102\nfix(ui): resolve layout shift on mobile viewports\nbreaking(api): deprecate v1 legacy auth header",
    "version": "v2.5.0",
    "projectSlug": "demo",
    "status": "PUBLISHED"
  }'
```

**Response Output:**
```json
{
  "success": true,
  "message": "Automated release successfully synthesized and saved!",
  "release": {
    "id": "cm...1",
    "version": "v2.5.0",
    "title": "OAuth2 SSO Launch & UI Performance",
    "status": "PUBLISHED",
    "publicUrl": "/p/demo/v2.5.0"
  }
}
```
