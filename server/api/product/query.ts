export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);

  if (!id && !slug) return;

  return (await db
    .selectFrom("product")
    .selectAll()
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .executeTakeFirst()) as product | undefined;
});
