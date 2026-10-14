import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";

type SchemaType = typeof schema;
export type DrizzleDb = NeonHttpDatabase<SchemaType>;

let _db: DrizzleDb | null = null;

function getDbClient(): DrizzleDb {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables");
    }
    const sql = neon(connectionString);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop: keyof DrizzleDb) {
    const client = getDbClient();
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export * from "./db/schema";
