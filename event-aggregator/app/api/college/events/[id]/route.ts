import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const eventId = Number(id);

    const college = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College profile not found" }, { status: 404 });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, collegeId: college.id }
    });

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("GET Single Event Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const eventId = Number(id);

    const college = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College profile not found" }, { status: 404 });
    }

    // Find existing event
    const existingEvent = await prisma.event.findFirst({
      where: { id: eventId, collegeId: college.id }
    });

    if (!existingEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
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
      status, // requested status, e.g. DRAFT or PENDING_APPROVAL
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
    const requestedStatus = status || existingEvent.status;
    if (requestedStatus === "PENDING_APPROVAL" && college.status !== "VERIFIED") {
      return NextResponse.json({
        success: false,
        message: "Unverified colleges cannot submit events for approval. Please wait for verification."
      }, { status: 403 });
    }

    let finalStatus = requestedStatus;
    let requiresReapproval = false;

    // Critical Security Check: If already approved, check for critical changes
    const isApproved = existingEvent.status === "APPROVED" || existingEvent.status === "Upcoming" || existingEvent.status === "Ongoing";
    
    if (isApproved && requestedStatus !== "CANCELLED" && requestedStatus !== "DRAFT") {
      // Helper to check datetime equality
      const dateEqual = (d1: string | Date | null | undefined, d2: string | Date | null | undefined) => {
        if (!d1 && !d2) return true;
        if (!d1 || !d2) return false;
        return new Date(d1).getTime() === new Date(d2).getTime();
      };

      // Compare fields
      const hasCriticalChanges =
        title !== existingEvent.title ||
        !dateEqual(date, existingEvent.date) ||
        !dateEqual(endDate, existingEvent.endDate) ||
        location !== existingEvent.location ||
        (isPaid ?? false) !== existingEvent.isPaid ||
        (Number(registrationFee) || 0) !== existingEvent.registrationFee ||
        officialRegistrationLink !== existingEvent.officialRegistrationLink ||
        eligibleColleges !== existingEvent.eligibleColleges ||
        eligibleCourses !== existingEvent.eligibleCourses ||
        eligibleBranches !== existingEvent.eligibleBranches ||
        eligibleYears !== existingEvent.eligibleYears ||
        organizer !== existingEvent.organizer;

      if (hasCriticalChanges) {
        requiresReapproval = true;
        finalStatus = "PENDING_APPROVAL";
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title ?? existingEvent.title,
        category: category ?? existingEvent.category,
        image: image ?? existingEvent.image,
        description: description ?? existingEvent.description,
        location: location ?? existingEvent.location,
        mode: mode ?? existingEvent.mode,
        organizer: organizer ?? existingEvent.organizer,
        date: date ? new Date(date) : existingEvent.date,
        endDate: endDate ? new Date(endDate) : existingEvent.endDate,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : existingEvent.registrationDeadline,
        maxParticipants: maxParticipants !== undefined ? Number(maxParticipants) : existingEvent.maxParticipants,
        prize: prize ?? existingEvent.prize,
        teamSize: teamSize ?? existingEvent.teamSize,
        status: finalStatus,
        certificateAvailable: certificateAvailable ?? existingEvent.certificateAvailable,
        eligibleColleges: eligibleColleges ?? existingEvent.eligibleColleges,
        eligibleCourses: eligibleCourses ?? existingEvent.eligibleCourses,
        eligibleBranches: eligibleBranches ?? existingEvent.eligibleBranches,
        eligibleYears: eligibleYears ?? existingEvent.eligibleYears,
        externalStudentsAllowed: externalStudentsAllowed ?? existingEvent.externalStudentsAllowed,
        isPaid: isPaid ?? existingEvent.isPaid,
        registrationFee: registrationFee !== undefined ? Number(registrationFee) : existingEvent.registrationFee,
        requiredDocuments: requiredDocuments ?? existingEvent.requiredDocuments,
        termsAndConditions: termsAndConditions ?? existingEvent.termsAndConditions,
        contactDetails: contactDetails ?? existingEvent.contactDetails,
        officialRegistrationLink: officialRegistrationLink ?? existingEvent.officialRegistrationLink,
        
        // Reset audit details if re-approval is triggered
        ...(requiresReapproval ? {
          submittedAt: new Date(),
          approvedAt: null,
          approvedBy: null,
          reviewReason: null
        } : {}),
        
        // Update submittedAt if submitting for first time
        ...(requestedStatus === "PENDING_APPROVAL" && existingEvent.status !== "PENDING_APPROVAL" ? {
          submittedAt: new Date()
        } : {})
      }
    });

    return NextResponse.json({
      success: true,
      message: requiresReapproval
        ? "Event updated. Critical changes require admin re-approval before they are published."
        : "Event updated successfully.",
      event: updatedEvent,
      requiresReapproval
    });
  } catch (error: any) {
    console.error("PUT College Event Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "college") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const eventId = Number(id);

    const college = await prisma.college.findUnique({
      where: { userId: user.id }
    });

    if (!college) {
      return NextResponse.json({ success: false, message: "College profile not found" }, { status: 404 });
    }

    const existingEvent = await prisma.event.findFirst({
      where: { id: eventId, collegeId: college.id }
    });

    if (!existingEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    // Cancel published events instead of physical deletion
    const isPublished = ["APPROVED", "Upcoming", "Ongoing", "Completed"].includes(existingEvent.status);

    if (isPublished) {
      const updated = await prisma.event.update({
        where: { id: eventId },
        data: { status: "CANCELLED" }
      });

      // Send notifications to registered students
      const registrations = await prisma.registration.findMany({
        where: { eventId }
      });
      
      const studentEmails = registrations.map(r => r.email);
      const students = await prisma.user.findMany({
        where: { email: { in: studentEmails } }
      });

      if (students.length > 0) {
        await prisma.notification.createMany({
          data: students.map(s => ({
            userId: s.id,
            title: `Event Cancelled: ${existingEvent.title}`,
            message: `We regret to inform you that the event "${existingEvent.title}" organized by ${existingEvent.organizer} has been cancelled.`,
            type: "alert",
            eventId
          }))
        });
      }

      return NextResponse.json({
        success: true,
        message: "Event status set to CANCELLED and registered students notified.",
        event: updated
      });
    }

    // For drafts or pending approval events, delete them permanently
    await prisma.event.delete({
      where: { id: eventId }
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted permanently."
    });
  } catch (error: any) {
    console.error("DELETE College Event Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
