import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

// 데이터베이스 연결 테스트 함수
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log("Database connection successful:", result);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
