import React from "react";
import Navbar from "./_components/navbar";
import { Toaster } from "@/components/ui/sonner";

interface protectedlayoutprops {
  children: React.ReactNode;
}

export default function protectedlayout({ children }: protectedlayoutprops) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-10 bg-zinc-700">
      <Navbar />
      <Toaster />
      {children}
    </div>
  );
}
