import { auth, signOut } from "@/auth";
import React from "react";

async function SettingPage() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button
          className="px-3 py-4 bg-red-400 rounded-xl cursor-pointer "
          type="submit"
        >
          signout
        </button>
      </form>
    </div>
  );
}

export default SettingPage;
