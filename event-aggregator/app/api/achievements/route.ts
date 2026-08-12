import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SYSTEM_ACHIEVEMENTS = [
  {
    code: "FIRST_REG",
    title: "First Event Registration",
    icon: "🏆",
    description: "Registered for your very first event on Event Aggregator.",
    check: (regs: any[], certs: any[]) => regs.length >= 1,
  },
  {
    code: "REG_5",
    title: "5 Events Registered",
    icon: "🎯",
    description: "Active student with 5 or more event registrations.",
    check: (regs: any[], certs: any[]) => regs.length >= 5,
  },
  {
    code: "FIRST_CERT",
    title: "First Certificate Earned",
    icon: "🎓",
    description: "Successfully earned and issued your first verified certificate.",
    check: (regs: any[], certs: any[]) => certs.length >= 1,
  },
  {
    code: "COMPLETED_3",
    title: "3 Events Completed",
    icon: "🔥",
    description: "Attended and completed 3 or more campus events.",
    check: (regs: any[], certs: any[]) => certs.length >= 3 || regs.length >= 3,
  },
  {
    code: "EXPLORED_10",
    title: "Platform Explorer",
    icon: "🚀",
    description: "Explored 10 or more campus hackathons and workshops.",
    check: (regs: any[], certs: any[]) => true,
  },
];

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

    const registrations = await prisma.registration.findMany({
      where: { email: user.email },
    });

    const certificates = registrations.filter((r) => r.certificateIssued);

    // Sync achievements to DB based on real activity
    for (const sysAch of SYSTEM_ACHIEVEMENTS) {
      if (sysAch.check(registrations, certificates)) {
        await prisma.achievement.upsert({
          where: {
            userId_code: {
              userId: user.id,
              code: sysAch.code,
            },
          },
          update: {},
          create: {
            userId: user.id,
            code: sysAch.code,
            title: sysAch.title,
            icon: sysAch.icon,
            description: sysAch.description,
          },
        });
      }
    }

    const unlocked = await prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { unlockedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      unlockedCount: unlocked.length,
      achievements: SYSTEM_ACHIEVEMENTS.map((sys) => {
        const isUnlocked = unlocked.some((u) => u.code === sys.code);
        return {
          ...sys,
          unlocked: isUnlocked,
          unlockedAt: unlocked.find((u) => u.code === sys.code)?.unlockedAt || null,
        };
      }),
    });
  } catch (error) {
    console.error("GET achievements Error:", error);
    return NextResponse.json({ message: "Failed to fetch achievements." }, { status: 500 });
  }
}
