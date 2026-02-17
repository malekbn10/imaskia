import * as dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Charger les variables d'environnement depuis .env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5433/imsakia?schema=public",
  },
});
