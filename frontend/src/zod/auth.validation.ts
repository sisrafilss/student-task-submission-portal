import { z } from "zod";

export const loginValidationZodSchema = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Email is required" : "Invalid email input",
    })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Invalid password input",
    })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password cannot exceed 100 characters"),
});

export type LoginValidationInput = z.infer<typeof loginValidationZodSchema>;
