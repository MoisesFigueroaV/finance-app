import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
  //Aplica autenticación de Clerk a todas las rutas de este submódulo
  .use("*", clerkMiddleware())

  //Listar Cuentas
  .get("/", async (c) => {
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
  })

  //Obtener Cuenta en especifica
  .get(
    "/:id",
    //Con zValidator tenemos la revision de los parametros zod de los schemas
    zValidator(
      "param",
      //Recuperamos un objeto desde su ID de formato string y con opcionalidad se encarga en el caso de que el
      //ID este vacio se ingrese igual y se hace una comprobacion manual con la condicional if error 400 de la linea 50
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      //Con este if sabemos si el ID de la cuenta es valido
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      //Con este if vemos si el usuarios esta logueado
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      //Aca tengo un destrunturing desempaqueta con una consulta a la db sobre la cuenta donde obtengo con su arreglo
      //ID de la cuenta, el nombre, desde la cuenta from con la condicion y sea igual a el id de la cuenta, la
      //Autentificacion del usuario de la cuenta.
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
      //Aca vemos si hubo coincidencias
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      //Responde con el objeto de la cuenta encontrada
      return c.json({ data });
    }
  )

  //Crear Cuenta Nueva
  .post(
    "/",
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
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
    }
  )

  //Borrado Multiples
  .post(
    "/bulk-delete",
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
    }
  )

  //Modificar Cuenta
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
    }
  )

  // 6. DELETE /:id: Eliminar una sola cuenta
  .delete();

export default app;
