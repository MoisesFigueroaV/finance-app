import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware } from "@clerk/hono";

import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import Summary from "./summary";

const app = new Hono().basePath("/api");

app.use("*", clerkMiddleware());

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", Summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
