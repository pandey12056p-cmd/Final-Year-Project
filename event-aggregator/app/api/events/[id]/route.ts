import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch event", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.mode !== undefined) updateData.mode = body.mode;
    if (body.organizer !== undefined) updateData.organizer = body.organizer;
    if (body.prize !== undefined) updateData.prize = body.prize;
    if (body.teamSize !== undefined) updateData.teamSize = body.teamSize;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.maxParticipants !== undefined)
      updateData.maxParticipants = Number(body.maxParticipants);
    if (body.certificateAvailable !== undefined)
      updateData.certificateAvailable = Boolean(body.certificateAvailable);

    if (body.date) {
      updateData.date = new Date(body.date);
    }
    if (body.registrationDeadline) {
      updateData.registrationDeadline = new Date(body.registrationDeadline);
    }

    const event = await prisma.event.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { message: "Failed to update event", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    await prisma.event.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete event", error },
      { status: 500 }
    );
  }
}