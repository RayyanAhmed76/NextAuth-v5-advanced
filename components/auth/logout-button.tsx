"use client";

import { logout } from "@/actions/action";
import { Slot } from "@radix-ui/react-slot";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const Logout = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return <Slot onClick={onClick}>{children}</Slot>;
};
