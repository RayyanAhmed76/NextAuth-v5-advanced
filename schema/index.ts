import * as z from "zod";

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
