export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);

  if (!id && !slug) return;
  console.log(id, slug);
  const result = await db
    .deleteFrom("product")
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .executeTakeFirst();

  console.log(result);
});
