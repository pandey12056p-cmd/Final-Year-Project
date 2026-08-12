import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ events: [], users: [], registrations: [] });
    }

    const cleanQuery = query.trim();

    // Query databases in parallel
    const [events, users, registrations] = await Promise.all([
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: cleanQuery } },
            { location: { contains: cleanQuery } },
            { category: { contains: cleanQuery } },
          ],
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery } },
            { email: { contains: cleanQuery } },
          ],
        },
        take: 5,
      }),
      prisma.registration.findMany({
        where: {
          OR: [
            { fullName: { contains: cleanQuery } },
            { email: { contains: cleanQuery } },
            { eventTitle: { contains: cleanQuery } },
          ],
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({ events, users, registrations });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
