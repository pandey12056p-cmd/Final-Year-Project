import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

export async function getServerUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "my_super_secret_key_2026"
    ) as SessionUser;

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireRole(allowedRoles: string[]): Promise<SessionUser> {
  const user = await getServerUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
