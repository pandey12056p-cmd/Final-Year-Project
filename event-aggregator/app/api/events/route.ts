import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===============================
// GET ALL EVENTS
// ===============================

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events.",
      },
      {
        status: 500,
      }
    );
  }
}

// ===============================
// CREATE EVENT
// ===============================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation
    if (
      !body.title ||
      !body.category ||
      !body.organizer ||
      !body.image ||
      !body.description ||
      !body.location ||
      !body.mode ||
      !body.date ||
      !body.registrationDeadline
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        category: body.category,
        organizer: body.organizer,
        image: body.image,
        description: body.description,
        location: body.location,
        mode: body.mode,

        date: new Date(body.date),

        registrationDeadline: new Date(
          body.registrationDeadline
        ),

        maxParticipants:
          Number(body.maxParticipants) || 100,

        prize: body.prize,

        teamSize: body.teamSize,

        status: body.status || "Upcoming",

        certificateAvailable:
          body.certificateAvailable ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}