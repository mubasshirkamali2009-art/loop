/**
 * Shared MongoDB connection utility.
 * Re-uses a single MongoClient across hot reloads in dev
 * and across all server-side route handlers.
 */
const dns = require("node:dns");
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch {
  // Ignore in environments where setServers is not supported
}

import { MongoClient, Db } from "mongodb";

function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/\s+#.*$/, "").trim() || undefined;
}

const uri = cleanEnv(process.env.MONGO_DB_URI);
if (!uri) {
  throw new Error("MONGO_DB_URI is not set");
}

const isProd = process.env.NODE_ENV === "production";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;
if (!isProd) {
  global._mongoClient ??= new MongoClient(uri);
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

export const db: Db = client.db("loop");
export { client };
