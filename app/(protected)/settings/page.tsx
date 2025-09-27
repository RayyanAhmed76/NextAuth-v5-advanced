"use client";
import { logout, settings } from "@/actions/action";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseCurrentUser } from "@/hooks/use-current-user";
import { settingScehma } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

function SettingPage() {
  const user = UseCurrentUser();
  const [error, seterror] = useState<string | null>();
  const [success, setsuccess] = useState<string | null>();
  const { update } = useSession();
  const [ispending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof settingScehma>>({
    resolver: zodResolver(settingScehma),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      password: undefined,
      newpassword: undefined,
      isTwoFactorenabled: user?.isTwoFactorenabled || undefined,
    },
  });
  const onsubmit = (values: z.infer<typeof settingScehma>) => {
    startTransition(() => {
      settings({
        ...values,
      }).then((data) => {
        if (data.error) {
          seterror(data.error);
        }
        if (data.success) {
          update();
          setsuccess(data.success);
        }
      });
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Update your name here"
                        disabled={ispending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Update your mail here"
                            disabled={ispending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="password"
                            disabled={ispending}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New-Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="new-password"
                            disabled={ispending}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={ispending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                        <SelectItem value={UserRole.USER}>USER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {user?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="isTwoFactorenabled"
                  render={({ field }) => (
                    <FormItem className="flex justify-between iems-center rounded-lg border p-3 shadow-md">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable Two Factor Authentication For Your Account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={ispending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={ispending} type="submit">
              save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SettingPage;
