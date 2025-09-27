"use client";
import { Currentrole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import React from "react";
import { FormError } from "../form-error";

interface userroleprops {
  children: React.ReactNode;
  isalowed: UserRole;
}

function Userrole({ children, isalowed }: userroleprops) {
  const role = Currentrole();

  if (role !== isalowed) {
    return <FormError message="you are not allowed to see this content" />;
  }
  return <>{children}</>;
}

export default Userrole;
