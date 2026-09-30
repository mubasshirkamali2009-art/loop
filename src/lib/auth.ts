const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

/**
 * Strip inline "# comments" from an env value.
 * Only strips when "#" is preceded by whitespace, so values that legitimately
 * contain "#" (e.g. inside a password) are left untouched.
 */
function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/\s+#.*$/, "").trim() || undefined;
}

const isProd = process.env.NODE_ENV === "production";

const baseURL = cleanEnv(process.env.BETTER_AUTH_URL) ?? "http://localhost:3000";

const secret = cleanEnv(process.env.BETTER_AUTH_SECRET);
if (!secret && isProd) {
  throw new Error("BETTER_AUTH_SECRET is required in production");
}

const uri = cleanEnv(process.env.MONGO_DB_URI);
if (!uri) {
  throw new Error("MONGO_DB_URI is not set");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

// Reuse the client across hot reloads in dev so connections don't pile up.
let client: MongoClient;
if (!isProd) {
  global._mongoClient ??= new MongoClient(uri);
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db("loop");

const googleClientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
const googleClientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  secret: secret ?? "dev_only_secret_change_me_32_chars_min",
  baseURL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
      : {}),
  },
  // No `client` passed => transactions are off, which is what you want on a
  // standalone (non-replica-set) MongoDB.
  database: mongodbAdapter(db),
  onAPIError: {
    // Removed `throw: true` so errors return proper HTTP responses
    // instead of crashing the route handler with a 500.
    onError(error) {
      console.error("[BetterAuth API Error]:", error);
    },
  },
});