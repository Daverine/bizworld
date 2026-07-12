export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);

  if (!id && !slug)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request.",
      message: "Request query is invalid.",
    });

  const result = await db
    .deleteFrom("product")
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .executeTakeFirst();

  console.log(result);
});
