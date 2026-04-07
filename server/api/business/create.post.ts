export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const category =
    body.category === "others" && body.newCategory ? `others:${body.newCategory}` : body.category;

  const newBusiness = await db
    .insertInto("business")
    .values({
      super_admin: body.super_admin,
      category: category,
      business_name: body.bizName,
      slug: body.slug,
      location:
        body.physicalLocation === "yes"
          ? `${body.street}, ${body.town}, ${body.state}, ${body.country}`
          : null,
      map: body.map || null,
      email: body.email,
      telephone: body.tel,
      hours: JSON.stringify(body.hours),
      description: body.desc,
      is_active: true,
    })
    .returningAll()
    .executeTakeFirst();

  return newBusiness;
});
