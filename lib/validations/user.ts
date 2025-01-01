import { UserRole } from "@prisma/client";
import * as z from "zod";

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
});

export const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const CreateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    role: z.enum([UserRole.USER, UserRole.MANAGER], {
      required_error: "Role is required",
    }),
    managerId: z.string().nullable(),
  })
  .refine(
    (data) =>
      data.role !== UserRole.USER ||
      (data.managerId && data.managerId.trim().length > 0),
    {
      message: "Manager is required.",
      path: ["managerId"], // This specifies the field that will receive the error
    },
  );
