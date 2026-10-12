export default defineEventHandler(async (event) => {
  const { id, slug, action } = getQuery(event);
  const actions = ["visibility", "edit", "config"];
  let {
    hidden,
    category_id,
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
    availability,
    quantity,
    delivery_options,
    promo,
    local_group_id,
  } = await readBody(event);

  if ((!id && !slug) || typeof action !== "string" || !actions.includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request.",
      message: "Request query is invalid.",
    });
  }

  return (await db
    .updateTable("product")
    .set(
      action === "visibility"
        ? { hidden }
        : action === "edit"
          ? {
              base_price,
              base_promo_price,
              category_id,
              details_attachment,
              is_active: true,
              meta: JSON.stringify(meta),
              option_group: JSON.stringify(option_group),
              overview,
              photos,
              shipping: JSON.stringify(shipping),
              specifications: JSON.stringify(specifications),
              sub_option_group: JSON.stringify(sub_option_group),
              video_link,
            }
          : {
              availability,
              quantity,
              delivery_options,
              promo,
              local_group_id,
            },
    )
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .returningAll()
    .executeTakeFirst()) as product | undefined;
});
