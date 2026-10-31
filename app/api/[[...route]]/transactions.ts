import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {
  transactions,
  insertTransactionSchema,
  accounts,
  categories
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@clerk/hono";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { subDays, parseISO } from "date-fns";
import { and, desc, eq, gte, lte, inArray } from "drizzle-orm";
import { z } from "zod";

const app = new Hono()
  // GET: Obtener todas las transacciones (con filtros opcionales de fecha y cuenta)
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Rango de fechas por defecto (últimos 30 días si no se especifica)
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from ? parseISO(from) : defaultFrom;
      const endDate = to ? parseISO(to) : defaultTo;

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
  // GET: Obtener una transacción por ID
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
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
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  // POST: Crear una transacción
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que la cuenta pertenezca al usuario autenticado
      const [account] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.id, values.accountId), eq(accounts.userId, auth.userId)));

      if (!account) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  // POST: Creación masiva (Bulk Create para importación CSV)
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que todas las cuentas pertenezcan al usuario
      const accountIds = Array.from(new Set(values.map((v) => v.accountId)));
      const userAccounts = await db
        .select()
        .from(accounts)
        .where(inArray(accounts.id, accountIds));

      const validAccountIds = new Set(userAccounts.map((a) => a.id));
      const filteredValues = values.filter((v) => validAccountIds.has(v.accountId));

      const data = await db
        .insert(transactions)
        .values(
          filteredValues.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  // POST: Eliminación masiva (Bulk Delete)
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(transactions)
        .where(
          and(
            inArray(transactions.id, values.ids),
            eq(
              transactions.accountId,
              db
                .select({ id: accounts.id })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))
            )
          )
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data });
    }
  )
  // PATCH: Actualizar una transacción
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar propiedad de la cuenta
      const [account] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.id, values.accountId), eq(accounts.userId, auth.userId)));

      if (!account) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(transactions)
        .set(values)
        .where(
          and(
            eq(transactions.id, id),
            eq(
              transactions.accountId,
              db
                .select({ id: accounts.id })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))
            )
          )
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  // DELETE: Eliminar una transacción por ID
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, id),
            eq(
              transactions.accountId,
              db
                .select({ id: accounts.id })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))
            )
          )
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
