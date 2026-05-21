<script lang="ts" setup>
import { url, email, required, requiredIf } from "@regle/rules";

definePageMeta({
  name: "new-shop",
  layout: "details",
  auth: { only: "user" },
  noCart: true,
});

const businessCategories = [
  // Food, Dining & Hospitality
  {
    id: 101,
    name: "Restaurant (General)",
    keywords: ["eatery", "dining", "food service", "takeaway", "diner"],
  },
  {
    id: 102,
    name: "Café / Coffee Shop",
    keywords: ["coffee", "tea", "espresso", "latte", "kiosk", "roastery"],
  },
  {
    id: 103,
    name: "Fast Food Restaurant",
    keywords: ["quick service", "drive-thru", "burger", "pizza", "wings"],
  },
  {
    id: 104,
    name: "Bar / Pub / Lounge",
    keywords: ["drinks", "cocktail", "nightclub", "tavern", "brewery", "wine"],
  },
  {
    id: 105,
    name: "Bakery / Patisserie",
    keywords: ["cake", "bread", "pastry", "cupcake", "donut", "cookies"],
  },
  {
    id: 106,
    name: "Catering Service",
    keywords: ["event food", "party planning", "meal prep", "corporate lunch"],
  },
  {
    id: 107,
    name: "Hotel / Lodging",
    keywords: ["motel", "hostel", "inn", "resort", "accommodation", "short stay"],
  },

  // Retail & Shopping
  {
    id: 201,
    name: "Clothing Store / Boutique",
    keywords: ["apparel", "fashion", "shoes", "accessories", "dress", "designer"],
  },
  {
    id: 202,
    name: "E-commerce (Online Retail)",
    keywords: ["online shop", "web store", "digital goods", "dropshipping"],
  },
  {
    id: 203,
    name: "Electronics Store",
    keywords: ["gadgets", "appliances", "phones", "computers", "gaming"],
  },
  {
    id: 204,
    name: "Grocery Store / Supermarket",
    keywords: ["groceries", "food market", "produce", "mini-mart", "deli", "convenience store"],
  },
  {
    id: 205,
    name: "Jewelry Store",
    keywords: ["jeweler", "rings", "watches", "gold", "silver", "diamonds"],
  },
  {
    id: 206,
    name: "Bookstore",
    keywords: ["books", "comics", "library", "magazine", "reading"],
  },
  {
    id: 207,
    name: "Pet Store / Supplies",
    keywords: ["animals", "dog food", "veterinary supplies", "grooming"],
  },
  {
    id: 208,
    name: "Gift Shop / Novelty",
    keywords: ["souvenirs", "crafts", "cards", "presents"],
  },

  // Professional Services
  {
    id: 301,
    name: "Accounting Firm / Tax Preparer",
    keywords: ["accountant", "bookkeeping", "cpa", "audit", "taxes", "payroll"],
  },
  {
    id: 302,
    name: "Law Firm / Legal Service",
    keywords: ["lawyer", "attorney", "solicitor", "litigation", "paralegal"],
  },
  {
    id: 303,
    name: "Business Consultant",
    keywords: ["consultancy", "strategy", "management", "coaching", "training"],
  },
  {
    id: 304,
    name: "Marketing Agency",
    keywords: ["seo", "advertising", "social media", "branding", "pr", "public relations"],
  },
  {
    id: 305,
    name: "HR / Recruitment Agency",
    keywords: ["human resources", "staffing", "jobs", "employment"],
  },
  {
    id: 306,
    name: "Web Designer / Developer",
    keywords: ["website", "coding", "hosting", "ui/ux", "app design"],
  },

  // Home Services & Construction
  {
    id: 401,
    name: "General Contractor / Builder",
    keywords: ["construction", "remodel", "renovation", "carpentry", "handyman"],
  },
  {
    id: 402,
    name: "Plumber",
    keywords: ["plumbing", "drainage", "water heater", "leak repair", "faucet", "sewer"],
  },
  {
    id: 403,
    name: "Electrician",
    keywords: ["wiring", "lighting", "electrical contractor", "power", "install"],
  },
  {
    id: 404,
    name: "HVAC Service",
    keywords: ["air conditioning", "heating", "ventilation", "furnace", "ac repair"],
  },
  {
    id: 405,
    name: "Landscaping / Lawn Service",
    keywords: ["gardening", "yard work", "tree trimming", "mowing"],
  },
  {
    id: 406,
    name: "House Cleaning Service",
    keywords: ["maid service", "janitorial", "commercial cleaning"],
  },
  {
    id: 407,
    name: "Security System Service",
    keywords: ["alarms", "cctv", "surveillance", "home automation"],
  },
  {
    id: 408,
    name: "Interior Designer",
    keywords: ["decorating", "home styling", "furniture"],
  },

  // Health & Wellness
  {
    id: 501,
    name: "Doctor's Office / Clinic",
    keywords: ["physician", "general practice", "medical", "hospital", "pediatrician"],
  },
  {
    id: 502,
    name: "Dentist / Dental Clinic",
    keywords: ["orthodontist", "teeth", "cosmetic dentistry", "oral surgeon"],
  },
  {
    id: 503,
    name: "Pharmacy / Drug Store",
    keywords: ["drugs", "medicine", "prescription", "chemist"],
  },
  {
    id: 504,
    name: "Gym / Fitness Center",
    keywords: ["workout", "trainer", "yoga", "pilates", "personal training"],
  },
  {
    id: 505,
    name: "Spa / Massage Therapy",
    keywords: ["salon", "beauty", "hairdresser", "nails", "barber", "facials"],
  },
  {
    id: 506,
    name: "Physiotherapist",
    keywords: ["physical therapy", "rehabilitation", "rehab", "sports injury"],
  },
  {
    id: 508,
    name: "Mental Health Therapist",
    keywords: ["counseling", "psychologist", "psychiatrist", "therapy"],
  },

  // Financial & Real Estate
  {
    id: 701,
    name: "Bank / Credit Union",
    keywords: ["banking", "loans", "checking account", "teller"],
  },
  {
    id: 702,
    name: "Financial Advisor",
    keywords: ["wealth management", "investments", "retirement planning"],
  },
  {
    id: 703,
    name: "Insurance Agent / Broker",
    keywords: ["auto insurance", "life insurance", "home insurance", "policy"],
  },
  {
    id: 704,
    name: "Real Estate Agent / Broker",
    keywords: ["realtor", "property", "house sales", "leasing", "apartment"],
  },

  // Automotive & Transport
  {
    id: 801,
    name: "Auto Repair Shop",
    keywords: ["mechanic", "car service", "tires", "oil change", "maintenance"],
  },
  {
    id: 802,
    name: "Car Dealership",
    keywords: ["vehicle sales", "used cars", "new cars", "auto sales"],
  },
  {
    id: 804,
    name: "Trucking & Logistics",
    keywords: ["shipping", "freight", "transport", "courier", "delivery service"],
  },

  // Education & Arts
  {
    id: 901,
    name: "School / Academy",
    keywords: ["college", "university", "preschool", "education center"],
  },
  {
    id: 902,
    name: "Tutoring Service",
    keywords: ["academic help", "test prep", "private teacher"],
  },
  {
    id: 904,
    name: "Art Studio / Gallery",
    keywords: ["artist", "painting", "sculpture", "exhibit"],
  },
  {
    id: 905,
    name: "Music / Dance School",
    keywords: ["lessons", "instructor", "performance"],
  },

  // Miscellaneous
  {
    id: 951,
    name: "Non-Profit / Charity",
    keywords: ["ngo", "foundation", "donation", "community service"],
  },
  {
    id: 955,
    name: "Manufacturing (General)",
    keywords: ["production", "factory", "industrial", "wholesale", "distribution"],
  },
];

