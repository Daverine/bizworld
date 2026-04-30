export default defineEventHandler(async (event) => {
  const { slug, checkIn } = getQuery(event);
  const checkInOptions = ["business", "product"]; // Define valid checkIn options

  if (!checkIn || typeof checkIn !== "string" || !checkInOptions.includes(checkIn)) {
    throw createError({ statusCode: 400, message: "Invalid checkIn value." });
  }
  if (!slug || typeof slug !== "string" || !slugRegex.test(slug)) {
    throw createError({
      statusCode: 400,
      message:
        "Slug is required and must be a string that contains lowercase, numbers, and hyphens only.",
    });
  }

  const isUnique = await checkSlugUniqueness(slug, checkIn);

  return { isUnique };
});
