import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@clerk/nextjs/server";

const app = new Hono().basePath("/api");

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
    zValidator(
      "param",
      z.object({
        test: z.string(),
      })
    ),
    async (c) => {
      const { userId } = await auth();

      if (!userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const { test } = c.req.valid("param");

      return c.json({
        message: `Hello ${test}!`,
        test,
        userId,
      });
    }
  )

  .post(
    "/posts/:postId",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        userId: z.number(),
      })
    ),
    zValidator(
      "param",
      z.object({
        postId: z.string(),
      })
    ),
    async (c) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const { name, userId } = c.req.valid("json");
      const { postId } = c.req.valid("param");

      return c.json({
        message: `Hello ${name}!`,
        name,
        userId,
        postId,
        clerkUserId,
      });
    }
  );

export const GET = handle(app);
export const POST = handle(app);
