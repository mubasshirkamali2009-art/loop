import { createAuthClient } from "better-auth/react";

// Automatically uses current origin (/api/auth) to avoid "Failed to fetch" port errors
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;