const formData = reactive<{
  tab1: {
    business_name?: string;
    slug?: string;
    category?: string;
    new_category?: string;
  };
  tab2: {
    physical_location?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    map?: string;
  };
  tab3: {
    coverage: string[];
  };
  tab4: {
    telephone?: number;
    email?: string;
  };
  tab5: {
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
  };
  tab6: {
    description?: string;
  };
}>({
  tab1: {},
  tab2: {},
  tab3: {
    coverage: [],
  },
  tab4: {},
  tab5: {
    hours: [
      { day: "Sunday", avail: "nil", hours: {} },
      { day: "Monday", avail: "nil", hours: {} },
      { day: "Tuesday", avail: "nil", hours: {} },
      { day: "Wednesday", avail: "nil", hours: {} },
      { day: "Thursday", avail: "nil", hours: {} },
      { day: "Friday", avail: "nil", hours: {} },
      { day: "Saturday", avail: "nil", hours: {} },
    ],
  },
  tab6: {},
});
const validation = {
  tab1: useRegle(formData.tab1, {
    category: {
      required: withMessage(required, "Business category is required"),
    },
    new_category: {
      required: withMessage(
        requiredIf(() => formData.tab1.category === "others"),
        "New category name is required",
      ),
    },
    business_name: { required: withMessage(required, "Business name is required") },
    slug: {
      required: withMessage(required, "A Bizworld address is required"),
      isSlug,
      uniqueSlug: withMessage(
        async () => await isSlugUnique(),
        "That address is already taken. Try another.",
      ),
    },
  }),
  tab2: useRegle(formData.tab2, {
    physical_location: {
      required: withMessage(
        required,
        "You need to specify whether you business have physical location or not.",
      ),
    },
    country: {
      required: withMessage(
        requiredIf(() => formData.tab2.physical_location === "yes"),
        "Country is required",
      ),
    },
    state: {
      required: withMessage(
        requiredIf(() => formData.tab2.physical_location === "yes"),
        "State is required",
      ),
    },
    city: {
      required: withMessage(
        requiredIf(() => formData.tab2.physical_location === "yes"),
        "City is required",
      ),
    },
    address: {
      required: withMessage(
        requiredIf(() => formData.tab2.physical_location === "yes"),
        "Address is required",
      ),
    },
    map: {
      url,
    },
  }),
  tab3: useRegle(formData.tab3, {
    coverage: {
      uniqueCoverage: withMessage(
        () => new Set(formData.tab3.coverage).size === formData.tab3.coverage.length,
        "Individual coverage areas added should be unique.",
      ),
    },
  }),
  tab4: useRegle(formData.tab4, {
    telephone: { required: withMessage(required, "Telephone number is required") },
    email: {
      required: withMessage(required, "Email address is required"),
      email,
    },
  }),
  tab5: useRegle(formData.tab5, {
    hours: {
      $each: (day) => ({
        hours: {
          $self: {
            closingTimeMustBeGreater: withMessage(() => {
              const opening = day.value.hours.opening?.split(":");
              const closing = day.value.hours.closing?.split(":");

              if (day.value.avail !== "selected" || !opening || !closing) return true;

              const today = new Date();
              today.setHours(parseFloat(opening[0]!), parseFloat(opening[1]!));
              const openTimeStamp = today.getTime();
              today.setHours(parseFloat(closing[0]!), parseFloat(closing[1]!));
              const closeTimeStamp = today.getTime();

              return closeTimeStamp > openTimeStamp;
            }, "Closing time must be greater than opening time."),
          },
          opening: {
            required: withMessage(
              requiredIf(() => day.value.avail === "selected"),
              "Opening time is required",
            ),
          },
          closing: {
            required: withMessage(
              requiredIf(() => day.value.avail === "selected"),
              "Closing time is required",
            ),
          },
        },
      }),
    },
  }),
  tab6: useRegle(formData.tab6, {
    description: {
      required: withMessage(required, "Business description is required"),
    },
  }),
};
const loaders = ref({
  slugGenerator: false,
  nextSection: false,
});
const progress = ref<{
  message: string;
  loaded: null | number;
  completed: boolean;
}>({
  message: "",
  loaded: null,
  completed: false,
});

