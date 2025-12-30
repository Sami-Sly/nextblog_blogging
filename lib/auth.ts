import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
    },
  },

  plugins: [nextCookies()],

callbacks: {
  async signIn({
    user,
    account,
    profile,
  }: {
    user: {
      id: string;
      name?: string | null;
      image?: string | null;
    };
    account?: {
      provider?: string;
    };
    profile?: {
      name?: string;
      picture?: string;
    };
  }) {
    if (account?.provider === "google" && profile) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
      name: profile.name ?? user.name ?? undefined, 
    image: profile.picture ?? user.image ?? undefined,
        },
      });
    }

    return true;
  },
},
});
