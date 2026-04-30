export type product = {
  id: string;
  slug: string;
  business_id: string;
  category?: string;
  new_category?: string;
  title?: string;
  photos: string[];
  video_link?: string;
  base_price: string;
  option_group?: {
    title: string;
    options: {
      label: string;
      price?: string;
      photo?: string;
      sub_options?: {
        is_active: boolean;
        label: string;
        price?: string;
        price_changed?: boolean;
      }[];
    }[];
  };
  sub_option_group?: {
    title: string;
    options: { label: string; price?: string; photo?: string }[];
  };
  specifications: {
    name: string;
    value: string;
  }[];
  overview?: string;
  details_attachment?: string;
  average_rating: string;
  review_count: string;
};
