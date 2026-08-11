import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      registrations,
    });
  } catch (error) {
    return Response.json(
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
      return Response.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    // Duplicate Check
    const alreadyRegistered = await prisma.registration.findFirst({
      where: {
        eventId: Number(body.eventId),
        email: body.email,
      },
    });

    if (alreadyRegistered) {
      return Response.json(
        {
          success: false,
          message: "You have already registered for this event.",
        },
        { status: 409 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        eventId: Number(body.eventId),
        eventTitle: body.eventTitle,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        college: body.college,
        branch: body.branch,
        year: body.year,
        teamName: body.teamName || null,
        reason: body.reason,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Registration Successful",
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
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

    return Response.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Delete failed",
        error,
      },
      { status: 500 }
    );
  }
}