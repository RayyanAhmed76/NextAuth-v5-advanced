"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { default_LOGIN_REDIRECT } from "@/routes";

export const Socials = () => {
  const onClick = async (providers: "google" | "github") => {
    await signIn(providers, {
      callbackUrl: default_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size={"lg"}
        className="w-[50%] cursor-pointer"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-[50%] cursor-pointer"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
