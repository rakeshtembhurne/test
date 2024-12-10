import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
