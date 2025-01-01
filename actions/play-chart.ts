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

    // Close before 15 minutes of the chart startTime
    const chart = await prisma.chart.findUnique({
      where: { id: chartId },
      select: { id: true, startTime: true, endTime: true },
    });
    if (!chart) {
      return {
        status: "error",
        message: "Chart not found",
      };
    }
    // Adjust startTime and endTime for today's date
    const today = new Date();
    const startTime = new Date(
      today.setHours(
        chart?.startTime?.getHours() as number,
        chart?.startTime?.getMinutes(),
        0,
        0,
      ),
    );
    const endTime = new Date(
      today.setHours(
        chart?.endTime?.getHours() as number,
        chart?.endTime?.getMinutes(),
        0,
        0,
      ),
    );

    const currentTime = new Date();
    const targetTime = auctionType.includes("OPEN") ? startTime : endTime;
    targetTime.setMinutes(targetTime.getMinutes() - 15);

    // const currentTimeFormatted = moment(currentTime).format("hh:mm A"); // AM/PM format
    // const targetTimeFormatted = moment(targetTime).format("hh:mm A"); // AM/PM format
    // console.log(
    //   `Current Time: ${currentTimeFormatted}, Target Time: ${targetTimeFormatted}, Time Difference: ${targetTime - currentTime} ms`,
    // );

    // Check if the current time is before T minus 15 minutes of start or end time
    if (currentTime > targetTime) {
      return {
        status: "error",
        message: "Time is before 15 minutes of the chart start/end time",
      };
    }

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
