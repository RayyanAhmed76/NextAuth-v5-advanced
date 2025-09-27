"use client";
import { admin } from "@/actions/action";
import Userrole from "@/components/auth/Userrole";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Currentrole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import React from "react";
import { toast } from "sonner";

function AdminRole() {
  const onserveraction = () => {
    admin().then((response) => {
      if (response.error) {
        toast.error(response.error);
      }
      if (response.sucess) {
        toast.success(response.sucess);
      }
    });
  };
  const onapiRoute = () => {
    fetch("/api/admin").then((responce) => {
      if (responce.ok) {
        toast.success("Allowed api route");
      } else {
        toast.error("Forbidden");
      }
    });
  };
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-center font-semibold text-2xl">ADMIN</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Userrole isalowed={UserRole.ADMIN}>
          <FormSuccess message="you are allowed to see this content" />
        </Userrole>
        <div className="flex items-center justify-between shadow-md rounded-lg border p-3">
          <p className="text-sm font-medium">Admin-only API route</p>
          <Button onClick={onapiRoute} className="cursor-pointer">
            Click to test
          </Button>
        </div>
        <div className="flex items-center justify-between shadow-md rounded-lg border p-3">
          <p className="text-sm font-medium">Admin-only server action</p>
          <Button onClick={onserveraction} className="cursor-pointer">
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminRole;
