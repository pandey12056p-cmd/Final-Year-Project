import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateChatResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const decoded = jwt.decode(token) as { id: number };
    if (!decoded?.id) {
      return NextResponse.json(
        { message: "Invalid Token." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = body.message || "What events are best for me?";

    const events = await prisma.event.findMany({
      where: { status: { in: ["Upcoming", "Ongoing"] } },
      orderBy: { date: "asc" },
      take: 20,
    });

    const chatResult = await generateChatResponse(user, events, message);

    return NextResponse.json({
      success: true,
      chat: chatResult,
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { message: "AI Assistant is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
