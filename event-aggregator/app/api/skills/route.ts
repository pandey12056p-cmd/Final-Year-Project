import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const DEFAULT_SKILLS = [
  { skillName: "Java Core & OOP", status: "Completed", progress: 90 },
  { skillName: "Spring Boot & REST APIs", status: "Learning", progress: 75 },
  { skillName: "SQL & Relational Databases", status: "Completed", progress: 85 },
  { skillName: "React & Next.js UI", status: "Learning", progress: 70 },
  { skillName: "Docker & Containerization", status: "Learning", progress: 40 },
  { skillName: "System Design & Architecture", status: "Not Started", progress: 20 },
];

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let skillsProgress = await prisma.skillProgress.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    if (skillsProgress.length === 0) {
      // Seed default skills
      for (const item of DEFAULT_SKILLS) {
        await prisma.skillProgress.create({
          data: {
            userId: user.id,
            skillName: item.skillName,
            status: item.status,
            progress: item.progress,
          },
        });
      }

      skillsProgress = await prisma.skillProgress.findMany({
        where: { userId: user.id },
      });
    }

    return NextResponse.json({
      success: true,
      skills: skillsProgress,
    });
  } catch (error) {
    console.error("GET skills Error:", error);
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
    const { skillName, status, progress } = body;

    if (!skillName) {
      return NextResponse.json({ message: "Skill name is required" }, { status: 400 });
    }

    const skillRecord = await prisma.skillProgress.upsert({
      where: {
        userId_skillName: {
          userId: decoded.id,
          skillName,
        },
      },
      update: {
        status: status || "Learning",
        progress: Number(progress) || 50,
      },
      create: {
        userId: decoded.id,
        skillName,
        status: status || "Learning",
        progress: Number(progress) || 50,
      },
    });

    return NextResponse.json({
      success: true,
      skill: skillRecord,
    });
  } catch (error) {
    console.error("POST skills Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
