import { sql } from "kysely";

export default defineEventHandler(async (event) => {
  // 1. Get the search term from the URL (e.g., /api/search?q=shoes)
  const { q } = getQuery(event);

  if (!q) {
    return [];
  }

  const tsQuery = sql`websearch_to_tsquery('english', ${q})`;

  return (await db
    .selectFrom("product")
    .selectAll()
    .where(sql`search_vector`, "@@", tsQuery)
    .orderBy(sql`ts_rank(search_vector, ${tsQuery})`, "desc")
    .limit(20)
    .execute()) as unknown as product[];
});
