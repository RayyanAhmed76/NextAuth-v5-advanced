import React from "react";
import { db } from "@/lib/db";

function Authlayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-zinc-600">
      {children}
    </div>
  );
}

export default Authlayout;
