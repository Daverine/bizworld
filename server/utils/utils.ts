import sharp from "sharp";

export async function parseMultipartData(event: any) {
  const data = await readMultipartFormData(event);
  const parsedData: Record<string, any> = {};
  data?.forEach((el: any) => {
    if (parsedData[el.name]) parsedData[el.name].push(el);
    else parsedData[el.name] = [el];
  });
  return parsedData;
}
export async function checkSlugUniqueness(slug: string, checkIn: string): Promise<boolean> {
  // If result is null, slug is unique
  return !(await db
    .selectFrom(checkIn === "business" ? "business" : "product")
    .select("slug")
    .where("slug", "=", slug)
    .executeTakeFirst());
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
  return (
    await db
      .selectFrom(checkIn === "business" ? "business" : "product")
      .select("id")
      .where("slug", "=", slug)
      .executeTakeFirst()
  )?.id;
}
export async function optimizeImages(
  input: sharp.SharpInput | sharp.SharpInput[],
  options: {
    width?: number;
    quality?: number;
  },
) {
  return await sharp(input)
    .rotate()
    .resize({ width: options.width || 1200, withoutEnlargement: true })
    .webp({ quality: options.quality || 80 })
    .toBuffer();
}
export async function saveToStorage(data: {
  data: Buffer;
  uploadDir?: string;
  extension?: string;
}) {
  const filename = `${Date.now()}-${Math.floor(Math.random() * 1e6)}${data.extension || ""}`;
  const uploadDir = data.uploadDir ? data.uploadDir : "temp";
  const storageKey = `${uploadDir}/${filename}`;
  const storage = useStorage("uploads");

  await storage.setItemRaw(storageKey, data.data);
  return `/uploads/${storageKey}`;
}
