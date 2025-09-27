import { UserRole } from "@prisma/client";
import * as z from "zod";

export const settingScehma = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorenabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
    password: z.optional(z.string().min(6).max(50)),
    newpassword: z.optional(z.string().min(6).max(50)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newpassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newpassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newpassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "password is required",
      path: ["password"],
    }
  );

export const newpasswordschema = z.object({
  password: z
    .string()
    .max(100, { message: "password should be less than 100 character" })
    .trim()
    .min(5, { message: "Minimum length for password is 5" }),
});

export const passwordresetScehma = z.object({
  email: z.string().email({ message: "email is required!" }).trim(),
});

export const loginScehma = z.object({
  email: z.string().email({ message: "email is required!" }).trim(),
  password: z
    .string()
    .max(100, { message: "password should be less than 100 character" })
    .trim()
    .min(5, { message: "Minimum length for password is 5" }),
  code: z.optional(z.string()),
});

export const RegisterScehma = z.object({
  email: z.string().email({ message: "email is required!" }).trim(),
  password: z
    .string()
    .max(100, { message: "password should be less than 100 character" })
    .trim()
    .min(5, { message: "Minimum length for password is 5" }),
  name: z
    .string()
    .min(3, { message: "minimum name should be length of 3" })
    .max(100, { message: "name should be less than 100 characters" })
    .trim(),
});
