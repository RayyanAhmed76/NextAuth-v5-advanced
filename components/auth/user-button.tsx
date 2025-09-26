"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseCurrentUser } from "@/hooks/use-current-user";
import { LogOut } from "lucide-react";
import { Logout } from "./logout-button";

export const Userbutton = () => {
  const user = UseCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-zinc-700">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <Logout>
          <DropdownMenuItem className="cursor-pointer">
            <ExitIcon className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </Logout>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
