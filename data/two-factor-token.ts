import { db } from "@/lib/db";

export const getTwoFactorTokenbyToken = async (token: string) => {
  try {
    const twoFactortoken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });
    return twoFactortoken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenbyemail = async (email: string) => {
  try {
    const twoFactortoken = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });
    return twoFactortoken;
  } catch {
    return null;
  }
};
