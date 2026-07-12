export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);

  if (!id && !slug)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request.",
      message: "Request query is invalid.",
    });

  return (await db
    .selectFrom("business")
    .selectAll()
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .executeTakeFirst()) as bizData | undefined;
});
