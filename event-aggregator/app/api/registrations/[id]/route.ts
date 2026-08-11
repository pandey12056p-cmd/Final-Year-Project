import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.registration.delete({
      where: {
        id: Number(params.id),
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