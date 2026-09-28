import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as transactions from "./transactions";
import * as categories from "./categories";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema: { ...schema, ...transactions, ...categories } });
