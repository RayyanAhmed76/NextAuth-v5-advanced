"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";

export const Socials = () => {
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size={"lg"}
        className="w-[50%] cursor-pointer"
        variant={"outline"}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-[50%] cursor-pointer"
        variant={"outline"}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
