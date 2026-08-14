import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ success: false, message: "Only students can report events" }, { status: 401 });
    }

    const { id } = await params;
    const eventId = Number(id);

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const { reason, comment } = await req.json();

    if (!reason) {
      return NextResponse.json({ success: false, message: "Please specify a reason for reporting" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        eventId,
        userId: user.id,
        reason,
        comment: comment || null
      }
    });

    return NextResponse.json({
      success: true,
      message: "Event flagged and reported to administrator. Thank you for your feedback.",
      report
    });
  } catch (error: any) {
    console.error("POST Student Report Event Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
