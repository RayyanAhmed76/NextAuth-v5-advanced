import * as z from "zod";

export const loginScehma = z.object({
  email: z.string().email({ message: "email is required!" }).trim(),
  password: z
    .string()
    .max(100, { message: "password should be less than 100 character" })
    .trim()
    .min(1, { message: "password is required!" }),
});
