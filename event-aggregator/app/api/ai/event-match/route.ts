import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { checkEventMatch } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Please login to check event match." }, { status: 401 });
    }

    const decoded = jwt.decode(token) as { id: number };
    if (!decoded?.id) {
      return NextResponse.json({ message: "Invalid Session." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const eventId = Number(body.eventId);

    if (!eventId) {
      return NextResponse.json({ message: "Event ID is required." }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }

    const registrations = await prisma.registration.findMany({
      where: { email: user.email },
    });

    const matchAnalysis = await checkEventMatch(user, event, registrations);

    return NextResponse.json({
      success: true,
      match: matchAnalysis,
    });
  } catch (error) {
    console.error("Event Match API Error:", error);
    return NextResponse.json(
      { message: "Failed to evaluate event match." },
      { status: 500 }
    );
  }
}
