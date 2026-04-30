import { B } from "vue-router/dist/index-D_VEAp3P.js";

export default defineEventHandler(async (event) => {
  let {
    super_admin,
    category,
    new_category,
    business_name,
    slug,
    physical_location,
    country,
    state,
    city,
    address,
    map,
    coverage,
    email,
    telephone,
    hours,
    description,
    logo,
  } = await readBody(event);

  category = category === "others" && new_category ? `others:${new_category}` : category;
  coverage = coverage.filter(Boolean);

  const newBusiness = await db
    .insertInto("business")
    .values({
      super_admin,
      category,
      business_name,
      slug,
      physical_location,
      country,
      state,
      city,
      address,
      map,
      coverage,
      email,
      telephone,
      hours: JSON.stringify(hours),
      description,
      logo,
      is_active: true,
    })
    .returningAll()
    .executeTakeFirst();

  return newBusiness;
});
