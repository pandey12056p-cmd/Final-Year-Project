import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateCareerRoadmap } from "@/lib/ai";

export async function POST(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const targetCareer = body.targetCareer || user.careerGoal || "Full Stack Developer";

    const events = await prisma.event.findMany({
      where: { status: "Upcoming" },
      take: 20,
    });

    const roadmap = await generateCareerRoadmap(user, events, targetCareer);

    return NextResponse.json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("AI Career API Error:", error);
    return NextResponse.json(
      { message: "Failed to generate career roadmap." },
      { status: 500 }
    );
  }
}
