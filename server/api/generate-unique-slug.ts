export default defineEventHandler(async (event) => {
  const { text, checkIn, namespace } = getQuery(event);
  const checkInOptions = ["business", "product"]; // Define valid checkIn options

  if (!checkIn || typeof checkIn !== "string" || !checkInOptions.includes(checkIn)) {
    throw createError({ statusCode: 400, message: "Invalid checkIn value." });
  }
  if (!text || typeof text !== "string") {
    throw createError({
      statusCode: 400,
      message: "Text is required to generate slug.",
    });
  }
  if (namespace && (typeof namespace !== "string" || !slugRegex.test(namespace))) {
    throw createError({
      statusCode: 400,
      message: "Invalid namespace value.",
    });
  }

  const slug = await uniqueSlugFrom(
    text,
    checkIn,
    typeof namespace === "string" ? namespace : undefined,
  );

  return { slug };
});
