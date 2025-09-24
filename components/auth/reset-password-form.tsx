"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { passwordresetScehma } from "@/schema";
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

import { useState, useTransition } from "react";
import { passwordresetverification } from "@/actions/action";

export const Resetform = () => {
  const [error, seterror] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");
  const [ispending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof passwordresetScehma>>({
    resolver: zodResolver(passwordresetScehma),
    defaultValues: {
      email: "",
    },
  });
  const onsubmit = (values: z.infer<typeof passwordresetScehma>) => {
    seterror("");
    setsuccess("");
    startTransition(() => {
      passwordresetverification(values).then((data) => {
        seterror(data?.error);
        setsuccess(data?.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
          <div className="space-y-4">
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={ispending}
            type="submit"
            className="w-full cursor-pointer"
          >
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
