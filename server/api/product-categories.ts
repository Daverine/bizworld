export default defineEventHandler(async () => {
  return await db.selectFrom("product_categories").selectAll().execute();
});
