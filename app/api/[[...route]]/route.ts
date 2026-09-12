import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app
  .get("/hello", async (c) => {
    const { userId } = await auth();

    if (!userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    return c.json({
      message: "Hello Next.js!",
      userId,
    });
  })
    .get(
      "/hello/:test",
      zValidator("param", z.object({
        test: z.string(),
      })),
      async (c) => {
        const { test } = c.req.valid("param")

        return c.json({
          message: `Hello ${test}!`,
          test: test,
        })
      })

    .post(
      "/",
      zValidator("json", z.object({
        name: z.string(),
        userId: z.number(),
      })),
      zValidator("param", z.object({
        postId: z.number(),
      })),
      (c) => {
        const { name, userId } = c.req.valid("json")
        const { postId } = c.req.valid("param")

        return c.json({
          message: `Hello ${name}!`,
          name: name,
          userId: userId,
          postId: postId,
        })
      })

export const GET = handle(app)
export const POST = handle(app)
