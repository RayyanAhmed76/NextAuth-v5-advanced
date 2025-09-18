"use server";

import { loginScehma, RegisterScehma } from "@/schema";
import { error } from "console";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getuserbyemail } from "@/data/user";
import { signIn } from "@/auth";
import { default_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof loginScehma>) => {
  try {
    const validatedValues = loginScehma.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid credentials!" };
    }
    const { email, password } = validatedValues.data;

    await signIn("credentials", {
      email,
      password,
      redirectTo: default_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "something went wrong!" };
      }
    }
    throw error;
  }
};

export const register = async (values: z.infer<typeof RegisterScehma>) => {
  const validatedValues = RegisterScehma.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid credentials!" };
  }
  const { email, password, name } = validatedValues.data;

  const hashedpassword = await bcrypt.hash(password, 10);

  const existinguser = await getuserbyemail(email);

  if (existinguser) {
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
