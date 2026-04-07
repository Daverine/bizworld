export default defineEventHandler(async (event) => {
  const id = getQuery(event)?.id;

  if (!id) return;

  const following = await db
    .selectFrom("follow")
    .select(({ fn }) => fn.countAll().as("count"))
    .where("follower_id", "=", id as string)
    .executeTakeFirst();

  return following?.count;
});
