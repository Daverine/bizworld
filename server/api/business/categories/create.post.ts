import { sql } from "kysely";

export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);
  const { name, description, icon, parent_id } = await readBody(event);

  if (!id && !slug)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request.",
      message: "Request query is invalid.",
    });

  const newCategory = {
    id: crypto.randomUUID(),
    name,
    description,
    icon,
    parent_id,
  };

  return await db
    .updateTable("business")
    .set({
      local_groups: sql`array_append(local_groups, ${JSON.stringify(newCategory)})`,
    })
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .returningAll()
    .executeTakeFirst();
});
