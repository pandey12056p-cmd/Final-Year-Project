import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING_APPROVAL";

    const events = await prisma.event.findMany({
      where: { status },
      orderBy: { submittedAt: "desc" },
      include: {
        college: true
      }
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error("GET Admin Events Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    const adminName = adminUser?.name || "Admin";

    const { eventId, action, reason } = await req.json();

    if (!eventId || !action) {
      return NextResponse.json({ success: false, message: "Missing eventId or action" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
      include: { college: true }
    });

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    let status = event.status;
    let message = "";

    if (action === "APPROVE") {
      status = "APPROVED";
      message = `Your event "${event.title}" has been approved by the administrator and is now live to students!`;
    } else if (action === "REJECT") {
      status = "REJECTED";
      message = `Your event "${event.title}" was rejected by the administrator. Reason: ${reason || "None specified"}`;
    } else if (action === "REQUEST_CHANGES") {
      status = "CHANGES_REQUIRED";
      message = `Your event "${event.title}" requires changes before approval. Feedback: ${reason || "Please review event details"}`;
    }

    const updated = await prisma.event.update({
      where: { id: event.id },
      data: {
        status,
        approvedAt: action === "APPROVE" ? new Date() : null,
        approvedBy: action === "APPROVE" ? adminName : null,
        reviewReason: reason || null
      }
    });

    // Notify college user
    if (event.college) {
      await prisma.notification.create({
        data: {
          userId: event.college.userId,
          title: `Event Status: ${status}`,
          message,
          type: action === "APPROVE" ? "info" : "alert",
          eventId: event.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Event status updated to ${status}.`,
      event: updated
    });
  } catch (error: any) {
    console.error("PUT Admin Event Approval Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
