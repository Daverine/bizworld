export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) return;

  return await db
    .selectFrom("business")
    .selectAll()
    .where("super_admin", "=", id as string)
    .execute();
});
