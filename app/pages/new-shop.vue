<script lang="ts" setup>
import { url, email, required, requiredIf } from '@regle/rules';

definePageMeta({
  name: 'new-shop',
  layout: 'details',
  auth: false,
  noCart: true,
});

const businessCategories = [
  // Food, Dining & Hospitality
  {
    id: 101,
    name: 'Restaurant (General)',
    keywords: ['eatery', 'dining', 'food service', 'takeaway', 'diner'],
  },
  {
    id: 102,
    name: 'Café / Coffee Shop',
    keywords: ['coffee', 'tea', 'espresso', 'latte', 'kiosk', 'roastery'],
  },
  {
    id: 103,
    name: 'Fast Food Restaurant',
    keywords: ['quick service', 'drive-thru', 'burger', 'pizza', 'wings'],
  },
  {
    id: 104,
    name: 'Bar / Pub / Lounge',
    keywords: ['drinks', 'cocktail', 'nightclub', 'tavern', 'brewery', 'wine'],
  },
  {
    id: 105,
    name: 'Bakery / Patisserie',
    keywords: ['cake', 'bread', 'pastry', 'cupcake', 'donut', 'cookies'],
  },
  {
    id: 106,
    name: 'Catering Service',
    keywords: ['event food', 'party planning', 'meal prep', 'corporate lunch'],
  },
  {
    id: 107,
    name: 'Hotel / Lodging',
    keywords: [
      'motel',
      'hostel',
      'inn',
      'resort',
      'accommodation',
      'short stay',
    ],
  },

  // Retail & Shopping
  {
    id: 201,
    name: 'Clothing Store / Boutique',
    keywords: [
      'apparel',
      'fashion',
      'shoes',
      'accessories',
      'dress',
      'designer',
    ],
  },
  {
    id: 202,
    name: 'E-commerce (Online Retail)',
    keywords: ['online shop', 'web store', 'digital goods', 'dropshipping'],
  },
  {
    id: 203,
    name: 'Electronics Store',
    keywords: ['gadgets', 'appliances', 'phones', 'computers', 'gaming'],
  },
  {
    id: 204,
    name: 'Grocery Store / Supermarket',
    keywords: [
      'groceries',
      'food market',
      'produce',
      'mini-mart',
      'deli',
      'convenience store',
    ],
  },
  {
    id: 205,
    name: 'Jewelry Store',
    keywords: ['jeweler', 'rings', 'watches', 'gold', 'silver', 'diamonds'],
  },
  {
    id: 206,
    name: 'Bookstore',
    keywords: ['books', 'comics', 'library', 'magazine', 'reading'],
  },
  {
    id: 207,
    name: 'Pet Store / Supplies',
    keywords: ['animals', 'dog food', 'veterinary supplies', 'grooming'],
  },
  {
    id: 208,
    name: 'Gift Shop / Novelty',
    keywords: ['souvenirs', 'crafts', 'cards', 'presents'],
  },

  // Professional Services
  {
    id: 301,
    name: 'Accounting Firm / Tax Preparer',
    keywords: ['accountant', 'bookkeeping', 'cpa', 'audit', 'taxes', 'payroll'],
  },
  {
    id: 302,
    name: 'Law Firm / Legal Service',
    keywords: ['lawyer', 'attorney', 'solicitor', 'litigation', 'paralegal'],
  },
  {
    id: 303,
    name: 'Business Consultant',
    keywords: ['consultancy', 'strategy', 'management', 'coaching', 'training'],
  },
  {
    id: 304,
    name: 'Marketing Agency',
    keywords: [
      'seo',
      'advertising',
      'social media',
      'branding',
      'pr',
      'public relations',
    ],
  },
  {
    id: 305,
    name: 'HR / Recruitment Agency',
    keywords: ['human resources', 'staffing', 'jobs', 'employment'],
  },
  {
    id: 306,
    name: 'Web Designer / Developer',
    keywords: ['website', 'coding', 'hosting', 'ui/ux', 'app design'],
  },

  // Home Services & Construction
  {
    id: 401,
    name: 'General Contractor / Builder',
    keywords: [
      'construction',
      'remodel',
      'renovation',
      'carpentry',
      'handyman',
    ],
  },
  {
    id: 402,
    name: 'Plumber',
    keywords: [
      'plumbing',
      'drainage',
      'water heater',
      'leak repair',
      'faucet',
      'sewer',
    ],
  },
  {
    id: 403,
    name: 'Electrician',
    keywords: [
      'wiring',
      'lighting',
      'electrical contractor',
      'power',
      'install',
    ],
  },
  {
    id: 404,
    name: 'HVAC Service',
    keywords: [
      'air conditioning',
      'heating',
      'ventilation',
      'furnace',
      'ac repair',
    ],
  },
  {
    id: 405,
    name: 'Landscaping / Lawn Service',
    keywords: ['gardening', 'yard work', 'tree trimming', 'mowing'],
  },
  {
    id: 406,
    name: 'House Cleaning Service',
    keywords: ['maid service', 'janitorial', 'commercial cleaning'],
  },
  {
    id: 407,
    name: 'Security System Service',
    keywords: ['alarms', 'cctv', 'surveillance', 'home automation'],
  },
  {
    id: 408,
    name: 'Interior Designer',
    keywords: ['decorating', 'home styling', 'furniture'],
  },

  // Health & Wellness
  {
    id: 501,
    name: "Doctor's Office / Clinic",
    keywords: [
      'physician',
      'general practice',
      'medical',
      'hospital',
      'pediatrician',
    ],
  },
  {
    id: 502,
    name: 'Dentist / Dental Clinic',
    keywords: ['orthodontist', 'teeth', 'cosmetic dentistry', 'oral surgeon'],
  },
  {
    id: 503,
    name: 'Pharmacy / Drug Store',
    keywords: ['drugs', 'medicine', 'prescription', 'chemist'],
  },
  {
    id: 504,
    name: 'Gym / Fitness Center',
    keywords: ['workout', 'trainer', 'yoga', 'pilates', 'personal training'],
  },
  {
    id: 505,
    name: 'Spa / Massage Therapy',
    keywords: ['salon', 'beauty', 'hairdresser', 'nails', 'barber', 'facials'],
  },
  {
    id: 506,
    name: 'Physiotherapist',
    keywords: ['physical therapy', 'rehabilitation', 'rehab', 'sports injury'],
  },
  {
    id: 508,
    name: 'Mental Health Therapist',
    keywords: ['counseling', 'psychologist', 'psychiatrist', 'therapy'],
  },

  // Financial & Real Estate
  {
    id: 701,
    name: 'Bank / Credit Union',
    keywords: ['banking', 'loans', 'checking account', 'teller'],
  },
  {
    id: 702,
    name: 'Financial Advisor',
    keywords: ['wealth management', 'investments', 'retirement planning'],
  },
  {
    id: 703,
    name: 'Insurance Agent / Broker',
    keywords: ['auto insurance', 'life insurance', 'home insurance', 'policy'],
  },
  {
    id: 704,
    name: 'Real Estate Agent / Broker',
    keywords: ['realtor', 'property', 'house sales', 'leasing', 'apartment'],
  },

  // Automotive & Transport
  {
    id: 801,
    name: 'Auto Repair Shop',
    keywords: ['mechanic', 'car service', 'tires', 'oil change', 'maintenance'],
  },
  {
    id: 802,
    name: 'Car Dealership',
    keywords: ['vehicle sales', 'used cars', 'new cars', 'auto sales'],
  },
  {
    id: 804,
    name: 'Trucking & Logistics',
    keywords: [
      'shipping',
      'freight',
      'transport',
      'courier',
      'delivery service',
    ],
  },

  // Education & Arts
  {
    id: 901,
    name: 'School / Academy',
    keywords: ['college', 'university', 'preschool', 'education center'],
  },
  {
    id: 902,
    name: 'Tutoring Service',
    keywords: ['academic help', 'test prep', 'private teacher'],
  },
  {
    id: 904,
    name: 'Art Studio / Gallery',
    keywords: ['artist', 'painting', 'sculpture', 'exhibit'],
  },
  {
    id: 905,
    name: 'Music / Dance School',
    keywords: ['lessons', 'instructor', 'performance'],
  },

  // Miscellaneous
  {
    id: 951,
    name: 'Non-Profit / Charity',
    keywords: ['ngo', 'foundation', 'donation', 'community service'],
  },
  {
    id: 955,
    name: 'Manufacturing (General)',
    keywords: [
      'production',
      'factory',
      'industrial',
      'wholesale',
      'distribution',
    ],
  },
];
const formData = reactive<{
  tab1: {
    bizName?: string;
    category?: string;
    newCategory?: string;
  };
  tab2: {
    physicalLocation?: string;
    country?: string;
    state?: string;
    town?: string;
    lga?: string;
    street?: string;
  };
  tab3: {
    map?: string;
  };
  tab4: {
    tel?: number;
    email?: string;
  };
  tab5: {
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
      }
    ];
  };
  tab6: {
    desc?: string;
    logo?: File;
  };
}>({
  tab1: {},
  tab2: {},
  tab3: {},
  tab4: {},
  tab5: {
    hours: [
      { day: 'Sunday', avail: false, hours: {} },
      { day: 'Monday', avail: false, hours: {} },
      { day: 'Tuesday', avail: false, hours: {} },
      { day: 'Wednesday', avail: false, hours: {} },
      { day: 'Thursday', avail: false, hours: {} },
      { day: 'Friday', avail: false, hours: {} },
      { day: 'Saturday', avail: false, hours: {} },
    ],
  },
  tab6: {},
});
const validation = {
  tab1: useRegle(formData.tab1, {
    category: {
      required: withMessage(required, 'Business category is required'),
    },
    newCategory: {
      required: withMessage(
        requiredIf(() => formData.tab1.category === 'others'),
        'New category name is required'
      ),
    },
    bizName: { required: withMessage(required, 'Business name is required') },
  }),
  tab2: useRegle(formData.tab2, {
    physicalLocation: {
      required: withMessage(
        required,
        'You need to specify whether you business have physical location or not.'
      ),
    },
    country: {
      required: withMessage(
        requiredIf(() => formData.tab2.physicalLocation === 'yes'),
        'Country is required'
      ),
    },
    state: {
      required: withMessage(
        requiredIf(() => formData.tab2.physicalLocation === 'yes'),
        'State is required'
      ),
    },
    lga: {
      required: withMessage(
        requiredIf(() => formData.tab2.physicalLocation === 'yes'),
        'LGA is required'
      ),
    },
    town: {
      required: withMessage(
        requiredIf(() => formData.tab2.physicalLocation === 'yes'),
        'town is required'
      ),
    },
    street: {
      required: withMessage(
        requiredIf(() => formData.tab2.physicalLocation === 'yes'),
        'Street address is required'
      ),
    },
  }),
  tab3: useRegle(formData.tab3, {
    map: {
      required: withMessage(
        requiredIf(() => formData.tab2.physicalLocation === 'yes'),
        'Map URL is required'
      ),
      url,
    },
  }),
  tab4: useRegle(formData.tab4, {
    tel: { required: withMessage(required, 'Telephone number is required') },
    email: {
      required: withMessage(required, 'Email address is required'),
      email,
    },
  }),
  tab5: useRegle(formData.tab5, {
    hours: {
      $each: (item) => ({
        hours: {
          opening: {
            required: withMessage(
              requiredIf(() => item.value.avail),
              'Opening time is required'
            ),
          },
          closing: {
            required: withMessage(
              requiredIf(() => item.value.avail),
              'Closing time is required'
            ),
          },
        },
      }),
    },
  }),
  tab6: useRegle(formData.tab6, {
    desc: {
      required: withMessage(required, 'Business description is required'),
    },
  }),
};

