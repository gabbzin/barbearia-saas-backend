import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "prisma";
// import { sendRecoveryEmail } from "./resend/sendRecoveryEmail";

export const auth = betterAuth({
  basePath: "/api/auth",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // requireEmailVerification: true,
    // sendResetPassword: async ({ user, token }) => {
    //   sendRecoveryEmail({
    //     to: [user.email],
    //     token,
    //     userName: user.name,
    //   });
    // },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // emailVerification: {
  //   sendVerificationEmail: async ({ user, token }) => {
  //     await sendVerificationEmail({
  //       to: [user.email],
  //       token,
  //       userName: user.name,
  //     });
  //   },
  //   expiresIn: 60 * 15, // 15 minutes
  // },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      stripeCustomerId: {
        type: "string",
        required: false,
      },
      barberId: {
        type: "string",
        required: false,
      },
    },
  },

  // plugins: [
  //   stripe({
  //     stripeClient,
  //     stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  //     createCustomerOnSignUp: true,
  //     subscription: {
  //       enabled: true,
  //       plans: [
  //         {
  //           name: "FREE",
  //           priceId: "",
  //         },
  //         {
  //           name: "Corte ilimitado",
  //           priceId: "price_1Sf3aPLZmTtv3cllAd2ewhDQ",
  //         },
  //         {
  //           name: "Barba ilimitada",
  //           priceId: "price_1SfJCWLZmTtv3cllEvJ1kLV8",
  //         },
  //         {
  //           name: "Corte + Barba ilimitados",
  //           priceId: "price_1SfJCmLZmTtv3cllXAzpWq1a",
  //         },
  //       ],
  //     },
  //   }),
  // ],
});
