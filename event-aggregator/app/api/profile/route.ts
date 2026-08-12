import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        phone: true,
        college: true,
        branch: true,
        year: true,
        skills: true,
        interests: true,
        careerGoal: true,
        githubUrl: true,
        linkedinUrl: true,
        portfolioUrl: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET profile Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.decode(token) as {
      id: number;
    };

    if (!decoded?.id) {
      return NextResponse.json(
        { message: "Invalid Token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        name: body.name,
        studentId: body.studentId,
        phone: body.phone,
        college: body.college,
        branch: body.branch,
        year: body.year,
        skills: body.skills,
        interests: body.interests,
        careerGoal: body.careerGoal,
        preferredDomain: body.preferredDomain,
        experienceLevel: body.experienceLevel,
        preferredMode: body.preferredMode,
        preferredLocation: body.preferredLocation,
        githubUrl: body.githubUrl,
        linkedinUrl: body.linkedinUrl,
        portfolioUrl: body.portfolioUrl,
        bio: body.bio,
      },
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        userId: decoded.id,
        title: "Updated student profile and social links",
        type: "profile_update",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}