import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// Sanitize baseURL (strip any inline comments like # Base URL)
let baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
if (baseURL.includes("#")) {
  baseURL = baseURL.split("#")[0].trim();
}

// Sanitize secret
let secret = process.env.BETTER_AUTH_SECRET || "default_fallback_secret_32_characters_long";
if (secret.includes("#")) {
  secret = secret.split("#")[0].trim();
}

// Sanitize MongoDB URI
let uri = process.env.MONGO_DB_URI || "mongodb://localhost:27017/database";
if (uri.includes("#")) {
  uri = uri.split("#")[0].trim();
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db("loop");

export const auth = betterAuth({
  secret,
  baseURL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  onAPIError: {
    throw: true,
    onError(error) {
      console.error("[BetterAuth API Error]:", error);
    },
  },
});