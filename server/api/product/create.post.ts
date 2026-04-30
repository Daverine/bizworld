export default defineEventHandler(async (event) => {
  let {
    business_slug,
    category,
    new_category,
    title,
    photos,
    video_link,
    base_price,
    option_group,
    sub_option_group,
    specifications,
    overview,
    details_attachment,
  } = await readBody(event);

  // Generate unique ID and slug
  const slug = await uniqueSlugFrom(title, "product");
  const business_id = await getIdFromSlug(business_slug, "business");
  category = category === "others" && new_category ? `others:${new_category}` : category;

  const newProduct = await db
    .insertInto("product")
    .values({
      base_price,
      business_id: business_id!,
      category,
      details_attachment,
      is_active: true,
      option_group: JSON.stringify(option_group),
      overview,
      photos,
      slug,
      specifications: JSON.stringify(specifications),
      sub_option_group: JSON.stringify(sub_option_group),
      title,
      video_link,
    })
    .returningAll()
    .executeTakeFirst();

  return newProduct;
});
