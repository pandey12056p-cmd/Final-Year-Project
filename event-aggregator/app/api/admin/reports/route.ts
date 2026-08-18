import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          include: {
            college: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    console.error("GET Admin Flagged Reports Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { reportId, action } = await req.json();

    if (!reportId || !action) {
      return NextResponse.json({ success: false, message: "Missing reportId or action" }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: Number(reportId) },
      include: { event: true }
    });

    if (!report) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    if (action === "DISMISS") {
      await prisma.report.delete({
        where: { id: report.id }
      });
      return NextResponse.json({ success: true, message: "Report dismissed successfully." });
    }

    if (action === "CANCEL_EVENT") {
      await prisma.event.update({
        where: { id: report.eventId },
        data: { status: "CANCELLED" }
      });

      // Clear all reports for this event
      await prisma.report.deleteMany({
        where: { eventId: report.eventId }
      });

      // Notify College
      const eventDetails = await prisma.event.findUnique({
        where: { id: report.eventId },
        include: { college: true }
      });

      if (eventDetails?.college) {
        await prisma.notification.create({
          data: {
            userId: eventDetails.college.userId,
            title: "Event Cancelled by Moderation",
            message: `Your event "${eventDetails.title}" was cancelled by admin moderation due to student flags.`,
            type: "alert",
            eventId: eventDetails.id
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: "Event cancelled and all associated reports dismissed."
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT Admin Flagged Moderate Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
