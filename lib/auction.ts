import { AuctionType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export const getAllAuctions = async () => {
  try {
    return (
      (await prisma.auction.findMany({
        include: { chart: true },
        orderBy: {
          createdAt: "desc",
        },
      })) || []
    );
  } catch {
    return null;
  }
};

export const getAuctionById = async (id: string) => {
  try {
    return await prisma.auction.findUnique({ where: { id } });
  } catch {
    return null;
  }
};

export const getAllAuctionStats = async (type: string | null, date: string) => {
  try {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const whereCondition: Prisma.AuctionWhereInput = {
      ...(type ? { auctionType: type as AuctionType } : {}), // Add auctionType filter only if `type` is provided
      date: date ? new Date(date) : todayMidnight, // Default to today's date at midnight if `date` is not provided
    };

    const auctions = await prisma.auction.findMany({
      where: whereCondition,
      include: {
        chart: {
          select: { title: true },
        },
      },
    });

    // Transform the data into the required format
    const result = auctions.reduce((acc, auction) => {
      const chartName = auction?.chart?.title;
      const expectedResult = auction.expectedResult;

      if (!acc[chartName]) {
        acc[chartName] = {};
      }

      // Assign the sum of "amount" to the corresponding expectedResult
      acc[chartName][expectedResult] =
        (acc[chartName][expectedResult] || 0) + auction.amount;

      return acc;
    }, {});

    // Fill missing expectedResult keys (0 to 9) with `null`
    Object.keys(result).forEach((chartName) => {
      for (let i = 0; i <= 9; i++) {
        if (!(i in result[chartName])) {
          result[chartName][i] = null;
        }
      }
    });

    return result;
  } catch {
    return {};
  }
};

export const getAuctionStatsByDate = async (
  type: string | null,
  date: string,
) => {
  try {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const whereCondition = {
      ...(type ? { auctionType: type } : {}), // Add auctionType filter only if `type` is provided
      date: date ? new Date(date) : todayMidnight, // Default to today's date at midnight if `date` is not provided
    } as Prisma.AuctionWhereInput;

    const auctions = await prisma.auction.findMany({
      where: whereCondition,
      include: {
        chart: {
          select: { title: true },
        },
      },
    });

    // Transform the data into the required format
    const result = auctions.reduce((acc, auction) => {
      const chartName = auction?.chart?.title;
      const auctionType = auction.auctionType;
      const key = `${chartName} - ${auctionType}`;
      const expectedResult = auction.expectedResult;

      if (!acc[key]) {
        acc[key] = {};
      }

      // Assign the sum of "amount" to the corresponding expectedResult
      acc[key][expectedResult] =
        (acc[key][expectedResult] || 0) + auction.amount;

      return acc;
    }, {});

    // Fill missing expectedResult keys (0 to 9) with `null`
    Object.keys(result).forEach((key) => {
      for (let i = 0; i <= 9; i++) {
        if (!(i in result[key])) {
          result[key][i] = null;
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching auction stats:", error);
    return {};
  }
};
