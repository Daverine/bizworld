export function parseMultipartData(data: any[] | undefined): { [key: string]: any } {
  const parsedData: { [key: string]: any } = {};
  data?.forEach((el: any) => {
    let key = el.name as string;
    let value = el.filename ? { filename: el.filename, data: el.data } : el.data;
    if (parsedData[key] && Array.isArray(parsedData[key])) {
      parsedData[key].push(value);
    } else {
      parsedData[key] = data.filter((item: any) => item.name === key).length > 1 ? [value] : value;
    }
  });
  return parsedData;
}
export async function checkSlugUniqueness(slug: string, checkIn: string): Promise<boolean> {
  let result;

  switch (checkIn) {
    case "business":
      result = await db
        .selectFrom("business")
        .select("slug")
        .where("slug", "=", slug)
        .executeTakeFirst();
      break;
    case "product":
      result = await db
        .selectFrom("product")
        .select("slug")
        .where("slug", "=", slug)
        .executeTakeFirst();
      break;
  }

  return !result; // If result is null, slug is unique
}

export async function uniqueSlugFrom(text: string, checkIn: string, namespace?: string) {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .normalize("NFD") // Normalizes string to decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Removes the accent marks
    .replace(/[^a-z0-9\s-]/g, "") // Removes special characters
    .replace(/[\s-]+/g, "-") // Replaces spaces and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Removes leading and trailing hyphens

  let slug = namespace ? `${baseSlug}.${namespace}` : baseSlug;
  let counter = 1;

  while (true) {
    const isUnique = await checkSlugUniqueness(slug, checkIn);
    if (isUnique) break;
    slug = namespace ? `${baseSlug}${counter++}.${namespace}` : `${baseSlug}${counter++}`;
  }

  return slug;
}
export async function getIdFromSlug(slug: string, checkIn: "business" | "product") {
  let result;

  switch (checkIn) {
    case "business":
      result = await db
        .selectFrom("business")
        .select("id")
        .where("slug", "=", slug)
        .executeTakeFirst();
      break;
    case "product":
      result = await db
        .selectFrom("product")
        .select("id")
        .where("slug", "=", slug)
        .executeTakeFirst();
      break;
  }

  return result?.id;
}
