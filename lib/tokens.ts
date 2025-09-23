import { verificationtokenbyemail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

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
