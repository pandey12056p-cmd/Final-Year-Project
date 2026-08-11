import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged Out Successfully",
  });

  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response;
}