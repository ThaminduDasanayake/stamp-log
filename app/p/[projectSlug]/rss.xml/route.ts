import { db } from "@/lib/db";

export const runtime = "nodejs";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    const { projectSlug } = await params;

    const project = await db.project.findFirst({
      where: { slug: projectSlug },
      include: {
        releaseNotes: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!project) {
      return new Response("Project Not Found", { status: 404 });
    }

    const host = req.headers.get("host") || "stamplog.dev";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`;
    const projectUrl = `${baseUrl}/p/${project.slug}`;

    const itemsXml = project.releaseNotes
      .map((rel) => {
        const itemUrl = `${baseUrl}/p/${project.slug}/${encodeURIComponent(rel.version)}`;
        const pubDate = rel.publishedAt
          ? new Date(rel.publishedAt).toUTCString()
          : new Date(rel.createdAt).toUTCString();

        const highlights = (rel.userHighlights as any[]) || [];
        const highlightsHtml = highlights
          .map((h) => `<li><strong>${escapeXml(h?.feature || "")}:</strong> ${escapeXml(h?.benefit || "")}</li>`)
          .join("");

        const contentHtml = `
          <![CDATA[
            <p>${escapeXml(rel.executiveSummary || "")}</p>
            ${highlightsHtml ? `<h3>User Highlights</h3><ul>${highlightsHtml}</ul>` : ""}
            <p><a href="${itemUrl}">View full release notes on StampLog</a></p>
          ]]>
        `;

        return `
    <item>
      <title>${escapeXml(`${rel.title} (${rel.version})`)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${contentHtml}</description>
    </item>`;
      })
      .join("\n");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(project.name)} Release Feed — StampLog</title>
    <link>${projectUrl}</link>
    <description>Official release notes and changelog announcements for ${escapeXml(project.name)}.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${projectUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
