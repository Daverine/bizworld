export default defineEventHandler(async (event) => {
  const { id, slug } = getQuery(event);
  let {
    set,
    category,
    new_category,
    photos,
    video_link,
    base_price,
    option_group,
    sub_option_group,
    specifications,
    overview,
    details_attachment,
  } = await readBody(event);

  category = category === "others" && new_category ? `others:${new_category}` : category;

  if (!id && !slug) return;

  await db
    .updateTable("product")
    .set(
      set
        ? { hidden: set.hidden }
        : {
            base_price,
            category,
            details_attachment,
            is_active: true,
            option_group: JSON.stringify(option_group),
            overview,
            photos,
            specifications: JSON.stringify(specifications),
            sub_option_group: JSON.stringify(sub_option_group),
            video_link,
          },
    )
    .where(id ? "id" : "slug", "=", (id ? id : slug) as string)
    .executeTakeFirst();
});
