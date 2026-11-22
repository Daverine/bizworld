export type product = {
  id: string;
  slug: string;
  business_id: string;
  category_id: number;
  title: string;
  pictures: string[];
  video_link?: string;
  base_price: string;
  base_promo_price?: string;
  option_group?: {
    title: string;
    options: {
      label: string;
      price?: string;
      promo_price?: string;
      picture?: string;
      sub_options?: {
        is_active: boolean;
        label: string;
        price?: string;
        promo_price?: string;
        price_changed?: boolean;
        promo_price_changed?: boolean;
      }[];
    }[];
  };
  sub_option_group?: {
    title: string;
    options: { label: string; price?: string; picture?: string }[];
  };
  specifications: {
    name: string;
    value: string;
  }[];
  overview: string;
  details_attachment?: string;
  shipping?: {
    measurements: {
      weight?: string;
      length?: string;
      width?: string;
      height?: string;
    };
    location: {
      country: string;
      state: string;
      city: string;
      address: string;
    };
  };
  average_rating?: string;
  review_count?: string;
  created_at: string;
  hidden?: boolean;
  promo?: boolean;
  local_group_id?: string;
  availability: string;
  quantity?: string;
  delivery_options?: string[];
};
export type service = {
  average_rating?: string;
  bookable?: boolean;
  business_id: string;
  created_at: string;
  description: string;
  duration?: string;
  hidden?: boolean;
  home_service?: boolean;
  id: string;
  is_active: boolean;
  local_group_id?: string;
  packages?: {
    label: string;
    picture?: string;
    description: string;
    duration?: string;
    specifications: {
      name: string;
      value: string | boolean;
    }[];
    price: string;
  }[];
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  pictures: string[];
  price?: string;
  price_avail: string;
  review_count?: number;
  slug: string;
  specifications: {
    name: string;
    value: string | boolean;
  }[];
  title: string;
  video_link?: string;
};

export type bizData = {
  id: string;
  slug: string;
  super_admin: string;
  business_name: string;
  category: string;
  physical_location: boolean;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  map?: string;
  coverage?: string[];
  telephone: string;
  email: string;
  hours: [
    {
      day: "Sunday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
    {
      day: "Monday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
    {
      day: "Tuesday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
    {
      day: "Wednesday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
    {
      day: "Thursday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
    {
      day: "Friday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
    {
      day: "Saturday";
      avail: "nil" | "always" | "selected" | "appointment";
      hours: { opening?: string; closing?: string };
    },
  ];
  description: string;
  average_rating?: string;
  badges?: string[];
  cover_photo?: string;
  created_at: string;
  is_active: boolean;
  logo?: string;
  review_count?: number;
  local_groups?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    parent_id?: string;
  }[];
};
