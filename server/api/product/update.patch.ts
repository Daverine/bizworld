import { product } from "~~/shared/utils/types";

export default defineEventHandler(async (event) => {
  const { id, slug, action } = getQuery(event);
  const actions = ["visibility", "edit", "config"];
  let {
    hidden,
    category,
    new_category,
    photos,
    video_link,
    base_price,
    base_promo_price,
    option_group,
    sub_option_group,
    specifications,
    overview,
    details_attachment,
    availability,
    quantity,
    delivery_options,
    promo,
    location,
  } = await readBody(event);

  category = category === "others" && new_category ? `others:${new_category}` : category;

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
              category,
              details_attachment,
              is_active: true,
              location,
              option_group: JSON.stringify(option_group),
              overview,
              photos,
              specifications: JSON.stringify(specifications),
              sub_option_group: JSON.stringify(sub_option_group),
              video_link,
            }
          : {
              availability,
              quantity,
              delivery_options,
              promo,
            },
    )
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .returningAll()
    .executeTakeFirst()) as product | undefined;
});
