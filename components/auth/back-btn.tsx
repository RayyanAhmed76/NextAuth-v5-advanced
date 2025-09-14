"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface backbuttonprops {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: backbuttonprops) => {
  return (
    <Button variant={"link"} size={"sm"} className="font-mormal w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
