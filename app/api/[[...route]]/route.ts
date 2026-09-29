import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "./accounts";

const app = new Hono().basePath("/api");

const routes = app.route("/accounts", accounts);

export const GET = handle(routes);
export const POST = handle(routes);

export type AppType = typeof routes;
