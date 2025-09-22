import { db } from "@/lib/db";

export const verificationtokenbytoken = async (token: string) => {
  try {
    const verificationtoken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return verificationtoken;
  } catch {
    return null;
  }
};

export const verificationtokenbyemail = async (email: string) => {
  const verificationtoken = await db.verificationToken.findFirst({
    where: {
      email,
    },
  });
  return verificationtoken;
};
