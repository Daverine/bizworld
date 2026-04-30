export default defineEventHandler(async (event) => {
  let { id, slug } = getQuery(event);

  if (!id && !slug) return;
  else if (!id) id = await getIdFromSlug(slug as string, "business");

  return (await db
    .selectFrom("product")
    .selectAll()
    .where("business_id", "=", id as string)
    .execute()) as unknown as product[];
});
