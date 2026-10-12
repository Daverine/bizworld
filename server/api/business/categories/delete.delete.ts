import { sql } from "kysely";

export default defineEventHandler(async (event) => {
  const { business_id, business_slug, groups_ids } = getQuery(event);

  if ((!business_id && !business_slug) || !groups_ids)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request.",
      message: "Request query is invalid.",
    });

  const ids = (typeof groups_ids === "string" ? [groups_ids] : groups_ids) as string[];

  return (
    await Promise.all(
      ids.map((group_id) =>
        db
          .updateTable("business")
          .set({
            local_groups: sql`array_remove(local_groups, (SELECT el FROM unnest(local_groups) AS el WHERE el->>'id' = ${group_id}))`,
          })
          .where(
            business_id ? "id" : "slug",
            "=",
            (business_id ? business_id : business_slug) as string,
          )
          .returningAll()
          .executeTakeFirst(),
      ),
    )
  ).pop();
});
