
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
