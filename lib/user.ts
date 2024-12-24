import type { User, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  manager: { select: { name: true } },
  points: { select: { currentPoints: true } },
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        password: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUsersByRole = async (role: UserRole) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: role,
      },
      select: userSelectFields,
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });

    return user;
  } catch {
    return null;
  }
};
