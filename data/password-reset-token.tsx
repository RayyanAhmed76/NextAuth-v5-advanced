import { db } from "@/lib/db";

export const passwordVerificationTokenbyEmail = async (email: string) => {
  try {
    const verificationtoken = await db.passwordresetToken.findFirst({
      where: {
        email,
      },
    });
    return verificationtoken;
  } catch {
    return null;
  }
};

export const passwordVerificationTokenbyToken = async (token: string) => {
  try {
    const verificationtoken = await db.passwordresetToken.findUnique({
      where: {
        token,
      },
    });

    return verificationtoken;
  } catch {
    return null;
  }
};