async function isSlugUnique() {
  if (!formData.tab1.slug) return true;
  const { isUnique } = await $fetch("/api/is-slug-unique", {
    query: {
      slug: formData.tab1.slug,
      checkIn: "business",
    },
  });

  return isUnique;
}
async function generateSlug() {
  loaders.value.slugGenerator = true;
  await (async () => {
    await validation.tab1.r$.business_name.$validate();
    if (validation.tab1.r$.business_name.$invalid) {
      await nextTick();
      (document.getElementById("biz-name") as HTMLElement)?.focus();
      document
        .getElementById("biz-name")
        ?.closest(".field")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const { slug } = await $fetch("/api/generate-unique-slug", {
      query: {
        text: formData.tab1.business_name,
        checkIn: "business",
      },
    });
    formData.tab1.slug = slug;
  })();
  loaders.value.slugGenerator = false;
}
function applyHoursPreset(avail: "nil" | "always" | "selected" | "appointment") {
  formData.tab5.hours.forEach((day) => (day.avail = avail));
  validation.tab5.r$.hours.$reset();
}

const currentTab = ref("tab1");
async function nextTab() {
  const key = currentTab.value as keyof typeof validation;

  loaders.value.nextSection = true;
  await validation[key]?.r$.$validate();
  loaders.value.nextSection = false;

  if (validation[key]?.r$.$invalid) {
    await nextTick();
    (
      document.querySelector(".tab-page.active .error, .tab-page.active .text-error") as HTMLElement
    )?.focus();
    document
      .querySelector(".tab-page.active .error, .tab-page.active .text-error")
      ?.closest(".field")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const currentIndex = Object.keys(formData).indexOf(currentTab.value);
  if (currentIndex < Object.keys(formData).length - 1) {
    currentTab.value = Object.keys(formData)[currentIndex + 1] || "";
    await nextTick();
    window.scrollTo({ top: 0, behavior: "smooth" });
    (
      document
        .querySelector(".tab-page.active")
        ?.querySelector(utils.focusableElementsSelector) as HTMLElement
    )?.focus();
    return;
  }

  let uploader = document.querySelector("#upload-status");

  utils.triggerEvent(uploader!, "dgconsole", "open dialog");

  if (progress.value.completed) return;

  progress.value.loaded = null;
  progress.value.message = "Processing...";
  await utils.notifyOnEvent(uploader!, "isReady");

  progress.value.loaded = null;
  progress.value.message = "Finalizing...";

  const profile = {
    super_admin: useAuth().user.value?.id as string,
    ...structuredClone(toRaw(formData.tab1)),
    ...structuredClone(toRaw(formData.tab2)),
    ...structuredClone(toRaw(formData.tab3)),
    ...structuredClone(toRaw(formData.tab4)),
    ...structuredClone(toRaw(formData.tab5)),
    ...structuredClone(toRaw(formData.tab6)),
  };

  const resp = await $fetch("/api/business/create", {
    method: "post",
    body: profile,
  });

  if (resp) {
    await nextTick();
    progress.value.completed = true;
    progress.value.loaded = null;
    progress.value.message = "Done!";
  }
}
function prevTab() {
  const currentIndex = Object.keys(formData).indexOf(currentTab.value);
  if (currentIndex > 0) {
    currentTab.value = Object.keys(formData)[currentIndex - 1] || "";
    nextTick(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
}
</script>
<template>
  <div class="max-w-180 auto-contain pt-8">
    <div class="max-w-lg auto-contain no-edge">
      <form
        class="tab-page"
        @submit.prevent="nextTab"
        v-for="id in ['tab1']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8 text-center">
          <h3>Build Your Online Business Presence</h3>
          <p>Follow and complete this form to create your Bizworld business page.</p>
        </header>
        <div class="field">
          <label>Industry/Category</label>
          <p class="text-sm opacity-65">
            Choose a category from the dropdown below that best fits your business. You can also
            select “Others” from the dropdown to make a new one.
          </p>
          <LimbDropdown
            v-model="formData.tab1.category"
            type="search select"
            :class="{ error: validation.tab1.r$.category.$error }"
            :search-data="businessCategories"
            :filter-function="smartCategorySearch"
            v-slot="{ query, filteredData }"
            @change="
              $event !== 'others' ||
              nextTick(() => utils.document().getElementById('biz-category-new')?.focus())
            "
            id="biz-category"
            name="biz-category"
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
              <div data-value="others" class="item">Others</div>
            </div>
          </LimbDropdown>
          <div
            class="text-sm text-error"
            v-for="error of validation.tab1.r$.category.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" /> {{ error }}
          </div>
        </div>
        <div v-if="formData.tab1.category === 'others'" class="field">
          <label for="biz-category-new">New category name</label>
          <div class="text-sm opacity-65">
            Note: Your business will stay in the “Others” category until the new category is
            reviewed and standardized.
          </div>
          <input
            v-model="formData.tab1.new_category"
            id="biz-category-new"
            :class="{ error: validation.tab1.r$.new_category.$error }"
            class="form-item"
            type="text"
            placeholder="Category name"
          />
          <div
            class="text-sm text-error"
            v-for="error of validation.tab1.r$.new_category.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" /> {{ error }}
          </div>
        </div>
        <div class="field">
          <label for="biz-name">Business name</label>
          <input
            v-model="formData.tab1.business_name"
            id="biz-name"
            type="text"
            placeholder="Business name"
            :class="{ error: validation.tab1.r$.business_name.$error }"
            class="form-item"
          />
          <div
            class="text-sm text-error"
            v-for="error of validation.tab1.r$.business_name.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" /> {{ error }}
          </div>
        </div>
        <div class="field">
          <label for="biz-name">BizWorld address</label>
          <p class="text-sm opacity-65">
            Create a bizworld address for your business page or click on the generate button to
            generate one based on your business name.
          </p>
          <div class="note text-sm">
            <Icon name="material-symbols:info-outline-rounded" class="text-[1.5rem]" />
            <div class="flex-1">
              Your BizWorld address is a unique identifier that creates a custom URL for your
              business page (e.g., bizworld.com/yourbiz).
            </div>
          </div>
          <div class="flex">
            <button
              type="button"
              class="ml-auto compact button"
              :class="{ loading: loaders.slugGenerator }"
              :disabled="loaders.slugGenerator"
              @click="generateSlug"
            >
              Generate address
            </button>
          </div>
          <input
            v-model.trim="formData.tab1.slug"
            id="biz-slug"
            type="text"
            :disabled="loaders.slugGenerator"
            placeholder="Create a bizWorld address"
            :class="{ error: validation.tab1.r$.slug.$error }"
            class="form-item"
          />
          <div
            class="text-sm text-error"
            v-for="error of validation.tab1.r$.slug.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" />
            {{ error }}
          </div>
        </div>
        <button type="submit" class="sr-only">Next</button>
      </form>
      <form
        class="tab-page"
        @submit.prevent="nextTab"
        v-for="id in ['tab2']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8 text-center">
          <h3>Do You Have a Physical Location?</h3>
          <p>
            Provide your store or office address if you'd like customers to visit you. This
            information will be displayed on your BizWorld profile and used in distance-based search
            results.
          </p>
        </header>
        <div class="field">
          <fieldset>
            <legend>Do you have a physical location?</legend>
            <div class="menu">
              <label class="item">
                <input
                  v-model="formData.tab2.physical_location"
                  value="yes"
                  type="radio"
                  name="physical-location"
                  @change="validation.tab2.r$.$reset()"
                  class="form-item"
                  :class="{ error: validation.tab2.r$.physical_location.$error }"
                />
                Yes
              </label>
              <label class="item">
                <input
                  v-model="formData.tab2.physical_location"
                  value="no"
                  type="radio"
                  name="physical-location"
                  class="form-item"
                  :class="{ error: validation.tab2.r$.physical_location.$error }"
                />
                No
              </label>
            </div>
            <div
              class="text-sm text-error"
              v-for="error of validation.tab2.r$.physical_location.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
          </fieldset>
        </div>
        <template v-if="formData.tab2.physical_location === 'yes'">
          <div class="field">
            <label>Country</label>
            <LimbDropdown
              type="search select"
              class="form-item"
              :class="{ error: validation.tab2.r$.country.$error }"
              placeholder="Select a Country"
              v-model="formData.tab2.country"
              name="biz-country"
            />
            <div class="drop menu">
              <div class="item">Nigeria</div>
            </div>
            <div
              class="text-sm text-error"
              v-for="error of validation.tab2.r$.country.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
          </div>
          <div class="field">
            <label>State</label>
            <input
              type="text"
              class="form-item"
              :class="{ error: validation.tab2.r$.state.$error }"
              placeholder="Enter state"
              v-model="formData.tab2.state"
              name="biz-state"
            />
            <div
              class="text-sm text-error"
              v-for="error of validation.tab2.r$.state.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
          </div>
          <div class="field">
            <label>City/Town</label>
            <input
              type="text"
              class="form-item"
              :class="{ error: validation.tab2.r$.city.$error }"
              placeholder="Enter city or town"
              v-model="formData.tab2.city"
              name="biz-city"
            />
            <div
              class="text-sm text-error"
              v-for="error of validation.tab2.r$.city.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Address</label>
            <input
              type="text"
              class="form-item"
              :class="{ error: validation.tab2.r$.address.$error }"
              placeholder="Enter address"
              v-model="formData.tab2.address"
              name="biz-address"
            />
            <div
              class="text-sm text-error"
              v-for="error of validation.tab2.r$.address.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Map URL (Optional)</label>
            <p class="text-sm">
              We need your exact business address for distance based search. Please: find your exact
              location on
              <NuxtLink to="https://map.google.com" external target="_blank">Google Maps</NuxtLink>.
              Then copy the URL and paste it below.
            </p>
            <input
              v-model="formData.tab2.map"
              type="url"
              name="map-url"
              placeholder="https://maps.google.com/..."
              class="form-item"
              :class="{ error: validation.tab2.r$.map.$error }"
            />
            <div
              class="text-sm text-error"
              v-for="error of validation.tab2.r$.map.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
          </div>
        </template>
        <button type="submit" class="sr-only">Next</button>
      </form>
      <form
        class="tab-page"
        @submit.prevent="nextTab"
        v-for="id in ['tab3']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8 text-center">
          <h3>Do You Serve Customers at Their Location?</h3>
          <p>
            If you provide services at customer locations (like home service or delivery), let
            customers know where you operate. This helps them understand if you can come to them.
          </p>
        </header>
        <div class="field">
          <label>Service area (optional)</label>
          <table class="table borderless">
            <tbody>
              <tr v-for="index in formData.tab3.coverage.length">
                <td class="w-full">
                  <input
                    type="text"
                    class="form-item w-full"
                    placeholder="Cities, neighborhoods, or regions you serve"
                    v-model="formData.tab3.coverage[index - 1]"
                    name="service-area"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    @click="formData.tab3.coverage.splice(index - 1, 1)"
                    v-tooltip:aria.unblocking
                    aria-label="Remove coverage area"
                    class="text-sm circular outlined icon button"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div
                    class="text-sm text-error text-center mb-3"
                    v-for="error of validation.tab3.r$.coverage.$self.$errors"
                    :key="error"
                  >
                    <Icon name="material-symbols:error-rounded" /> {{ error }}
                  </div>
                  <button
                    type="button"
                    @click="
                      (formData.tab3.coverage.push(''),
                      nextTick(() =>
                        (
                          [...utils.document().querySelectorAll('input[name=service-area]')].slice(
                            -1,
                          )[0] as HTMLElement
                        )?.focus(),
                      ))
                    "
                    class="compact button w-full"
                    v-tooltip:aria.unblocking
                    aria-label="Add coverage area"
                  >
                    <Icon name="material-symbols:add-rounded" /> Add coverage area
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="submit" class="sr-only">Next</button>
      </form>
      <form
        class="tab-page"
        @submit.prevent="nextTab"
        v-for="id in ['tab4']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8 text-center">
          <h3>Add Contact Information</h3>
          <p>
            Help customers connect with you easily! Add at least a phone number or email address.
            This information will be prominently displayed on your Business Profile.
          </p>
        </header>
        <div class="field">
          <label>Phone number</label>
          <input
            v-model="formData.tab4.telephone"
            placeholder="Enter your business telephone number"
            type="tel"
            name="telephone"
            class="form-item"
            :class="{ error: validation.tab4.r$.telephone.$error }"
          />
          <div
            class="text-sm text-error"
            v-for="error of validation.tab4.r$.telephone.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" /> {{ error }}
          </div>
        </div>
        <div class="field">
          <label>Email</label>
          <input
            v-model="formData.tab4.email"
            placeholder="Enter your business email address"
            type="email"
            name="email"
            class="form-item"
            :class="{ error: validation.tab4.r$.email.$error }"
          />
          <div
            class="text-sm text-error"
            v-for="error of validation.tab4.r$.email.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" /> {{ error }}
          </div>
        </div>
        <button type="submit" class="sr-only">Next</button>
      </form>
      <form
        class="tab-page"
        @submit.prevent="nextTab"
        v-for="id in ['tab5']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8 text-center">
          <h3>Set Your Business Hours</h3>
          <p class="">Enter your regular business hours so customers know when to reach you.</p>
        </header>
        <div class="field">
          <p class="text-sm">
            You can start by selecting a preset for your availability and then adjust exception days
            after.
          </p>
          <LimbDropdown :options="{ directionPriority: { x: 'center' } }" class="compact button"
            >Choose preset
          </LimbDropdown>
          <div class="drop menu">
            <div @click="applyHoursPreset('nil')" class="item">Not available</div>
            <div @click="applyHoursPreset('always')" class="item">Always open</div>
            <div @click="applyHoursPreset('selected')" class="item">Open for selected hours</div>
            <div @click="applyHoursPreset('appointment')" class="item">Appointments only</div>
          </div>
        </div>
        <div class="field">
          <div v-for="item in validation.tab5.r$.hours.$each" class="field border-b p-2">
            <div class="flex gap-4 justify-between items-center">
              <label>{{ item.day.$value }}</label>
              <LimbDropdown
                type="select"
                class="lined"
                v-model="item.avail.$value"
                :name="`${item.day.$value}-avail`"
                @change="item.hours.$self.$touch()"
              ></LimbDropdown>
              <div class="drop menu">
                <div class="item" data-value="nil">Not available</div>
                <div class="item" data-value="always">Always open</div>
                <div class="item" data-value="selected">Open for selected hours</div>
                <div class="item" data-value="appointment">Appointments only</div>
              </div>
            </div>
            <div
              class="text-sm text-error text-center"
              v-for="error of item.hours.$self.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" /> {{ error }}
            </div>
            <div v-if="item.avail.$value === 'selected'" class="flex justify-between items-start">
              <div>
                <input
                  v-model="item.hours.opening.$value"
                  type="time"
                  class="compact lined form-item"
                  :class="{
                    error: item.hours.opening.$error || item.hours.$self.$error,
                  }"
                />
                <div
                  class="text-sm text-error"
                  v-for="error of item.hours.opening.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" /> {{ error }}
                </div>
              </div>
              <div class="flex flex-col items-end">
                <input
                  v-model="item.hours.closing.$value"
                  type="time"
                  class="compact lined form-item"
                  :class="{
                    error: item.hours.closing.$error || item.hours.$self.$error,
                  }"
                />
                <div
                  class="text-sm text-error"
                  v-for="error of item.hours.closing.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" /> {{ error }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="sr-only">Next</button>
      </form>
      <form
        class="tab-page"
        @submit.prevent="nextTab"
        v-for="id in ['tab6']"
        :class="currentTab === id ? 'active' : ''"
      >
        <header class="mb-8 text-center">
          <h3 class="text-center">Add More Details</h3>
          <p>
            Tell customers about your business. This descriptions will appear on your Business
            Profile and help them understand what you offer.
          </p>
        </header>
        <div class="field">
          <label>Business description</label>
          <textarea
            v-model="formData.tab6.description"
            class="form-item"
            placeholder="What does your business do?"
          ></textarea>
          <div
            class="text-sm text-error"
            v-for="error of validation.tab6.r$.description.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" /> {{ error }}
          </div>
        </div>
        <button type="submit" class="sr-only">Next</button>
      </form>
    </div>
    <footer
      class="sticky bg-surface p-4 pin-bottom-blend z-level-1 mt-12 bottom-0"
      style="bottom: 0px; margin-top: 0.5rem"
    >
      <div v-if="currentTab === 'tab1'" class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our <a href="">Terms of Service</a> and
          <a href="">Privacy Policy</a>.
        </p>
        <button
          class="primary button"
          :class="{ loading: loaders.nextSection }"
          :disabled="loaders.nextSection"
          @click="nextTab"
        >
          Continue
        </button>
      </div>
      <div v-else class="flex justify-between items-center gap-3">
        <span class="text-muted">
          {{ Object.keys(formData).indexOf(currentTab) + 1 }} of
          {{ Object.keys(formData).length }}
        </span>
        <div class="flex gap-3">
          <button @click="prevTab" class="flat button">Previous</button>
          <button
            @click="nextTab"
            :disabled="loaders.nextSection"
            class="primary button"
            :class="{ loading: loaders.nextSection }"
          >
            {{ currentTab === Object.keys(formData).pop() ? "Finish" : "Next" }}
          </button>
        </div>
      </div>
    </footer>
  </div>
  <LimbModal id="upload-status" :options="{ closeOnEsc: false, closeOnWrapperClick: false }">
    <div class="dialog centered max-w-125">
      <div class="content">
        <div v-if="progress.completed" class="flex flex-col items-center gap-3">
          <Icon
            name="material-symbols:check-circle-outline-rounded"
            class="text-success text-5xl"
          />
          <p class="text-center m-0">You business profile is successfully created on Bizworld!</p>
          <div class="flex gap-4 w-full *:flex-1">
            <NuxtLink
              :to="{
                name: 'manage-biz-overview',
                params: { slug: progress.message },
              }"
              class="exit-modal primary button"
            >
              Manage Business
            </NuxtLink>
            <NuxtLink to="/myshops" class="exit-modal outlined button"> My shops </NuxtLink>
          </div>
        </div>
        <div v-else class="flex flex-col items-center gap-4">
          <div
            class="m3-progress"
            :class="{ indeterminate: !progress.loaded }"
            :style="{ '--progress': progress.loaded?.toString() || '0' }"
          ></div>
          <p>{{ progress.message }}</p>
        </div>
      </div>
    </div>
  </LimbModal>
</template>
