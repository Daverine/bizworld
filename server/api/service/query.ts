export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);

  if (!id && !slug)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request.",
      message: "Request query is invalid.",
    });

  const service = await db
    .selectFrom("service")
    .selectAll()
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .executeTakeFirst();

  if (!service)
    throw createError({
      statusCode: 404,
      statusMessage: "Not found.",
      message: "Service not found.",
    });

  return service;
});
