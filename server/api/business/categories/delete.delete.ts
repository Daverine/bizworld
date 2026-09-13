import { sql } from "kysely";

export default defineEventHandler(async (event) => {
  const { business_id, business_slug, group_id } = getQuery(event);

  return await db
    .updateTable("business")
    .set({
      local_groups: sql`array_remove(local_groups, (SELECT el FROM unnest(local_groups) AS el WHERE el->>'id' = ${group_id}))`,
    })
    .where(business_id ? "id" : "slug", "=", (business_id ? business_id : business_slug) as string)
    .returningAll()
    .executeTakeFirst();
});
