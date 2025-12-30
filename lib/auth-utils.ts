"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { authClient } from "@/lib/auth-client";

const ADMIN_EMAIL = "samkam9945@gmail.com"; 




export const authSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session; // can be null
};

export const requireAdmin = async () => {
  const session = await authSession();

  if (!session) {
    redirect("/"); // not logged in
  }

  if (session.user.email !== ADMIN_EMAIL) {
    redirect("/"); // logged in but not admin
  }

  return session;
};



export const requireAuth = async () => {
  const session = await authSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};

export const requireNoAuth = async () => {
  const session = await authSession();

  if (session) {
    redirect("/");
  }
};


export async function logoutAction() {
  await authClient.signOut();
  redirect("/sign-in");
}

// export const authSession = async () => {
//   try {
//     const session = auth.api.getSession({ headers: await headers() });

//     if (!session) {
//       throw new Error("Unauthorized: No valid session found");
//     }
//     return session;
//   } catch (err) {
//     console.error({ err });
//     throw new Error("Authentication failed");
//   }
// };
