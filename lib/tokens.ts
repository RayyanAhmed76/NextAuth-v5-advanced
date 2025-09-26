import { verificationtokenbyemail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { passwordVerificationTokenbyEmail } from "@/data/password-reset-token";
import crypto from "crypto";
import { getTwoFactorTokenbyemail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const exisitingtoken = await getTwoFactorTokenbyemail(email);

  if (exisitingtoken) {
    await db.twoFactorToken.delete({
      where: {
        id: exisitingtoken.id,
      },
    });
  }

  const twofactortoken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twofactortoken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingtoken = await passwordVerificationTokenbyEmail(email);

  if (existingtoken) {
    await db.passwordresetToken.delete({
      where: {
        id: existingtoken.id,
      },
    });
  }

  const verificationtoken = await db.passwordresetToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return verificationtoken;
};

export const generateverficationtoken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingtoken = await verificationtokenbyemail(email);

  if (existingtoken) {
    await db.verificationToken.delete({
      where: {
        id: existingtoken.id,
      },
    });
  }

  const verificationtoken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationtoken;
};
