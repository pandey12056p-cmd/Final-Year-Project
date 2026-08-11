import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { registrationId } = await request.json();

    if (!registrationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration ID is required.",
        },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: {
        id: registrationId,
      },
    });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found.",
        },
        { status: 404 }
      );
    }

    if (registration.certificateIssued) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate already issued.",
        },
        { status: 400 }
      );
    }

    // Generate Unique Certificate ID
    const year = new Date().getFullYear();

    const certificateId = `EA-${year}-${registration.id
      .toString()
      .padStart(6, "0")}`;

    await prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        certificateIssued: true,
        certificateIssuedAt: new Date(),
        certificateId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate Issued Successfully",
      certificateId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}