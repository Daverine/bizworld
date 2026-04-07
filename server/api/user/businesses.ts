export default defineEventHandler(async (event) => {
  const id = getQuery(event)?.id;

  if (!id) return;

  const business = await db
    .selectFrom("business")
    .selectAll()
    .where("super_admin", "=", id as string)
    .execute();

  return business;
});
