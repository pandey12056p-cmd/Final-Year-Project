import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.decode(token) as { id: number };
    if (!decoded?.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId: decoded.id },
      orderBy: { reminderDate: "asc" },
    });

    return NextResponse.json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error("GET reminders Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.decode(token) as { id: number };
    if (!decoded?.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const eventId = Number(body.eventId);

    if (!eventId) {
      return NextResponse.json({ message: "Event ID required" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: decoded.id,
        eventId,
        reminderDate: new Date(event.date),
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: decoded.id,
        title: "Reminder Set",
        message: `Reminder set for event "${event.title}" on ${new Date(event.date).toLocaleDateString()}.`,
        type: "reminder",
        eventId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reminder set successfully!",
      reminder,
    });
  } catch (error) {
    console.error("POST reminders Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
