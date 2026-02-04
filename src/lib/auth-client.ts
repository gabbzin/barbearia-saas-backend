import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  // plugins: [
  //   stripeClient({
  //     subscription: true,
  //   }),
  // ],
});

export type Session = typeof auth.$Infer.Session;
