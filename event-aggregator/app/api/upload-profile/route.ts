import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // JWT Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const decoded = jwt.decode(token) as {
      id: number;
    };

    if (!decoded?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Token",
        },
        {
          status: 401,
        }
      );
    }

    // Receive File
    const data = await req.formData();

    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file selected",
        },
        {
          status: 400,
        }
      );
    }

    // Validation

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG and WEBP allowed",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum size is 2MB",
        },
        {
          status: 400,
        }
      );
    }

    // Convert Buffer

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename

    const ext = file.name.split(".").pop();

    const fileName = `profile-${decoded.id}-${Date.now()}.${ext}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "profile"
    );

    // Ensure folder exists

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/profile/${fileName}`;

    // Save to database

    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        profile: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile Photo Uploaded Successfully",
      image: imageUrl,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}