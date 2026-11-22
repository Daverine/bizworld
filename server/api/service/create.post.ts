export default defineEventHandler(async (event) => {
  let {
    business_slug,
    title,
    pictures,
    video_link,
    price,
    price_avail,
    description,
    duration,
    specifications,
    packages,
    bookable,
    location,
    home_service,
  } = await readBody(event);

  // Generate unique ID and slug
  const slug = await uniqueSlugFrom(title, "service");
  const business_id = await getIdFromSlug(business_slug, "business");

  const newService = await db
    .insertInto("service")
    .values({
      bookable,
      business_id: business_id!,
      description,
      duration,
      home_service,
      is_active: true,
      location: JSON.stringify(location),
      packages: JSON.stringify(packages),
      pictures,
      price,
      price_avail,
      slug,
      specifications: JSON.stringify(specifications),
      title,
      video_link,
    })
    .returningAll()
    .executeTakeFirst();

  return newService;
});
