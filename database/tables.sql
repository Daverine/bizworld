CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."business" (
    "id" bigserial NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "super_admin" text NOT NULL,
    "category" text NOT NULL,
    "business_name" text NOT NULL,
    "description" text NOT NULL,
    "email" text,
    "physical_location" boolean NOT NULL,
    "map" text,
    "coverage" text[],
    "telephone" text,
    "badges" text[],
    "hours" jsonb,
    "is_active" boolean NOT NULL DEFAULT FALSE,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logo" text,
    "cover_photo" text,
    "country" text,
    "state" text,
    "city" text,
    "address" text,
    "average_rating" numeric(3, 2) DEFAULT 0.0,
    "review_count" int DEFAULT 0,
    -- GENERATED ALWAYS AS ( to_tsvector('english', business_name) || ' ' || to_tsvector('english', description) || ' ' || to_tsvector('english', category) ) STORED;
    "search_vector" tsvector,
    "local_group" jsonb[],
    PRIMARY KEY ("id")
);
COMMENT ON COLUMN "public"."business"."search_vector" IS 'GENERATED ALWAYS AS ( to_tsvector(''english'', business_name) || '' '' || to_tsvector(''english'', description) || '' '' || to_tsvector(''english'', category) ) STORED;';

CREATE TABLE "public"."account" (
    "id" text NOT NULL,
    "user_id" text NOT NULL,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "access_token_expires_at" timestamptz,
    "refresh_token_expires_at" timestamptz,
    "scope" text,
    "id_token" text,
    "password" text,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "account_account_account_userId_idx" ON "public"."account" ("user_id");
CREATE UNIQUE INDEX "account_account_issuer_account_id_uidx" ON "public"."account" ("account_id");

CREATE TABLE "public"."product_review" (
    "id" bigserial NOT NULL,
    "product_id" bigint NOT NULL,
    "user_id" text NOT NULL,
    "rating" int NOT NULL,
    "content" jsonb NOT NULL,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_id" bigint NOT NULL,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE UNIQUE INDEX "product_review_product_review_index_2" ON "public"."product_review" ("product_id", "user_id");

CREATE TABLE "public"."session" (
    "id" text NOT NULL,
    "expires_at" timestamptz NOT NULL,
    "token" text NOT NULL UNIQUE,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "user_id" text NOT NULL,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "session_session_session_userId_idx" ON "public"."session" ("user_id");

CREATE TABLE "public"."product" (
    "id" bigserial NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "business_id" bigint NOT NULL,
    "category_id" int NOT NULL,
    "title" text NOT NULL,
    "photos" text[] NOT NULL,
    "video_link" text,
    "base_price" numeric NOT NULL,
    "base_promo_price" numeric,
    "specifications" jsonb NOT NULL,
    "details_attachment" text,
    "overview" text NOT NULL,
    "option_group" jsonb,
    "sub_option_group" jsonb,
    "is_active" boolean NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "average_rating" numeric(3) DEFAULT 0.0,
    "review_count" int DEFAULT 0,
    "hidden" boolean,
    "promo" boolean,
    "availability" text NOT NULL,
    "quantity" int,
    "delivery_options" text[],
    "location" jsonb,
    -- GENERATED ALWAYS AS ( to_tsvector('english', title) || ' ' || to_tsvector('english', overview) ) STORED;
    "search_vector" tsvector,
    "local_group_id" text,
    PRIMARY KEY ("id")
);
COMMENT ON COLUMN "public"."product"."search_vector" IS 'GENERATED ALWAYS AS ( to_tsvector(''english'', title) || '' '' || to_tsvector(''english'', overview) ) STORED;';
-- Indexes
CREATE UNIQUE INDEX "product_product_product_index_2" ON "public"."product" ("id", "business_id");
CREATE UNIQUE INDEX "product_product_product_index_3" ON "public"."product" ("slug", "business_id");

CREATE TABLE "public"."verification" (
    "id" text NOT NULL,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "verification_verification_identifier_idx" ON "public"."verification" ("identifier");

CREATE TABLE "public"."user" (
    "id" text NOT NULL,
    "display_name" text NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "email" text NOT NULL,
    "email_verified" boolean NOT NULL,
    "image" text,
    "gender" text,
    "birth_year" int,
    "telephone" text,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."product_categories" (
    "id" int NOT NULL,
    "name" varchar(100),
    "properties" json,
    "parent_id" int,
    PRIMARY KEY ("id")
);

-- Foreign key constraints
-- Schema: public
ALTER TABLE "public"."account" ADD CONSTRAINT "fk_account_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."business" ADD CONSTRAINT "fk_business_super_admin_user_id" FOREIGN KEY("super_admin") REFERENCES "public"."user"("id");
ALTER TABLE "public"."product" ADD CONSTRAINT "fk_product_business_id_business_id" FOREIGN KEY("business_id") REFERENCES "public"."business"("id");
ALTER TABLE "public"."product_review" ADD CONSTRAINT "fk_product_review_business_id_business_id" FOREIGN KEY("business_id") REFERENCES "public"."business"("id");
ALTER TABLE "public"."product_review" ADD CONSTRAINT "fk_product_review_product_id_product_id" FOREIGN KEY("product_id") REFERENCES "public"."product"("id");
ALTER TABLE "public"."product_review" ADD CONSTRAINT "fk_product_review_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."session" ADD CONSTRAINT "fk_session_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."product" ADD CONSTRAINT "fk_product_category_id_product_categories_id" FOREIGN KEY("category_id") REFERENCES "public"."product_categories"("id");
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "fk_product_categories_parent_id_product_categories_id" FOREIGN KEY("parent_id") REFERENCES "public"."product_categories"("id");