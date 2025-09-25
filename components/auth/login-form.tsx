"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginScehma } from "@/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { CardWrapper } from "./Card-wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/action";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const Loginform = () => {
  const searchparams = useSearchParams();
  const errorurl =
    searchparams.get("error") === "OAuthAccountNotLinked"
      ? "Error! Already logged In with another provider."
      : "";
  const [showtwofactor, settwofactor] = useState(false);
  const [error, seterror] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");
  const [ispending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginScehma>>({
    resolver: zodResolver(loginScehma),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onsubmit = (values: z.infer<typeof loginScehma>) => {
    seterror("");
    setsuccess("");
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          form.reset();
          seterror(data.error);
        }
        if (data?.success) {
          form.reset();
          setsuccess(data.success);
        }
        if (data?.twofactor) {
          settwofactor(true);
        }
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
          <div className="space-y-4">
            {showtwofactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your code "
                        {...field}
                        disabled={ispending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showtwofactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your mail "
                          {...field}
                          disabled={ispending}
                          type="email"
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
                      <FormLabel>password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={ispending}
                          placeholder="***** "
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size={"sm"}
                        variant={"link"}
                        className="cursor-pointer px-0"
                      >
                        <Link href={"/auth/reset"}>forgot your password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || errorurl} />
          <FormSuccess message={success} />
          <Button disabled={ispending} type="submit" className="w-full">
            {showtwofactor ? "Confirm code" : "login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
