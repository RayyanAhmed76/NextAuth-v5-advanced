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
import { generateverficationtoken } from "@/lib/tokens";
import { sendverificationmail } from "@/lib/mail";
import {
  verificationtokenbyemail,
  verificationtokenbytoken,
} from "@/data/verification-token";

export const login = async (values: z.infer<typeof loginScehma>) => {
  try {
    const validatedValues = loginScehma.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid credentials!" };
    }
    const { email, password } = validatedValues.data;
    const existinguser = await getuserbyemail(email);

    if (!existinguser || !existinguser.email || !existinguser.password) {
      return { error: "email does not exsits!" };
    }

    if (!existinguser.emailVerified) {
      const verificationtoken = await generateverficationtoken(
        existinguser.email
      );

      return { success: "Confirmation email sent!" };
    }

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

  const verificationtoken = await generateverficationtoken(email);

  await sendverificationmail(verificationtoken.email, verificationtoken.token);

  return { success: "confirmaion email send!" };
};

export const newVerification = async (token: string) => {
  const exisitingtoken = await verificationtokenbytoken(token);

  if (!exisitingtoken) {
    return { error: "Token does not exist!" };
  }

  const hasexpired = new Date(exisitingtoken.expires) < new Date();

  if (hasexpired) {
    return { error: "token has expired!" };
  }

  const existinguser = await verificationtokenbyemail(exisitingtoken.email);
  if (!existinguser) {
    return { error: "user does not exist!" };
  }

  await db.user.update({
    where: {
      id: existinguser.id,
    },
    data: {
      emailVerified: new Date(),
      email: exisitingtoken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: exisitingtoken.id },
  });

  return { success: "email verified" };
};
