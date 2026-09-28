import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Carga las variables de entorno de .env.local
config({ path: ".env.local" });

export default defineConfig({
  schema: ["./db/schema.ts", "./db/categories.ts", "./db/transactions.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
