"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";
import { CreateUserSchema } from "@/lib/validations/user";

export async function createUser(values: z.infer<typeof CreateUserSchema>) {
  try {
    const validatedFields = CreateUserSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password, name, role } = validatedFields.data;

    // Check if email already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already exists!" };
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return { success: "User created successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
}
