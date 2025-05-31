import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Name is required").trim(),
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .trim()
    .optional(),
  email: z.string().email("Invalid email").trim().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof userUpdateSchema>;
