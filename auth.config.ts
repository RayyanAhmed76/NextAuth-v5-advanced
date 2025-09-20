import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { loginScehma } from "./schema";
import { getuserbyemail } from "./data/user";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginScehma.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getuserbyemail(email);

          if (!user || !user.password) return null;

          const matchedpassword = await bcrypt.compare(password, user.password);
          if (matchedpassword) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
