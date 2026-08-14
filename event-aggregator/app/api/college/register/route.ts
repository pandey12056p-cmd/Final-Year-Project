import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Check if college profile already exists
    const existingCollege = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (existingCollege) {
      return NextResponse.json({ success: false, message: "College profile already exists" }, { status: 400 });
    }

    const {
      name,
      code,
      officialEmail,
      website,
      address,
      contactDetails,
      authorizedPerson,
      logo,
      verificationDoc
    } = await req.json();

    if (!name || !code || !officialEmail || !website || !address || !contactDetails || !authorizedPerson) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if official email already registered for another college
    const emailConflict = await prisma.college.findUnique({
      where: { officialEmail }
    });

    if (emailConflict) {
      return NextResponse.json({ success: false, message: "Official email already registered" }, { status: 400 });
    }

    const college = await prisma.college.create({
      data: {
        userId: user.id,
        name,
        code,
        officialEmail,
        website,
        address,
        contactDetails,
        authorizedPerson,
        logo: logo || null,
        verificationDoc: verificationDoc || null,
        status: "PENDING_VERIFICATION"
      }
    });

    return NextResponse.json({
      success: true,
      message: "College profile created successfully. Pending verification.",
      college
    });
  } catch (error: any) {
    console.error("College Register API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
