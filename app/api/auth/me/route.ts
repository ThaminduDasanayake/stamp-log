import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("stamplog_session")?.value;

    if (!sessionCookie) {
      return Response.json({ authenticated: false, user: null }, { status: 401 });
    }

    try {
      const parsed = JSON.parse(sessionCookie);
      return Response.json({
        authenticated: true,
        user: {
          name: parsed.name || "GitHub Developer",
          username: parsed.username || "developer",
          email: parsed.email || null,
          avatarUrl: parsed.avatarUrl || "https://avatars.githubusercontent.com/u/8924719?v=4",
        },
      });
    } catch {
      // If simple cookie string
      return Response.json({
        authenticated: true,
        user: {
          name: "Thamindu Dasanayake",
          username: "ThaminduDasanayake",
          email: "thamindu@stamplog.dev",
          avatarUrl: "https://avatars.githubusercontent.com/u/8924719?v=4",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching me session:", error);
    return Response.json({ authenticated: false, user: null }, { status: 500 });
  }
}
