"use client";

import { logout } from "@/actions/action";
import { Slot } from "@radix-ui/react-slot";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const Logout = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    signOut();
  };

  return <Slot onClick={onClick}>{children}</Slot>;
};
