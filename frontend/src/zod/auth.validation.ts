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

export const registerValidationZodSchema = z
  .object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "Full name is required" : "Invalid name input",
      })
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters long")
      .max(50, "Full name cannot exceed 50 characters"),
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
    confirmPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Confirm password is required"
            : "Invalid confirm password input",
      })
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterValidationInput = z.infer<typeof registerValidationZodSchema>;
