import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Generate unique ID and slug
  const id = utils.getUniqueId();
  const slug = await utils.slugFromTitle(body, pool);
  const category = body.category === 'others' && body.newCategory ? `others:${body.newCategory}` : body.category;

  try {
    const result = await pool.query(
      `INSERT INTO products (id, slug, business_id, title, category, base_price, photos, video_link, overview, specifications, option_group, sub_option_group, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        id,
        slug,
        body.businessId,
        body.title,
        category,
        parseFloat(body.price),
        body.photos,
        body.videoLink || null,
        body.overview,
        JSON.stringify(body.specifications),
        JSON.stringify(body.optionGroup),
        JSON.stringify(body.subOptionGroup),
        true,
      ],
    );
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation
      throw createError({
        statusCode: 409,
        statusMessage: 'Product with this slug already exists',
      });
    }
    throw error;
  }
});
