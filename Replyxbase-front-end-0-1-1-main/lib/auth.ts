import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { polar } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import prisma from "./prisma";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: process.env.NODE_ENV === "development" ? "sandbox" : "production", 
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        // TODO: Implement email sending
        console.log("Invitation email:", data);
      },
    }),
    ...(process.env.POLAR_ACCESS_TOKEN
      ? [
          polar({
            client: polarClient,
            use: [], // Fix for "cannot read properties of undefined (reading 'map')"
          }),
        ]
      : []),
  ],
});
