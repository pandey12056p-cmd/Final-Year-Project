import { prisma } from "@/lib/prisma";

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

    return Response.json(event);
  } catch (error) {
    return Response.json(
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

    const event = await prisma.event.update({
      where: {
        id: Number(id),
      },
      data: {
        title: body.title,
        image: body.image,
        date: body.date,
        location: body.location,
        description: body.description,
        prize: body.prize,
        teamSize: body.teamSize,
      },
    });

    return Response.json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    return Response.json(
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

    return Response.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { message: "Failed to delete event", error },
      { status: 500 }
    );
  }
}