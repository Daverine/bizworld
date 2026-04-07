export default defineEventHandler(async (event) => {
  const id = getQuery(event)?.id;

  if (!id) return;

  const businessData = await db
    .selectFrom("business")
    .selectAll()
    .where("id", "=", id as string)
    .executeTakeFirst();

  return businessData;
});
