"use client";

import { BeatLoader } from "react-spinners";

import { CardWrapper } from "./Card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/action";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewverificatonForm = () => {
  const [error, seterror] = useState<string | undefined>();
  const [success, setsuccess] = useState<string | undefined>();
  const searchparams = useSearchParams();
  const token = searchparams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      seterror("Missing token");
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data.success) {
          setsuccess(data.success);
        }
        if (data.error) {
          seterror(data.error);
        }
      })
      .catch((error) => {
        seterror(
          error instanceof Error ? error.message : "Something went wrong!"
        );
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className="flex items-center w-full justify-center">
      <CardWrapper
        backButtonHref="/auth/login"
        backButtonLabel="back to login"
        headerLabel="confirming your email"
      >
        {!success && !error && <BeatLoader className="text-center mb-3" />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </CardWrapper>
    </div>
  );
};
