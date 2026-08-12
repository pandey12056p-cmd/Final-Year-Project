import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    await prisma.registration.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registration Cancelled",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Delete Failed",
      },
      { status: 500 }
    );
  }
}