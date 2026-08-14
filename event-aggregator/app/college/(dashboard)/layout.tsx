import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CollegeLayoutClient from "./CollegeLayoutClient";

export default async function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/college/login");
  }

  if (user.role !== "college") {
    redirect("/college/login");
  }

  // Check if college profile exists
  const college = await prisma.college.findUnique({
    where: { userId: user.id },
  });

  if (!college) {
    redirect("/college/register");
  }

  return (
    <CollegeLayoutClient college={college} user={user}>
      {children}
    </CollegeLayoutClient>
  );
}
