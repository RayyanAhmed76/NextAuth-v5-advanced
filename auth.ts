import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "./auth.config";
import { jwt } from "zod";
import { getuserbyemail, getuserbyid } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmation } from "./data/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      if (!user.id) {
        return false;
      }

      const exisitinguser = await getuserbyid(user.id);

      if (!exisitinguser?.emailVerified) {
        return false;
      }

      if (exisitinguser.isTwoFactorenabled) {
        const twofactorconfirmation = await getTwoFactorConfirmation(
          exisitinguser.id
        );

        if (!twofactorconfirmation) {
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: {
            id: twofactorconfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorenabled = token.isTwoFactorenabled as boolean;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return null;

      const existinguser = await getuserbyid(token.sub);

      if (!existinguser) return token;

      token.isTwoFactorenabled = existinguser.isTwoFactorenabled;

      token.role = existinguser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
