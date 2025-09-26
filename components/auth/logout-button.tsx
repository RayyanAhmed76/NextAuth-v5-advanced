import { logout } from "@/actions/action";
import { signOut } from "next-auth/react";

interface logoutbuttonprops {
  children?: React.ReactNode;
}

export const Logout = ({ children }: logoutbuttonprops) => {
  const onclick = () => {
    signOut();
  };

  return (
    <span className="cursor-pointer" onClick={onclick}>
      {children}
    </span>
  );
};
