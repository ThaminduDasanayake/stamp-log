import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectSlug: string; version: string }> },
) {
  try {
    const { projectSlug, version } = await params;
    const decodedVersion = decodeURIComponent(version);

    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, projectSlug),
      with: {
        releaseNotes: {
          where: (r, { eq }) => eq(r.version, decodedVersion),
          limit: 1,
        },
      },
    });

    const releaseNote = project?.releaseNotes[0];
    const release = releaseNote && project ? { ...releaseNote, project } : null;

    const title = release?.title || `Release ${decodedVersion}`;
    const projectName = release?.project.name || projectSlug;
    const summary =
      release?.executiveSummary ||
      "Official release notes and changelog announcements.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#000000",
            color: "#EDEDED",
            padding: "64px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                height: "36px",
                width: "36px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000000",
                fontSize: "18px",
                fontWeight: "900",
                borderRadius: "4px",
              }}
            >
              ▲
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  letterSpacing: "-0.5px",
                  color: "#FFFFFF",
                }}
              >
                stamplog
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#888888",
                  fontFamily: "monospace",
                }}
              >
                {projectName} / {decodedVersion}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1040px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#171717",
                  color: "#EDEDED",
                  border: "1px solid #333333",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                  fontFamily: "monospace",
                }}
              >
                {decodedVersion}
              </span>
              <span
                style={{
                  backgroundColor: "rgba(80, 227, 194, 0.1)",
                  color: "#50E3C2",
                  border: "1px solid rgba(80, 227, 194, 0.25)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Published Release
              </span>
            </div>

            <h1
              style={{
                fontSize: "48px",
                fontWeight: "600",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
                color: "#FFFFFF",
                margin: "0",
              }}
            >
              {title.length > 70 ? `${title.substring(0, 70)}...` : title}
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#888888",
                lineHeight: "1.5",
                margin: "0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {summary}
            </p>
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid #1F1F1F",
              paddingTop: "20px",
              fontSize: "13px",
              color: "#666666",
              fontFamily: "monospace",
            }}
          >
            <span>Automated Release Intelligence Engine</span>
            <span style={{ color: "#EDEDED" }}>stamplog.dev</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating OpenGraph image", { status: 500 });
  }
}
