import React from "react";
import { CardWrapper } from "./auth/Card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong."
      backButtonHref="/auth/login"
      backButtonLabel="Back to logn"
    >
      <div className="w-full shadow-md flex items-ceter justify-center    ">
        <ExclamationTriangleIcon className="text-destructive  " />
      </div>
    </CardWrapper>
  );
}

export default ErrorCard;
