let shopSchema: {
  bizName?: string;
  category?: string;
  physicalLocation?: string;
  country?: string;
  state?: string;
  town?: string;
  lga?: string;
  street?: string;
  map?: string;
  tel?: number;
  email?: string;
  desc?: string;
  logo?: File;
  hours: [
    {
      day: 'Sunday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
    {
      day: 'Monday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
    {
      day: 'Tuesday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
    {
      day: 'Wednesday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
    {
      day: 'Thursday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
    {
      day: 'Friday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
    {
      day: 'Saturday';
      avail: boolean;
      hours: { opening?: string; closing?: string };
    },
  ];
};

let productSchema: {
  category?: string;
  title?: string;
  photos: File[];
  videoLink?: string;
  price?: number;
  optionGroup?: {
    title: string;
    options: {
      label: string;
      price?: number;
      photo?: File;
      subOptions?: {
        isActive: boolean;
        label: string;
        price?: number;
        priceChanged?: boolean;
      }[];
    }[];
  };
  subOptionGroup?: {
    title: string;
    options: { label: string; price?: number; photo?: File }[];
  };
  specifications: {
    name: string;
    value: string;
  }[];
  overview?: string;
};
