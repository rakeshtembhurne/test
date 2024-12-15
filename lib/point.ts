import { Point, PointTransactionType } from "@prisma/client";

import { prisma } from "@/lib/db";

export const getAllPoints = async () => {
  try {
    return (
      (await prisma.point.findMany({
        orderBy: {
          createdAt: "desc",
        },
      })) || []
    );
  } catch {
    return null;
  }
};

export const getUserPointHistory = async (userId: string) => {
  try {
    return (
      (await prisma.pointHistory.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })) || []
    );
  } catch {
    return [];
  }
};

export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    const points = await prisma.point.findFirst({ where: { userId } });
    return points?.currentPoints || 0;
  } catch (error) {
    return 0;
  }
};

export const getPointById = async (id: string) => {
  try {
    return await prisma.point.findUnique({ where: { id } });
  } catch {
    return null;
  }
};

export const updateUserPoints = async (
  userId: string,
  approverId: string,
  amount: number,
  transactionType: PointTransactionType,
) => {
  let points: Point | null = await prisma.point.findFirst({
    where: { userId },
  });
  if (!points) {
    points = await prisma.point.create({ data: { currentPoints: 0, userId } });
  }
  const newPoints =
    transactionType === PointTransactionType.GAMEPLAY ||
    transactionType === PointTransactionType.WITHDRAW
      ? points.currentPoints - amount
      : points.currentPoints + amount;

  if (newPoints < 0) {
    throw new Error("Insufficient points.");
  }

  return Promise.all([
    prisma.point.update({
      where: { id: points.id },
      data: {
        currentPoints: newPoints,
        userId: userId,
      },
    }),
    prisma.pointHistory.create({
      data: {
        userId,
        previousPoints: points.currentPoints,
        newPoints,
        points: amount,
        approverId,
        transactionType: transactionType,
      },
    }),
  ]);
};
