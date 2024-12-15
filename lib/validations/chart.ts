import { AuctionType } from "@prisma/client";
import * as z from "zod";

export const auctionSchema = z.object({
  amount: z.coerce.number().min(10),
  auctionType: z.nativeEnum(AuctionType),
  chartId: z.string(),
  expectedResult: z
    .preprocess((value) => {
      if (value === "" || value === null || value === undefined) {
        return NaN; // Treat empty strings, null, or undefined as invalid
      }
      return Number(value); // Coerce to number
    }, z.number().min(0).max(9)) // Validate as a number within range
    .refine((num) => !isNaN(num), {
      message: "Expected result must be a number between 0 and 9",
    }),
});