function focusNewCategory() {
  nextTick(() => document.getElementById('biz-category-new')?.focus());
}
const currentTab = ref('tab1');
async function nextTab() {
  const key = currentTab.value as keyof typeof validation;
  validation[key].r$.$validate();
  if (validation[key].r$.$invalid) {
    await nextTick();
    (
      document.querySelector(
        '.tab-page.active .error, .tab-page.active .error-text'
      ) as HTMLElement
    )?.focus();
    document
      .querySelector('.tab-page.active .error, .tab-page.active .error-text')
      ?.closest('.field')
      ?.scrollIntoView({ behavior: 'instant', block: 'center' });
    return;
  }
  const currentIndex = Object.keys(formData).indexOf(currentTab.value);
  if (currentIndex < Object.keys(formData).length - 1) {
    if (
      currentTab.value === 'tab2' &&
      formData.tab2.physicalLocation !== 'yes'
    ) {
      // Skip tab3 if no physical location
      currentTab.value = Object.keys(formData)[currentIndex + 2] || '';
    } else currentTab.value = Object.keys(formData)[currentIndex + 1] || '';
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}
function prevTab() {
  const currentIndex = Object.keys(formData).indexOf(currentTab.value);
  if (currentIndex > 0) {
    if (
      currentTab.value === 'tab4' &&
      formData.tab2.physicalLocation !== 'yes'
    ) {
      // Skip tab3 if no physical location
      currentTab.value = Object.keys(formData)[currentIndex - 2] || '';
    } else currentTab.value = Object.keys(formData)[currentIndex - 1] || '';
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}
</script>
<template>
  <div class="container-md pt-8">
    <div class="container-sm no-edge min-h-[80vh]">
      <div
        class="tab-page"
        v-for="id in ['tab1']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8">
          <h3 class="text-center">Build Your Online Business Presence</h3>
          <p class="text-center">
            Follow and complete this form to create your Bizworld business page.
          </p>
        </header>
        <div class="field">
          <label>Industry/Category</label>
          <p class="supp-text faint-text">
            Choose a category from the dropdown below that best fits your
            business. You can also select “Others” from the dropdown to make a
            new one.
          </p>
          <LimbDropdown
            v-model="formData.tab1.category"
            class="select search"
            :class="{ error: validation.tab1.r$.category.$error }"
            :search-data="businessCategories"
            :filter-function="smartCategorySearch"
            v-slot="{ query, filteredData }"
            id="biz-category"
            placeholder="Select a category or Industry"
          >
            <div class="drop menu">
              <div
                class="item"
                v-for="category in query ? filteredData : businessCategories"
                :key="category.id"
              >
                {{ category.name }}
              </div>
              <div data-value="others" class="item" @click="focusNewCategory">
                Others
              </div>
            </div>
          </LimbDropdown>
          <ul
            class="supp-text error-text"
            v-if="validation.tab1.r$.category.$error"
          >
            <li
              v-for="error of validation.tab1.r$.category.$errors"
              :key="error"
            >
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
        <div v-if="formData.tab1.category === 'others'" class="field">
          <label for="biz-category-new">New category name</label>
          <div class="supp-text faint-text">
            Note: Your business will stay in the “Others” category until the new
            category is reviewed and standardized.
          </div>
          <input
            v-model="formData.tab1.newCategory"
            id="biz-category-new"
            :class="{ error: validation.tab1.r$.newCategory.$error }"
            class="form-item"
            type="text"
            placeholder="Category name"
            required
          />
          <ul
            class="supp-text error-text"
            v-if="validation.tab1.r$.newCategory.$error"
          >
            <li
              v-for="error of validation.tab1.r$.newCategory.$errors"
              :key="error"
            >
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="field">
          <label for="biz-name">Business name</label>
          <input
            v-model="formData.tab1.bizName"
            id="biz-name"
            type="text"
            placeholder="Business name"
            :class="{ error: validation.tab1.r$.bizName.$error }"
            class="form-item"
          />
          <ul
            class="supp-text error-text"
            v-if="validation.tab1.r$.bizName.$error"
          >
            <li
              v-for="error of validation.tab1.r$.bizName.$errors"
              :key="error"
            >
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab2']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header>
          <h3 class="text-center">Do You Have a Physical Location?</h3>
          <p>
            Provide your store or office address if you'd like customers to
            visit you. This information will be displayed on your BizWorld
            profile and used in distance-based search results.
          </p>
        </header>
        <div class="field">
          <fieldset>
            <legend>Do you have a physical location?</legend>
            <label>
              <input
                v-model="formData.tab2.physicalLocation"
                value="yes"
                type="radio"
                class="form-item"
                :class="{ error: validation.tab2.r$.physicalLocation.$error }"
              />
              Yes
            </label>
            <label>
              <input
                v-model="formData.tab2.physicalLocation"
                value="no"
                type="radio"
                class="form-item"
                :class="{ error: validation.tab2.r$.physicalLocation.$error }"
              />
              No
            </label>
            <ul
              class="supp-text error-text"
              v-if="validation.tab2.r$.physicalLocation.$error"
            >
              <li
                v-for="error of validation.tab2.r$.physicalLocation.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </li>
            </ul>
          </fieldset>
        </div>
        <fieldset v-if="formData.tab2.physicalLocation === 'yes'">
          <div class="field">
            <label>Country</label>
            <LimbDropdown
              v-model="formData.tab2.country"
              placeholder="Select a country"
              class="search select"
              :class="{ error: validation.tab2.r$.country.$error }"
            >
              <div class="drop menu">
                <div class="item">Nigeria</div>
              </div>
            </LimbDropdown>
            <ul
              class="supp-text error-text"
              v-if="validation.tab2.r$.country.$error"
            >
              <li
                v-for="error of validation.tab2.r$.country.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="field">
            <label>State</label>
            <LimbDropdown
              v-model="formData.tab2.state"
              placeholder="Select a state"
              :options="{ stretchWidth: true }"
              class="search select"
              :class="{ error: validation.tab2.r$.state.$error }"
            >
              <div class="drop menu">
                <div class="item">Ogun</div>
                <div class="item">Osun</div>
              </div>
            </LimbDropdown>
            <ul
              class="supp-text error-text"
              v-if="validation.tab2.r$.state.$error"
            >
              <li
                v-for="error of validation.tab2.r$.state.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="field">
            <label>Local Government Area</label>
            <input
              v-model="formData.tab2.lga"
              placeholder="Enter LGA"
              type="text"
              class="form-item"
              :class="{ error: validation.tab2.r$.lga.$error }"
            />
            <ul
              class="supp-text error-text"
              v-if="validation.tab2.r$.lga.$error"
            >
              <li v-for="error of validation.tab2.r$.lga.$errors" :key="error">
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="field">
            <label>Town/City</label>
            <input
              v-model="formData.tab2.town"
              placeholder="Enter town/city"
              type="text"
              class="form-item"
              :class="{ error: validation.tab2.r$.town.$error }"
            />
            <ul
              class="supp-text error-text"
              v-if="validation.tab2.r$.town.$error"
            >
              <li v-for="error of validation.tab2.r$.town.$errors" :key="error">
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="field">
            <label>Street address</label>
            <input
              v-model="formData.tab2.street"
              placeholder="Enter house number, street name"
              type="text"
              class="form-item"
              :class="{ error: validation.tab2.r$.street.$error }"
            />
            <ul
              class="supp-text error-text"
              v-if="validation.tab2.r$.street.$error"
            >
              <li
                v-for="error of validation.tab2.r$.street.$errors"
                :key="error"
              >
                {{ error }}
              </li>
            </ul>
          </div>
        </fieldset>
      </div>
      <div
        v-if="formData.tab2.physicalLocation"
        class="tab-page"
        v-for="id in ['tab3']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header>
          <h3 class="text-center">Confirm Your Business Location</h3>
          <p>We need your exact business address. Please:</p>
          <ol class="list-decimal pl-6 mb-4">
            <li>
              Go to
              <NuxtLink to="https://map.google.com" external target="_blank"
                >Google Maps</NuxtLink
              >.
            </li>
            <li>
              Find your location and precisely adjust the map marker to your
              business's spot by dragging and zooming.
            </li>
            <li>
              Copy the generated address and paste it into the field below.
            </li>
          </ol>
        </header>
        <div class="field">
          <label>Map URL</label>
          <input
            v-model="formData.tab3.map"
            type="url"
            class="form-item"
            :class="{ error: validation.tab3.r$.map.$error }"
          />
          <ul class="supp-text error-text" v-if="validation.tab3.r$.map.$error">
            <li v-for="error of validation.tab3.r$.map.$errors" :key="error">
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab4']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header>
          <h3 class="text-center">Add Contact Information</h3>
          <p>
            Help customers connect with you easily! Add at least a phone number
            or email address. This information will be prominently displayed on
            your Business Profile.
          </p>
        </header>
        <div class="field">
          <label>Phone number</label>
          <input
            v-model="formData.tab4.tel"
            placeholder="Enter your business telepone"
            type="tel"
            class="form-item"
            :class="{ error: validation.tab4.r$.tel.$error }"
          />
          <ul class="supp-text error-text" v-if="validation.tab4.r$.tel.$error">
            <li v-for="error of validation.tab4.r$.tel.$errors" :key="error">
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="field">
          <label>Email</label>
          <input
            v-model="formData.tab4.email"
            placeholder="Enter your business email address"
            type="email"
            class="form-item"
            :class="{ error: validation.tab4.r$.email.$error }"
          />
          <ul
            class="supp-text error-text"
            v-if="validation.tab4.r$.email.$error"
          >
            <li v-for="error of validation.tab4.r$.email.$errors" :key="error">
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab5']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header>
          <h3 class="text-center">Set Your Business Hours</h3>
          <p>
            Enter your regular business hours so customers know when to reach
            you.
          </p>
        </header>
        <div
          v-for="item in validation.tab5.r$.hours.$each"
          class="field border-b p-2"
        >
          <label class="flex justify-between">
            {{ item.day.$value }}
            <input
              v-model="item.avail.$value"
              type="checkbox"
              class="form-switch"
            />
          </label>
          <div
            v-if="item.avail.$value"
            class="flex justify-between items-center"
          >
            <div>
              <input
                v-model="item.hours.opening.$value"
                type="time"
                class="compact form-item"
              />
              <ul class="supp-text error-text" v-if="item.hours.opening.$error">
                <li v-for="error of item.hours.opening.$errors" :key="error">
                  <Icon name="material-symbols:close-rounded" />
                  {{ error }}
                </li>
              </ul>
            </div>
            <Icon name="material-symbols:arrow-range-rounded" />
            <div>
              <input
                v-model="item.hours.closing.$value"
                type="time"
                class="compact form-item"
              />
              <ul class="supp-text error-text" v-if="item.hours.closing.$error">
                <li v-for="error of item.hours.closing.$errors" :key="error">
                  <Icon name="material-symbols:close-rounded" />
                  {{ error }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab6']"
        :class="currentTab === id ? 'active' : ''"
      >
        <h3 class="text-center">Add More Details</h3>
        <p>
          Tell customers about your business. This description will appear on
          your Business Profile and help them understand what you offer.
        </p>
        <div class="field">
          <label>Business description</label>
          <textarea
            v-model="formData.tab6.desc"
            class="form-item"
            placeholder="What does your business do?"
          ></textarea>
          <ul
            class="supp-text error-text"
            v-if="validation.tab6.r$.desc.$error"
          >
            <li v-for="error of validation.tab6.r$.desc.$errors" :key="error">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="field">
          <label>Business logo</label>
          <p class="supp-text faint-text">
            Upload your business logo here. It will be prominently displayed on
            your Business Profile.
          </p>
          <div v-if="formData.tab6.logo" class="thumbnail image">
            <img
              :src="utils.fileToURL(formData.tab6.logo)"
              alt="Product photo"
            />
            <button
              @click="formData.tab6.logo = undefined"
              class="small circular icon button"
              style="position: absolute; top: 0.25rem; right: 0.25rem"
            >
              <Icon name="material-symbols:delete-outline-rounded" />
            </button>
          </div>
          <label v-if="!formData.tab6.logo" class="icon button design-takeover">
            <Icon name="material-symbols:add" /> Add photo
            <input
              type="file"
              @change="
                formData.tab6.logo = ($event.target as HTMLInputElement)
                  .files?.[0] as File
              "
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
    <footer
      class="sticky surface-bg p-4 pin-bottom-blend z-level-1"
      style="bottom: 0px; margin-top: 0.5rem"
    >
      <div v-if="currentTab === 'tab1'" class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our <a href="">Terms of Service</a> and
          <a href="">Privacy Policy</a>.
        </p>
        <button class="primary button" @click="nextTab">Continue</button>
      </div>
      <div v-else class="flex justify-between items-center gap-3">
        <span class="text-muted">
          {{ Object.keys(formData).indexOf(currentTab) + 1 }} of
          {{ Object.keys(formData).length }}
        </span>
        <div class="flex gap-3">
          <button @click="prevTab" class="flat button">Previous</button>
          <button @click="nextTab" class="primary button">
            {{ currentTab === Object.keys(formData).pop() ? 'Finish' : 'Next' }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<style></style>
