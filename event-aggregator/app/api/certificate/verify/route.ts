import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get("id");

    if (!certificateId) {
      return NextResponse.json(
        { valid: false, message: "Certificate ID is required." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findFirst({
      where: { certificateId },
    });

    if (!registration || !registration.certificateIssued) {
      return NextResponse.json(
        { valid: false, message: "Invalid or unissued certificate ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        certificateId: registration.certificateId,
        fullName: registration.fullName,
        eventTitle: registration.eventTitle,
        issuedAt: registration.certificateIssuedAt,
      },
    });
  } catch (error) {
    console.error("Certificate verify error:", error);
    return NextResponse.json(
      { valid: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const certificateId = body.certificateId || body.id;

    if (!certificateId) {
      return NextResponse.json(
        { valid: false, message: "Certificate ID is required." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findFirst({
      where: { certificateId },
    });

    if (!registration || !registration.certificateIssued) {
      return NextResponse.json(
        { valid: false, message: "Invalid or unissued certificate ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        certificateId: registration.certificateId,
        fullName: registration.fullName,
        eventTitle: registration.eventTitle,
        issuedAt: registration.certificateIssuedAt,
      },
    });
  } catch (error) {
    console.error("Certificate verify error:", error);
    return NextResponse.json(
      { valid: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
