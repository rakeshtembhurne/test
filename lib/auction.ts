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
