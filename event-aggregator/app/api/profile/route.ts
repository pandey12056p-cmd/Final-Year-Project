import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
        phone: body.phone,
        college: body.college,
        branch: body.branch,
        year: body.year,
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