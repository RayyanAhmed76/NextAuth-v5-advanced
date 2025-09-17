import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { loginScehma } from "./schema";
import { getuserbyemail } from "./data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
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
