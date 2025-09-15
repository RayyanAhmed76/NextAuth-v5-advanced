"use server";

import { loginScehma } from "@/schema";
import { error } from "console";
import * as z from "zod";

export const login = async (values: z.infer<typeof loginScehma>) => {
  const validatedValues = loginScehma.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid credentials!" };
  }
  return { success: "Email sent!" };
};
