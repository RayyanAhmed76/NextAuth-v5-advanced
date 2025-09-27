"use server";

import {
  loginScehma,
  newpasswordschema,
  passwordresetScehma,
  RegisterScehma,
  settingScehma,
} from "@/schema";
import { error } from "console";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getuserbyemail, getuserbyid } from "@/data/user";
import { auth, signIn } from "@/auth";
import { default_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateverficationtoken,
} from "@/lib/tokens";
import {
  sendpasswordresetmail,
  sendtwofactoremail,
  sendverificationmail,
} from "@/lib/mail";
import {
  verificationtokenbyemail,
  verificationtokenbytoken,
} from "@/data/verification-token";
import { passwordVerificationTokenbyToken } from "@/data/password-reset-token";
import {
  getTwoFactorTokenbyemail,
  getTwoFactorTokenbyToken,
} from "@/data/two-factor-token";
import { getTwoFactorConfirmation } from "@/data/two-factor-confirmation";
import { signOut } from "next-auth/react";
import { CurrentUser, CurrentUserRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const login = async (values: z.infer<typeof loginScehma>) => {
  try {
    const validatedValues = loginScehma.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid credentials!" };
    }
    const { email, password, code } = validatedValues.data;
    const existinguser = await getuserbyemail(email);

    if (!existinguser || !existinguser.email || !existinguser.password) {
      return { error: "email does not exsits!" };
    }

    if (!existinguser.emailVerified) {
      const verificationtoken = await generateverficationtoken(
        existinguser.email
      );

      return { success: "confirm email to login!" };
    }

    if (existinguser.isTwoFactorenabled && existinguser.email) {
      if (code) {
        const twofactortoken = await getTwoFactorTokenbyemail(
          existinguser.email
        );

        if (!twofactortoken) {
          return { error: "No code entered!" };
        }
        if (twofactortoken.token !== code) {
          return { error: "Invalid code!" };
        }
        const hasexpired = new Date(twofactortoken.expires) < new Date();

        if (hasexpired) {
          return { error: "code expired!" };
        }

        await db.twoFactorToken.delete({
          where: {
            id: twofactortoken.id,
          },
        });

        const exisitingConfirmation = await getTwoFactorConfirmation(
          existinguser.id
        );

        if (exisitingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: {
              id: exisitingConfirmation.id,
            },
          });
        }

        await db.twoFactorConfirmation.create({
          data: {
            userId: existinguser.id,
          },
        });
      } else {
        const twofactor = await generateTwoFactorToken(existinguser.email);
        await sendtwofactoremail(twofactor.email, twofactor.token);

        return { twofactor: true };
      }
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

export const logout = async () => {
  await signOut();
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
      //id: existinguser.id,
      email: existinguser.email,
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

export const passwordresetverification = async (
  values: z.infer<typeof passwordresetScehma>
) => {
  const validatedvalues = passwordresetScehma.safeParse(values);

  if (!validatedvalues.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedvalues.data;

  const existinguser = await getuserbyemail(email);

  if (!existinguser) {
    return { error: "email not found!" };
  }

  const verificationtoken = await generatePasswordResetToken(email);

  await sendpasswordresetmail(verificationtoken.email, verificationtoken.token);

  return {
    success: "Password reset mail send!",
  };
};

export const newpassword = async (
  values: z.infer<typeof newpasswordschema>,
  token: string | null
) => {
  if (!token) {
    return { error: "token does not exist" };
  }
  const validatedvalues = newpasswordschema.safeParse(values);
  if (!validatedvalues.success) {
    return { error: "invalid password!" };
  }

  const { password } = validatedvalues.data;

  const existingtoken = await passwordVerificationTokenbyToken(token);

  if (!existingtoken) {
    return { error: "token does not exist" };
  }

  const hasexpired = new Date(existingtoken.expires) < new Date();

  if (!hasexpired) {
    return { error: "token has been expired!" };
  }

  const existinguser = await getuserbyemail(existingtoken.email);

  if (!existinguser) {
    return { error: "user does not exist" };
  }

  const hashedpassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      email: existingtoken.email,
    },
    data: {
      password: hashedpassword,
    },
  });

  await db.passwordresetToken.delete({
    where: {
      token: existingtoken.token,
    },
  });

  return {
    success: "Password updated!",
  };
};

export const admin = async () => {
  const role = await CurrentUserRole();

  if (role !== UserRole.ADMIN) {
    return { error: "User not allowed" };
  } else {
    return { sucess: "user allowed!" };
  }
};

export const settings = async (values: z.infer<typeof settingScehma>) => {
  const user = await CurrentUser();

  if (!user) {
    return {
      error: "Unauthorized!",
    };
  }

  const dbuser = await getuserbyid(user.id!);

  if (!dbuser) {
    return { error: "Unauthorized!" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newpassword = undefined;
    values.isTwoFactorenabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existinguser = await getuserbyemail(values.email);
    if (existinguser && existinguser.id !== user.id) {
      return { error: "Email already is use!" };
    }
  }

  const verificationtoken = await generateverficationtoken(values.email!);

  await sendverificationmail(verificationtoken.email, verificationtoken.token);

  if (values.password && values.newpassword && dbuser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbuser.password
    );

    if (!passwordMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedpassword = await bcrypt.hash(values.password, 10);
    values.password = hashedpassword;
    values.newpassword = undefined;
  }

  await db.user.update({
    where: {
      id: dbuser.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "Verification mail sent!" };
};
