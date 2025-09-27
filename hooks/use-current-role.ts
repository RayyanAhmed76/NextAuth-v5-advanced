"use client";

import { useSession } from "next-auth/react";

export const Currentrole = () => {
  const session = useSession();

  return session?.data?.user.role;
};
