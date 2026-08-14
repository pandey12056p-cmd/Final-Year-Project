import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const college = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College profile not found" }, { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: { collegeId: college.id }
    });

    const eventIds = events.map((e) => e.id);

    const registrations = await prisma.registration.findMany({
      where: { eventId: { in: eventIds } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, registrations });
  } catch (error: any) {
    console.error("GET College Registrations Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
