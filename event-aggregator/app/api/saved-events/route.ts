import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
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

    const savedRecords = await prisma.savedEvent.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: "desc" },
    });

    const eventIds = savedRecords.map((s) => s.eventId);

    const events = await prisma.event.findMany({
      where: { id: { in: eventIds } },
    });

    return NextResponse.json({
      success: true,
      savedEvents: events,
    });
  } catch (error) {
    console.error("GET saved-events Error:", error);
    return NextResponse.json({ message: "Failed to fetch saved events." }, { status: 500 });
  }
}

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

    // Toggle logic: If already saved, remove it. Else save it.
    const existing = await prisma.savedEvent.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.id,
          eventId,
        },
      },
    });

    if (existing) {
      await prisma.savedEvent.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        success: true,
        saved: false,
        message: "Event removed from saved list.",
      });
    }

    await prisma.savedEvent.create({
      data: {
        userId: decoded.id,
        eventId,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: decoded.id,
        title: `Saved event "${event.title}"`,
        type: "save",
      },
    });

    return NextResponse.json({
      success: true,
      saved: true,
      message: "Event saved successfully.",
    });
  } catch (error) {
    console.error("POST saved-events Error:", error);
    return NextResponse.json({ message: "Failed to save event." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const eventId = Number(searchParams.get("eventId"));

    if (!eventId) {
      return NextResponse.json({ message: "Event ID required." }, { status: 400 });
    }

    await prisma.savedEvent.deleteMany({
      where: {
        userId: decoded.id,
        eventId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Saved event removed.",
    });
  } catch (error) {
    console.error("DELETE saved-events Error:", error);
    return NextResponse.json({ message: "Failed to delete saved event." }, { status: 500 });
  }
}
