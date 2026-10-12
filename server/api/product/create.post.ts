export default defineEventHandler(async (event) => {
  let {
    business_slug,
    category_id,
    title,
    photos,
    video_link,
    base_price,
    base_promo_price,
    option_group,
    sub_option_group,
    specifications,
    overview,
    details_attachment,
    shipping,
    meta,
  } = await readBody(event);

  // Generate unique ID and slug
  const slug = await uniqueSlugFrom(title, "product");
  const business_id = await getIdFromSlug(business_slug, "business");
  // create a meta object for product and store new_category value in it
  // also push the new_category with this product Id to a categoryReview Table
  // for bizworld review of the suggested new_category.
  // category = category === "others" && new_category ? `others:${new_category}` : category;

  const newProduct = await db
    .insertInto("product")
    .values({
      availability: "available",
      base_price,
      base_promo_price,
      business_id: business_id!,
      category_id: parseInt(category_id),
      details_attachment,
      is_active: true,
      meta: JSON.stringify(meta),
      option_group: JSON.stringify(option_group),
      overview,
      photos,
      shipping: JSON.stringify(shipping),
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
