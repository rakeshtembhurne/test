"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import type { AuctionType } from "@prisma/client";
import { PointTransactionType } from "@prisma/client";
import moment from "moment-timezone";

import { prisma } from "@/lib/db";
import { updateUserPoints } from "@/lib/point";
import { auctionSchema } from "@/lib/validations/chart";

const TIMEZONE = "Asia/Kolkata";

export type FormData = {
  amount: number;
  auctionType: AuctionType;
  chartId: string;
  expectedResult: number;
};

export async function playChart(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { chartId, amount, auctionType, expectedResult } =
      auctionSchema.parse(data);
    const date = moment().tz(TIMEZONE).startOf("day").toDate();

    await updateUserPoints(
      userId,
      userId,
      amount,
      PointTransactionType.GAMEPLAY,
    );

    await prisma.auction.create({
      data: {
        amount,
        chartId,
        date,
        auctionType,
        expectedResult,
        userId: session.user.id,
      },
    });

    revalidatePath(`/charts/${chartId}/play`);
    return { status: "success", message: "Successfully saved" };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}
