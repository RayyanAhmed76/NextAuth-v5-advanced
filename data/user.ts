import { db } from "@/lib/db";

export const getuserbyemail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return null;
  }
  return user;
};
export const getuserbyid = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return { error: "user not found!" };
  }
  return user;
};
