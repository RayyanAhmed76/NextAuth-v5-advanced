import { db } from "@/lib/db";

export const getTwoFactorConfirmation = async (userId: string) => {
  try {
    const twoFactorConfirmationToken =
      await db.twoFactorConfirmation.findUnique({
        where: {
          userId,
        },
      });
    return twoFactorConfirmationToken;
  } catch {
    return null;
  }
};
