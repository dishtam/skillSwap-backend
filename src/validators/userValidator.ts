import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "Name is requires"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
