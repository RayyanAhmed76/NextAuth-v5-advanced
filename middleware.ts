import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  publicRoutes,
  authRoutes,
  apiauthprefix,
  default_LOGIN_REDIRECT,
} from "@/routes";
import { NextURL } from "next/dist/server/web/next-url";
const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const isloggedin = !!req.auth;
  const isapiRoute = nextUrl.pathname.startsWith(apiauthprefix);
  const ispublicroute = publicRoutes.includes(nextUrl.pathname);
  const isauthroute = authRoutes.includes(nextUrl.pathname);

  if (isapiRoute) {
    return null;
  }

  if (isauthroute) {
    if (isloggedin) {
      return Response.redirect(new URL(default_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if (!isloggedin && !ispublicroute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
