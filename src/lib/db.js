import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || "";

/**
 * Neon SQL client instance.
 * Executes queries safely with parameterized tagged template literals.
 * If DATABASE_URL is not configured yet, returns null or fallback handler.
 */
export const sql = connectionString ? neon(connectionString) : null;

/**
 * Helper function to run queries with error handling and connection verification.
 */
export async function query(strings, ...values) {
  if (!sql) {
    console.warn("DATABASE_URL is not set. Running in memory / offline mode.");
    return [];
  }
  try {
    return await sql(strings, ...values);
  } catch (error) {
    console.error("Neon Database Query Error:", error);
    throw error;
  }
}
