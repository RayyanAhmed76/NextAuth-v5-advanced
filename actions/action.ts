"use server";

import { loginScehma, RegisterScehma } from "@/schema";
import { error } from "console";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getuserbyemail } from "@/data/user";

export const login = async (values: z.infer<typeof loginScehma>) => {
  const validatedValues = loginScehma.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid credentials!" };
  }
  return { success: "Email sent!" };
};

export const register = async (values: z.infer<typeof RegisterScehma>) => {
  const validatedValues = RegisterScehma.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid credentials!" };
  }
  const { email, password, name } = validatedValues.data;

  const hashedpassword = await bcrypt.hash(password, 10);

  const existinguser = await getuserbyemail(email);

  if (!existinguser) {
    return { error: "user already exists!" };
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedpassword,
    },
  });

  return { success: "user created!" };
};
