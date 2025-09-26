import { auth } from "@/auth";
import { Userinfo } from "@/components/user-info";
import { CurrentUser } from "@/lib/auth";
import React from "react";

async function Serverpage() {
  const user = await CurrentUser();
  return <Userinfo label="Server component" user={user} />;
}

export default Serverpage;
