import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
const ADMIN_EMAIL = "samikamran9945@gmail.com"; 
export const authSession = async () => {
  try {
    const session = auth.api.getSession({ headers: await headers() });

    if (!session) {
      throw new Error("Unauthorized: No valid session found");
    }
    return session;
  } catch (err) {
    console.error({ err });
    throw new Error("Authentication failed");
  }
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




// // lib/auth-utils.ts
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { auth } from "./auth";

// const ADMIN_EMAIL = "admin@example.com"; // your allowed email

// export const authSession = async () => {
//   try {
//     const session = await auth.api.getSession({ headers: await headers() });

//     if (!session) {
//       throw new Error("Unauthorized: No valid session found");
//     }

//     return session;
//   } catch (err) {
//     console.error({ err });
//     throw new Error("Authentication failed");
//   }
// };

// // normal auth, redirects if no session
// export const requireAuth = async () => {
//   const session = await authSession();
//   if (!session) redirect("/sign-in");
//   return session;
// };

// // only admin email allowed
// export const requireAdmin = async () => {
//   const session = await authSession();

//   if (!session || session.user.email !== ADMIN_EMAIL) {
//     redirect("/"); // or show a forbidden page
//   }

//   return session;
// };

// // only for pages where logged-in users should not access
// export const requireNoAuth = async () => {
//   const session = await authSession();
//   if (session) redirect("/");
// };
