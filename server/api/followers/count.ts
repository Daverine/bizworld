export default defineEventHandler(async (event) => {
  const id = getQuery(event)?.id;

  if (!id) return;

  const followers = await db
    .selectFrom("follow")
    .select(({ fn }) => fn.countAll().as("count"))
    .where("following_id", "=", id as string)
    .executeTakeFirst();

  return followers?.count;
});
