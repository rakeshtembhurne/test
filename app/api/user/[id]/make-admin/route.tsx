// Create NextJS API route to change user's role to ADMIN
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  const userRole = currentUser?.role;
  if (!currentUser || userRole !== "ADMIN") {
    return new Response("Invalid user", { status: 401 });
  }

  try {
    const userId = req?.body?.userId;

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
  return new Response("User role updated successfully!", { status: 200 });
});
