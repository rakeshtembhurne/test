import { AuctionType } from "@prisma/client";
import * as z from "zod";

export const auctionSchema = z.object({
  amount: z.coerce.number().min(10),
  auctionType: z.nativeEnum(AuctionType),
  chartId: z.string(),
});
