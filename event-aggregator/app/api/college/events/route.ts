import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const college = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const events = await prisma.event.findMany({
      where: {
        collegeId: college.id,
        ...(status ? { status } : {})
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error("GET College Events Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const college = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      category,
      image,
      description,
      location,
      mode,
      organizer,
      date,
      endDate,
      registrationDeadline,
      maxParticipants,
      prize,
      teamSize,
      status, // DRAFT or PENDING_APPROVAL
      eligibleColleges,
      eligibleCourses,
      eligibleBranches,
      eligibleYears,
      externalStudentsAllowed,
      isPaid,
      registrationFee,
      requiredDocuments,
      termsAndConditions,
      contactDetails,
      officialRegistrationLink,
      certificateAvailable
    } = body;

    // Security Check: Unverified colleges cannot publish or submit for approval
    const requestedStatus = status || "DRAFT";
    if (requestedStatus === "PENDING_APPROVAL" && college.status !== "VERIFIED") {
      return NextResponse.json({
        success: false,
        message: "Unverified colleges cannot submit events for approval. Please wait for admin verification."
      }, { status: 403 });
    }

    // Validation for non-drafts
    if (requestedStatus === "PENDING_APPROVAL") {
      if (!title || !category || !image || !description || !location || !mode || !date || !registrationDeadline) {
        return NextResponse.json({ success: false, message: "Please fill all required fields before submitting." }, { status: 400 });
      }
    } else {
      // For draft, only title is required
      if (!title) {
        return NextResponse.json({ success: false, message: "Event title is required." }, { status: 400 });
      }
    }

    const event = await prisma.event.create({
      data: {
        title,
        category: category || "General",
        image: image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87", // default fallback image
        description: description || "",
        location: location || "",
        mode: mode || "Offline",
        organizer: organizer || college.name,
        date: date ? new Date(date) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : new Date(),
        maxParticipants: Number(maxParticipants) || 100,
        prize: prize || "0",
        teamSize: teamSize || "1",
        status: requestedStatus,
        certificateAvailable: certificateAvailable ?? false,
        collegeId: college.id,
        eligibleColleges: eligibleColleges || null,
        eligibleCourses: eligibleCourses || null,
        eligibleBranches: eligibleBranches || null,
        eligibleYears: eligibleYears || null,
        externalStudentsAllowed: externalStudentsAllowed ?? true,
        isPaid: isPaid ?? false,
        registrationFee: Number(registrationFee) || 0,
        requiredDocuments: requiredDocuments || null,
        termsAndConditions: termsAndConditions || null,
        contactDetails: contactDetails || null,
        officialRegistrationLink: officialRegistrationLink || null,
        submittedAt: requestedStatus === "PENDING_APPROVAL" ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      message: requestedStatus === "PENDING_APPROVAL" ? "Event submitted for admin approval." : "Draft saved successfully.",
      event
    });
  } catch (error: any) {
    console.error("POST College Event Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
