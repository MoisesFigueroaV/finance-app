import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@clerk/hono";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
  // Aplica autenticación de Clerk a todas las rutas de este submódulo
  .use("*", clerkMiddleware())

  // 1. Listar Cuentas
  .get("/", async (c) => {
    try {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      console.error("[GET_ACCOUNTS_ERROR]:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })

  // 2. Obtener Cuenta específica
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      try {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
          return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db
          .select({
            id: accounts.id,
            name: accounts.name,
          })
          .from(accounts)
          .where(
            and(
              eq(accounts.userId, auth.userId),
              eq(accounts.id, id)
            )
          );

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("[GET_ACCOUNT_SINGLE_ERROR]:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  // 3. Crear Cuenta Nueva
  .post(
    "/",
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      try {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if (!auth?.userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db
          .insert(accounts)
          .values({
            id: createId(),
            userId: auth.userId,
            ...values,
          })
          .returning();

        return c.json({ data });
      } catch (error) {
        console.error("[CREATE_ACCOUNT_ERROR]:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  // 4. Borrado Múltiple
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      try {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if (!auth?.userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const data = await db
          .delete(accounts)
          .where(
            and(
              eq(accounts.userId, auth.userId),
              inArray(accounts.id, values.ids)
            )
          )
          .returning({
            id: accounts.id,
          });

        return c.json({ data });
      } catch (error) {
        console.error("[BULK_DELETE_ACCOUNTS_ERROR]:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  // 5. Modificar Cuenta
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      try {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        if (!id) {
          return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db
          .update(accounts)
          .set(values)
          .where(
            and(
              eq(accounts.userId, auth.userId),
              eq(accounts.id, id)
            )
          )
          .returning();

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("[PATCH_ACCOUNT_ERROR]:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  // 6. Eliminar una sola cuenta
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      try {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
          return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db
          .delete(accounts)
          .where(
            and(
              eq(accounts.userId, auth.userId),
              eq(accounts.id, id)
            )
          )
          .returning({
            id: accounts.id,
          });

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("[DELETE_ACCOUNT_ERROR]:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  );

export default app;
