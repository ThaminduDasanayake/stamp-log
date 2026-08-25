import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectSlug: string; version: string }> }
) {
  try {
    const { projectSlug, version } = await params;
    const decodedVersion = decodeURIComponent(version);

    const release = await db.releaseNote.findFirst({
      where: {
        version: decodedVersion,
        project: { slug: projectSlug },
      },
      include: { project: true },
    });

    const title = release?.title || `Release ${decodedVersion}`;
    const projectName = release?.project.name || projectSlug;
    const summary =
      release?.executiveSummary ||
      "Official AI release notes and changelog announcements.";

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
            backgroundColor: "#09090B",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #18181B 2%, transparent 0%)",
            backgroundSize: "40px 40px",
            color: "#FAFAFA",
            padding: "60px",
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
                height: "48px",
                width: "48px",
                borderRadius: "14px",
                backgroundColor: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ((o))
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  letterSpacing: "-0.5px",
                }}
              >
                stamplog
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#A1A1AA",
                  marginTop: "-2px",
                }}
              >
                {projectName} • Public Changelog
              </span>
            </div>
          </div>

          {/* Main Title & Version Badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  backgroundColor: "rgba(79, 70, 229, 0.2)",
                  color: "#818CF8",
                  border: "1px solid rgba(79, 70, 229, 0.4)",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                {decodedVersion}
              </span>
              <span
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#34D399",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Official Release
              </span>
            </div>

            <h1
              style={{
                fontSize: "44px",
                fontWeight: "900",
                lineHeight: "1.15",
                letterSpacing: "-1px",
                color: "#FFFFFF",
                margin: "0",
              }}
            >
              {title.length > 70 ? `${title.substring(0, 70)}...` : title}
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#A1A1AA",
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
              borderTop: "1px solid #27272A",
              paddingTop: "20px",
              fontSize: "14px",
              color: "#71717A",
            }}
          >
            <span>Automated Release Intelligence • Powered by Gemini 3.6 Flash</span>
            <span style={{ color: "#818CF8", fontWeight: "600" }}>
              stamplog.dev
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating OpenGraph image", { status: 500 });
  }
}
