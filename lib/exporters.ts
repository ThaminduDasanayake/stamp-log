export interface ReleaseExportPayload {
  title: string;
  version: string;
  executiveSummary?: string | null;
  userHighlights?: { feature: string; benefit: string }[] | null;
  userFixes?: string[] | null;
  breakingChanges?: { target: string; migrationStep: string }[] | null;
  technicalUpdates?: { scope: string; detail: string }[] | null;
}

/**
 * Generates standard GitHub Flavored Markdown
 */
export function exportToMarkdown(rel: ReleaseExportPayload): string {
  const highlights = (rel.userHighlights || [])
    .map((h) => `- **${h.feature}**: ${h.benefit}`)
    .join("\n");
  const fixes = (rel.userFixes || []).map((f) => `- ${f}`).join("\n");
  const breaking = (rel.breakingChanges || [])
    .map((b) => `- \`${b.target}\`: ${b.migrationStep}`)
    .join("\n");
  const tech = (rel.technicalUpdates || [])
    .map((u) => `- [${u.scope}] ${u.detail}`)
    .join("\n");

  return `# ${rel.title} (${rel.version})

## 💼 Executive Summary
${rel.executiveSummary || "No summary provided."}

## 🟢 Customer Highlights
${highlights || "No highlights."}

${fixes ? `### 🐛 Resolved Issues\n${fixes}\n` : ""}
${breaking ? `## ⚠️ Breaking Changes\n${breaking}\n` : ""}
## 🟣 Technical Updates
${tech || "No technical updates."}`;
}

/**
 * Generates Notion-friendly Markdown block formatting
 */
export function exportToNotion(rel: ReleaseExportPayload): string {
  const highlights = (rel.userHighlights || [])
    .map((h) => `• *${h.feature}* — ${h.benefit}`)
    .join("\n");
  const tech = (rel.technicalUpdates || [])
    .map((u) => `• [${u.scope}] ${u.detail}`)
    .join("\n");

  return `🚀 ${rel.title} [${rel.version}]

📌 Executive Summary
${rel.executiveSummary || ""}

✨ What's New
${highlights}

🔧 Engineering Notes
${tech}`;
}

/**
 * Generates Rich HTML Email Newsletter template
 */
export function exportToHtmlEmail(rel: ReleaseExportPayload): string {
  const highlightsHtml = (rel.userHighlights || [])
    .map(
      (h) =>
        `<li style="margin-bottom: 8px;"><strong style="color: #4F46E5;">${h.feature}:</strong> ${h.benefit}</li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${rel.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F4F5; padding: 20px; color: #18181B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; border: 1px solid #E4E4E7;">
    
    <div style="margin-bottom: 24px;">
      <span style="background: #EEF2FF; color: #4F46E5; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 12px;">${rel.version}</span>
      <h1 style="font-size: 24px; font-weight: 800; margin-top: 12px; margin-bottom: 8px;">${rel.title}</h1>
    </div>

    <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <p style="font-size: 14px; margin: 0; line-height: 1.6; color: #92400E;">${rel.executiveSummary || ""}</p>
    </div>

    <h2 style="font-size: 16px; font-weight: 700; color: #10B981; margin-bottom: 12px;">✨ Customer Highlights</h2>
    <ul style="font-size: 14px; line-height: 1.6; padding-left: 20px; margin-bottom: 24px;">
      ${highlightsHtml}
    </ul>

    <div style="border-top: 1px solid #E4E4E7; pt: 16px; font-size: 12px; color: #71717A; text-align: center;">
      <p>Sent via StampLog Release Intelligence Engine</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates GitHub Release tag formatted Markdown
 */
export function exportToGitHubRelease(rel: ReleaseExportPayload): string {
  const highlights = (rel.userHighlights || [])
    .map((h) => `* **${h.feature}**: ${h.benefit}`)
    .join("\n");
  const breaking = (rel.breakingChanges || [])
    .map((b) => `* **BREAKING**: \`${b.target}\` — ${b.migrationStep}`)
    .join("\n");
  const tech = (rel.technicalUpdates || [])
    .map((u) => `* \`[${u.scope}]\` ${u.detail}`)
    .join("\n");

  return `## ${rel.title}

### Executive Summary
${rel.executiveSummary || ""}

### User Features
${highlights}

${breaking ? `### ⚠️ Breaking Changes\n${breaking}\n` : ""}
### Technical Scopes
${tech}`;
}
