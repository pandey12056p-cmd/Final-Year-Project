import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
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
    const rating = Number(body.rating);
    const comment = body.comment || "";

    if (!eventId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Valid Event ID and rating (1-5) required." }, { status: 400 });
    }

    // Verify student actually registered for this event
    const registration = await prisma.registration.findFirst({
      where: {
        eventId,
        email: user.email,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Only registered students can submit feedback for this event." },
        { status: 403 }
      );
    }

    // Upsert feedback to prevent duplicates
    const feedback = await prisma.feedback.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: user.id,
        eventId,
        rating,
        comment,
      },
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        title: `Submitted feedback for ${registration.eventTitle}`,
        type: "feedback",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (error) {
    console.error("POST feedback Error:", error);
    return NextResponse.json({ message: "Failed to submit feedback." }, { status: 500 });
  }
}
