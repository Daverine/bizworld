import { sql } from "kysely";

export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);
  const modifiedCategory = await readBody(event);

  return await db
    .updateTable("business")
    .set({
      local_groups: sql`array_replace(local_groups, (SELECT el FROM unnest(local_groups) AS el WHERE el->>'id' = ${modifiedCategory.id}), ${JSON.stringify(modifiedCategory)})`,
    })
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .returningAll()
    .executeTakeFirst();
});
