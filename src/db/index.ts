import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./schema/auth";
import * as profileSchema from "./schema/profile";

const connectionString = process.env.DATABASE_URL || "";

export const schema = {
  ...authSchema,
  ...profileSchema,
};

const client = neon(connectionString);

export const db = drizzle(client, { schema });
export type Database = typeof db;
