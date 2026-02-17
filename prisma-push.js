#!/usr/bin/env node
import "dotenv/config";
import { execSync } from "child_process";

try {
  const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/imsakia?schema=public";
  console.log(`Using DATABASE_URL: ${dbUrl.replace(/:([^@]+)@/, ":***@")}`);
  
  process.env.DATABASE_URL = dbUrl;
  execSync("npx prisma db push", { stdio: "inherit" });
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
