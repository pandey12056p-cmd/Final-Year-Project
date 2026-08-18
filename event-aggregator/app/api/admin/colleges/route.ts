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
    const status = searchParams.get("status");

    const colleges = await prisma.college.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, colleges });
  } catch (error: any) {
    console.error("GET Admin Colleges Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { collegeId, action, reason } = await req.json();

    if (!collegeId || !action) {
      return NextResponse.json({ success: false, message: "Missing collegeId or action" }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { id: Number(collegeId) }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College not found" }, { status: 404 });
    }

    let status = college.status;
    let message = "";

    if (action === "APPROVE") {
      status = "VERIFIED";
      message = "Your college verification request has been approved. You can now publish events!";
      
      await prisma.user.update({
        where: { id: college.userId },
        data: { role: "college" }
      });
    } else if (action === "REJECT") {
      status = "REJECTED";
      message = `Your college verification request was rejected. Reason: ${reason || "None specified"}`;
    } else if (action === "REQUEST_INFO") {
      status = "PENDING_VERIFICATION";
      message = `Information requested regarding your verification. Details: ${reason || "Please update your profile details"}`;
    } else if (action === "SUSPEND") {
      status = "SUSPENDED";
      message = `Your college account has been suspended. Reason: ${reason || "None specified"}`;
      
      // Cancel all events belonging to this suspended college
      await prisma.event.updateMany({
        where: { collegeId: college.id },
        data: { status: "CANCELLED" }
      });
    }

    const updated = await prisma.college.update({
      where: { id: college.id },
      data: {
        status,
        rejectReason: reason || null
      }
    });

    // Create Notification for the college user
    await prisma.notification.create({
      data: {
        userId: college.userId,
        title: `Verification Status: ${status}`,
        message,
        type: action === "APPROVE" ? "info" : "alert"
      }
    });

    return NextResponse.json({
      success: true,
      message: `College status updated to ${status}.`,
      college: updated
    });
  } catch (error: any) {
    console.error("PUT Admin College Status Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
