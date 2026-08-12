import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      registrations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
        error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.eventId ||
      !body.fullName ||
      !body.email ||
      !body.phone ||
      !body.college ||
      !body.branch ||
      !body.year ||
      !body.reason
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    const eventIdNum = Number(body.eventId);

    // 1. Verify Event Exists
    const event = await prisma.event.findUnique({
      where: { id: eventIdNum },
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found.",
        },
        { status: 404 }
      );
    }

    // 2. Deadline Check
    const now = new Date();
    if (now > new Date(event.registrationDeadline)) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration for this event has closed.",
        },
        { status: 400 }
      );
    }

    // 3. Max Participants Capacity Check
    const currentRegistrationsCount = await prisma.registration.count({
      where: { eventId: eventIdNum },
    });

    if (currentRegistrationsCount >= event.maxParticipants) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration is full for this event.",
        },
        { status: 400 }
      );
    }

    // 4. Duplicate Check
    const alreadyRegistered = await prisma.registration.findFirst({
      where: {
        eventId: eventIdNum,
        email: body.email,
      },
    });

    if (alreadyRegistered) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already registered for this event.",
        },
        { status: 409 }
      );
    }

    // Create Registration with Complete University Fields
    const registration = await prisma.registration.create({
      data: {
        eventId: eventIdNum,
        eventTitle: event.title || body.eventTitle,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        studentId: body.studentId || null,
        gender: body.gender || null,

        college: body.college,
        branch: body.branch,
        year: body.year,
        semester: body.semester || null,
        specialization: body.specialization || null,
        cgpa: body.cgpa || null,
        technicalSkills: body.technicalSkills || null,

        participationType: body.participationType || "Individual",
        teamName: body.teamName || null,
        teamMembers: body.teamMembers || null,

        reason: body.reason,

        previousExperience: body.previousExperience || null,
        relevantSkills: body.relevantSkills || null,
        portfolioUrl: body.portfolioUrl || null,
        githubUrl: body.githubUrl || null,
        linkedinUrl: body.linkedinUrl || null,

        emergencyContactName: body.emergencyContactName || null,
        emergencyContactRelation: body.emergencyContactRelation || null,
        emergencyContactPhone: body.emergencyContactPhone || null,

        dietaryPreference: body.dietaryPreference || null,
        tshirtSize: body.tshirtSize || null,
        accessibilityNeeds: body.accessibilityNeeds || null,

        declarationAccepted: Boolean(body.declarationAccepted ?? true),
        rulesAccepted: Boolean(body.rulesAccepted ?? true),
        certificateConsent: Boolean(body.certificateConsent ?? true),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration Successful",
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration Failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.registration.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
        error,
      },
      { status: 500 }
    );
  }
}