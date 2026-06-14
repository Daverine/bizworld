export type product = {
  id: string;
  slug: string;
  business_id: string;
  category: string;
  title: string;
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
  overview: string;
  details_attachment?: string;
  average_rating?: string;
  review_count?: string;
  created_at: string;
  hidden?: boolean;
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
};
