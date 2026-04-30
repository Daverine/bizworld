-- FUNCTION: public.set_review_updated_at()

CREATE OR REPLACE FUNCTION public.set_review_updated_at()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF (TG_OP = 'UPDATE') THEN
		UPDATE review_product SET updated_at = NOW() WHERE id = NEW.id;
	END IF;
	RETURN NULL;
END;
$BODY$;

-- FUNCTION: public.update_product_rating_stats()

CREATE OR REPLACE FUNCTION public.update_product_rating_stats()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
		UPDATE product
		SET
			average_rating = (SELECT COALESCE(AVG(rating), 0) FROM product_review WHERE product_id = NEW.product_id),
			review_count = (SELECT COUNT(*) FROM product_review WHERE product_id = NEW.product_id)
		WHERE id = NEW.product_id;
	END IF;

	IF (TG_OP = 'DELETE') THEN
		UPDATE product
		SET
			average_rating = (SELECT COALESCE(AVG(rating), 0) FROM product_review WHERE product_id = OLD.product_id),
			review_count = (SELECT COUNT(*) FROM product_review WHERE product_id = OLD.product_id)
		WHERE id = OLD.product_id;
	END IF;

	RETURN NULL;
END;
$BODY$;

-- FUNCTION: public.update_business_rating_stats()

CREATE OR REPLACE FUNCTION public.update_business_rating_stats()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
		UPDATE business
		SET
			average_rating = (SELECT COALESCE(AVG(rating), 0) FROM product_review WHERE business_id = NEW.business_id),
			review_count = (SELECT COUNT(*) FROM product_review WHERE business_id = NEW.business_id)
		WHERE id = NEW.business_id;
	END IF;

	IF (TG_OP = 'DELETE') THEN
		UPDATE business
		SET
			average_rating = (SELECT COALESCE(AVG(rating), 0) FROM product_review WHERE business_id = OLD.business_id),
			review_count = (SELECT COUNT(*) FROM product_review WHERE product_id = OLD.business_id)
		WHERE id = OLD.business_id;
	END IF;

	RETURN NULL;
END;
$BODY$;
