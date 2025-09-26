"use client";
import { logout } from "@/actions/action";
import { UseCurrentUser } from "@/hooks/use-current-user";
import { useSession, signOut } from "next-auth/react";
import React from "react";

function SettingPage() {
  const user = UseCurrentUser();
  const onclick = () => {
    logout();
  };
  return (
    <div className="bg-white p-10 rounded-xl">
      <button
        onClick={onclick}
        className="px-3 py-4 bg-red-400 rounded-xl cursor-pointer flex- flex-col "
        type="submit"
      >
        signout
      </button>
    </div>
  );
}

export default SettingPage;
