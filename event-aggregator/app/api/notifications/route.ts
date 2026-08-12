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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Auto-generate realistic notifications based on student registrations if empty
    let notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (notifications.length === 0) {
      const registrations = await prisma.registration.findMany({
        where: { email: user.email },
        take: 5,
        orderBy: { createdAt: "desc" },
      });

      if (registrations.length > 0) {
        for (const reg of registrations) {
          await prisma.notification.create({
            data: {
              userId: user.id,
              title: "Registration Confirmed",
              message: `You have successfully registered for ${reg.eventTitle}.`,
              type: "registration",
              eventId: reg.eventId,
            },
          });

          if (reg.certificateIssued) {
            await prisma.notification.create({
              data: {
                userId: user.id,
                title: "Certificate Available",
                message: `Your official certificate for ${reg.eventTitle} is ready to download.`,
                type: "certificate",
                eventId: reg.eventId,
              },
            });
          }
        }

        notifications = await prisma.notification.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        });
      }
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("GET notifications Error:", error);
    return NextResponse.json({ message: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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
    const { notificationId, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: decoded.id },
        data: { isRead: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: Number(notificationId) },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notifications updated successfully.",
    });
  } catch (error) {
    console.error("PATCH notifications Error:", error);
    return NextResponse.json({ message: "Failed to update notifications." }, { status: 500 });
  }
}
