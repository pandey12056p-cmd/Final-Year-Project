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

    return NextResponse.json({ success: true, college });
  } catch (error: any) {
    console.error("GET College Profile Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      website,
      address,
      contactDetails,
      authorizedPerson,
      logo,
      verificationDoc
    } = await req.json();

    if (!name || !website || !address || !contactDetails || !authorizedPerson) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.college.update({
      where: { userId: user.id },
      data: {
        name,
        website,
        address,
        contactDetails,
        authorizedPerson,
        logo: logo || null,
        verificationDoc: verificationDoc || null
      }
    });

    return NextResponse.json({
      success: true,
      message: "College profile updated successfully",
      college: updated
    });
  } catch (error: any) {
    console.error("PUT College Profile Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
