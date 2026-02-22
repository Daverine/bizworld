## Product Schema & Implementation Guide

### Database Schema

**Single table design with:**
- `id` - Human-readable unique identifier (e.g., "prod39884")
- `slug` - SEO-friendly URL slug (e.g., "dell-inspiron-15-6-inch-laptop")
- JSONB columns for flexible product data (specifications, options, sub-options)
- Unique constraints to prevent duplicates
- Indexes for optimal query performance

---

### 1. Generate ID and Slug

**Utility function to generate ID:**
```typescript
// utils/productId.ts
export function generateProductId(): string {
  return `prod${Date.now()}${Math.floor(Math.random() * 10000)}`;
  // Example: prod1705984234567
}
```

**Utility function to generate slug from title:**
```typescript
// utils/productSlug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')      // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
}

// "Dell Inspiron 15.6\" Laptop!" → "dell-inspiron-156-laptop"
```

**Handle slug uniqueness with retry logic:**
```typescript
// utils/uniqueSlug.ts
export async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await productExists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  
  return slug;
}
```

---

### 2. Create Product

**Server API endpoint:**
```typescript
// server/api/products/create.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Generate unique ID and slug
  const id = generateProductId();
  const baseSlug = generateSlug(body.title);
  const slug = await getUniqueSlug(baseSlug);
  
  try {
    const product = await db.product.create({
      data: {
        id,
        slug,
        businessId: body.businessId,
        title: body.title,
        category: body.category,
        basePrice: body.basePrice,
        photos: body.photos || [],
        videoLink: body.videoLink,
        overview: body.overview,
        specifications: body.specifications || [],
        optionGroup: body.optionGroup || null,
        subOptionGroup: body.subOptionGroup || null,
        isActive: true,
      },
    });
    
    return product;
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      throw createError({
        statusCode: 409,
        statusMessage: 'Product with this slug already exists',
      });
    }
    throw error;
  }
});
```

---

### 3. Query Products

**Get product by ID:**
```sql
SELECT * FROM "product" WHERE "id" = 'prod1705984234567';
```

**Get product by slug (for URLs):**
```sql
SELECT * FROM "product" WHERE "slug" = 'dell-inspiron-15-6-inch-laptop';
```

**Get all products for a business:**
```sql
SELECT * FROM "product" 
WHERE "businessId" = 'biz_001' AND "isActive" = true
ORDER BY "createdAt" DESC;
```

**Search products by category:**
```sql
SELECT * FROM "product" 
WHERE "businessId" = 'biz_001' 
  AND "category" = 'Computers & Accessories'
  AND "isActive" = true;
```

---

### 4. URL Routing

**Product page route:**
```typescript
// pages/product/[slug].vue
definePageMeta({
  validate: async (route) => {
    const product = await $fetch('/api/products/by-slug/' + route.params.slug);
    return !!product;
  }
});

const product = await $fetch(`/api/products/by-slug/${route.params.slug}`);
```

**URL structure:**
```
/product/dell-inspiron-15-6-inch-laptop  ← User-friendly, SEO-optimized
```

---

### 5. Update Product

**Update product details:**
```typescript
// server/api/products/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  // Regenerate slug if title changed
  let slug = undefined;
  if (body.title) {
    const baseSlug = generateSlug(body.title);
    slug = await getUniqueSlug(baseSlug);
  }
  
  return await db.product.update({
    where: { id },
    data: {
      ...body,
      ...(slug && { slug }),
      updatedAt: new Date(),
    },
  });
});
```

---

### 6. Delete Product

**Soft delete:**
```typescript
// server/api/products/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  return await db.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
});
```

**Hard delete:**
```sql
DELETE FROM "product" WHERE "id" = 'prod1705984234567';
```

---

### 7. Example Insert SQL

```sql
INSERT INTO "product" (
  "id", "slug", "businessId", "title", "category", "basePrice",
  "photos", "overview", "specifications", "optionGroup"
) VALUES (
  'prod1705984234567',
  'dell-inspiron-15-6-inch-laptop',
  'biz_001',
  'Dell Inspiron 15.6" Laptop',
  'Computers & Accessories',
  100000,
  ARRAY['/images/dell-1.jpg', '/images/dell-2.jpg'],
  'High-quality laptop for office work',
  '[
    {"name": "Brand", "value": "Dell"},
    {"name": "RAM", "value": "8GB"},
    {"name": "Storage", "value": "256GB SSD"}
  ]'::jsonb,
  '{
    "title": "Color",
    "options": [
      {"label": "Silver", "price": 0},
      {"label": "Black", "price": 2000}
    ]
  }'::jsonb
);
```

---

### Key Guarantees

✅ **ID uniqueness** - Database PRIMARY KEY ensures no duplicates  
✅ **Slug uniqueness** - UNIQUE constraint prevents duplicate URLs  
✅ **Race condition safe** - Database handles concurrent requests  
✅ **SEO friendly** - Readable slugs in URLs for search engines  
✅ **Human readable** - IDs stay readable in logs and admin panels  
✅ **Performance** - Strategic indexes on common query columns
