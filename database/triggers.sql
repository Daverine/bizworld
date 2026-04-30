  -- Trigger: trigger_set_updated_at

CREATE OR REPLACE TRIGGER trigger_set_updated_at
    AFTER INSERT OR UPDATE 
    ON public.product_review
    FOR EACH ROW
    EXECUTE FUNCTION public.set_review_updated_at();

  -- Trigger: trigger_update_product_stats

CREATE OR REPLACE TRIGGER trigger_update_product_stats
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.product_review
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_rating_stats();

  -- Trigger: trigger_update_product_stats

CREATE OR REPLACE TRIGGER trigger_update_business_stats
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.product_review
    FOR EACH ROW
    EXECUTE FUNCTION public.update_business_rating_stats();