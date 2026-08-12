import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getEventRecommendations } from "@/lib/ai";

export async function GET(req: NextRequest) {
  return handleRecommendations(req);
}

export async function POST(req: NextRequest) {
  return handleRecommendations(req);
}

async function handleRecommendations(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to access AI recommendations." },
        { status: 401 }
      );
    }

    const decoded = jwt.decode(token) as { id: number };

    if (!decoded?.id) {
      return NextResponse.json(
        { message: "Invalid session token." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }

    let query = "";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      query = body.query || "";
    }

    const registrations = await prisma.registration.findMany({
      where: { email: user.email },
      orderBy: { createdAt: "desc" },
    });

    const events = await prisma.event.findMany({
      where: {
        status: {
          in: ["Upcoming", "Ongoing"],
        },
      },
      take: 20,
      orderBy: { date: "asc" },
    });

    const recommendations = await getEventRecommendations({
      user,
      registrations,
      events,
      query,
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json(
      { message: "Failed to generate AI recommendations. Please try again." },
      { status: 500 }
    );
  }
}
