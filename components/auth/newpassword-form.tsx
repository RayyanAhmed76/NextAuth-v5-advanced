"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { newpasswordschema } from "@/schema";
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
import { newpassword, passwordresetverification } from "@/actions/action";
import { useSearchParams } from "next/navigation";

export const NewpasswordForm = () => {
  const searchparams = useSearchParams();
  const token = searchparams.get("token");
  const [error, seterror] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");
  const [ispending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof newpasswordschema>>({
    resolver: zodResolver(newpasswordschema),
    defaultValues: {
      password: "",
    },
  });
  const onsubmit = (values: z.infer<typeof newpasswordschema>) => {
    seterror("");
    setsuccess("");
    startTransition(() => {
      newpassword(values, token).then((data) => {
        seterror(data?.error);
        setsuccess(data?.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Enter you new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*****"
                      {...field}
                      disabled={ispending}
                      type="password"
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
            Set password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
