-- Single table product schema for add-product feature
-- Supports: human-readable IDs, SEO-friendly slugs, and complex product data
CREATE TABLE "products" (
  "id" text NOT NULL PRIMARY KEY,
  "slug" text NOT NULL,
  "businessId" text NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "basePrice" numeric NOT NULL CHECK ("basePrice" > 0),
  "photos" text[] DEFAULT ARRAY[]::text[],
  "videoLink" text,
  "overview" text,
  "specifications" jsonb DEFAULT '[]'::jsonb,
  "optionGroup" jsonb,
  "subOptionGroup" jsonb,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deletedAt" timestamptz
);

CREATE UNIQUE INDEX "product_id_businessId_idx" ON "products" ("id", "businessId");
CREATE UNIQUE INDEX "product_slug_businessId_idx" ON "products" ("slug", "businessId");
CREATE INDEX "product_slug_idx" ON "products" ("slug");
CREATE INDEX "product_businessId_idx" ON "products" ("businessId");
CREATE INDEX "product_category_idx" ON "products" ("category");
CREATE INDEX "product_isActive_idx" ON "products" ("isActive");
CREATE INDEX "product_createdAt_idx" ON "products" ("createdAt");