CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."account" (
    "id" bigserial NOT NULL,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "user_id" bigint NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "id_token" text,
    "access_token_expires_at" timestamptz,
    "refresh_token_expires_at" timestamptz,
    "scope" text,
    "password" text,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "account_account_userId_idx" ON "public"."account" ("user_id");

CREATE TABLE "public"."business" (
    "id" bigserial NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "super_admin" bigint NOT NULL,
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
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."like" (
    "user_id" bigint NOT NULL,
    "post_id" bigint NOT NULL,
    "created_at" timestamptz NOT NULL,
    PRIMARY KEY ("user_id", "post_id")
);

CREATE TABLE "public"."follow" (
    "follower_id" bigint NOT NULL UNIQUE,
    "following_id" bigint NOT NULL,
    "created_at" timestamptz NOT NULL
);

CREATE TABLE "public"."post" (
    "id" bigserial NOT NULL,
    "entity_id" bigint NOT NULL,
    "content" text NOT NULL,
    "attachment" text[],
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."product_review" (
    "id" bigserial NOT NULL,
    "product_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "rating" int NOT NULL,
    "content" jsonb NOT NULL,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_id" bigint NOT NULL,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE UNIQUE INDEX "product_review_index_2" ON "public"."product_review" ("product_id", "user_id");

CREATE TABLE "public"."user" (
    "id" bigserial NOT NULL,
    "display_name" text NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "email" text NOT NULL,
    "email_verified" boolean NOT NULL,
    "image" text,
    "gender" text,
    "birth_year" date,
    "telephone" text,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."product" (
    "id" bigserial NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "business_id" bigint NOT NULL,
    "category" text NOT NULL,
    "title" text NOT NULL,
    "photos" text[] NOT NULL,
    "video_link" text,
    "base_price" numeric NOT NULL,
    "specifications" jsonb NOT NULL,
    "details_attachment" text,
    "overview" text NOT NULL,
    "option_group" jsonb,
    "sub_option_group" jsonb,
    "is_active" boolean NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "average_rating" numeric(3) DEFAULT 0.0,
    "review_count" int DEFAULT 0,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE UNIQUE INDEX "product_product_index_2" ON "public"."product" ("id", "business_id");
CREATE UNIQUE INDEX "product_product_index_3" ON "public"."product" ("slug", "business_id");

CREATE TABLE "public"."message" (
    "id" bigserial NOT NULL,
    "sender_id" bigint NOT NULL,
    "receiver_id" bigint NOT NULL,
    "content" jsonb NOT NULL,
    "is_read" boolean NOT NULL,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."session" (
    "id" bigserial NOT NULL,
    "expires_at" timestamptz NOT NULL,
    "token" text NOT NULL UNIQUE,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "user_id" bigint NOT NULL,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "session_session_userId_idx" ON "public"."session" ("user_id");

-- Foreign key constraints
-- Schema: public
ALTER TABLE "public"."post" ADD CONSTRAINT "fk_post_entity_id_business_id" FOREIGN KEY("entity_id") REFERENCES "public"."business"("id");
ALTER TABLE "public"."product_review" ADD CONSTRAINT "fk_product_review_business_id_business_id" FOREIGN KEY("business_id") REFERENCES "public"."business"("id");
ALTER TABLE "public"."follow" ADD CONSTRAINT "fk_follow_following_id_business_id" FOREIGN KEY("following_id") REFERENCES "public"."business"("id");
ALTER TABLE "public"."product" ADD CONSTRAINT "fk_product_business_id_business_id" FOREIGN KEY("business_id") REFERENCES "public"."business"("id");
ALTER TABLE "public"."like" ADD CONSTRAINT "fk_like_post_id_post_id" FOREIGN KEY("post_id") REFERENCES "public"."post"("id");
ALTER TABLE "public"."product_review" ADD CONSTRAINT "fk_product_review_product_id_product_id" FOREIGN KEY("product_id") REFERENCES "public"."product"("id");
ALTER TABLE "public"."account" ADD CONSTRAINT "fk_account_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."message" ADD CONSTRAINT "fk_message_sender_id_user_id" FOREIGN KEY("sender_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."session" ADD CONSTRAINT "fk_session_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."business" ADD CONSTRAINT "fk_business_super_admin_user_id" FOREIGN KEY("super_admin") REFERENCES "public"."user"("id");
ALTER TABLE "public"."message" ADD CONSTRAINT "fk_message_receiver_id_user_id" FOREIGN KEY("receiver_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."like" ADD CONSTRAINT "fk_like_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."follow" ADD CONSTRAINT "fk_follow_follower_id_user_id" FOREIGN KEY("follower_id") REFERENCES "public"."user"("id");
ALTER TABLE "public"."product_review" ADD CONSTRAINT "fk_product_review_user_id_user_id" FOREIGN KEY("user_id") REFERENCES "public"."user"("id");