import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateSkillGapAnalysis } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.decode(token) as { id: number };
    if (!decoded?.id) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: { status: "Upcoming" },
      take: 20,
    });

    const skillGap = await generateSkillGapAnalysis(user, events);

    return NextResponse.json({
      success: true,
      skillGap,
    });
  } catch (error) {
    console.error("AI Skill Gap API Error:", error);
    return NextResponse.json(
      { message: "Failed to perform skill gap analysis." },
      { status: 500 }
    );
  }
}
