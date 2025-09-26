"use client";
import { Userinfo } from "@/components/user-info";
import { UseCurrentUser } from "@/hooks/use-current-user";
import { CurrentUser } from "@/lib/auth";
import React from "react";

function Serverpage() {
  const user = UseCurrentUser();
  return <Userinfo label="Client component" user={user} />;
}

export default Serverpage;
