import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("stamplog_session")?.value;

    console.log("👤 Raw Session Cookie Read in /api/auth/me:", sessionCookie);

    if (!sessionCookie) {
      return Response.json({ authenticated: false, user: null }, { status: 401 });
    }

    try {
      const parsed = JSON.parse(sessionCookie);

      // Return strictly parsed user profile data dynamically fetched from GitHub
      return Response.json({
        authenticated: true,
        user: {
          name: parsed.name || parsed.username || "Developer",
          username: parsed.username || "developer",
          email: parsed.email || null,
          avatarUrl: parsed.avatarUrl || null,
        },
      });
    } catch (parseErr) {
      console.warn("⚠️ Unauthenticated or invalid session cookie format:", parseErr);
      return Response.json({ authenticated: false, user: null }, { status: 401 });
    }
  } catch (error) {
    console.error("❌ Error fetching me session:", error);
    return Response.json({ authenticated: false, user: null }, { status: 500 });
  }
}
