"use server";
import { headers } from "next/headers";

import { redirect } from "next/navigation";
import { auth } from "../auth";

export const signInSocial = async (provider: "github" | "google" | "facebook") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/admin/dashboard",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  redirect("/login");
};