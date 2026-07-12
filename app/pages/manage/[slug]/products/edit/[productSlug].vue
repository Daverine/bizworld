<script lang="ts" setup>
import type { Maybe } from "@regle/core";
import { url, required, requiredIf } from "@regle/rules";
import { useSortable } from "@vueuse/integrations/useSortable";

definePageMeta({
  name: "edit-product",
  layout: "details",
  auth: { only: "user" },
  noCart: true,
});

const route = useRoute();
const { data: product } = await useFetch("/api/product/query", {
  query: { slug: route.params.productSlug },
});

const editable = reactive<{
  category?: string;
  new_category?: string;
  photos: (File | string)[];
  video_link?: string;
  base_price?: string;
  base_promo_price?: string;
  option_group?: {
    title: string;
    options: {
      label: string;
      price?: string;
      promo_price?: string;
      photo?: File | string;
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
    options: { label: string; price?: string; promo_price?: string; photo?: File | string }[];
  };
  specifications: {
    name: string;
    value: string;
  }[];
  overview?: string;
  details_attachment?: File | string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
}>({
  photos: [],
  specifications: [],
});
const placeholder = reactive<{
  option: {
    label: string;
    price?: string;
    promo_price?: string;
    photo?: File | string;
    sub_options?: {
      is_active: boolean;
      label: string;
      price?: string;
      promo_price?: string;
      price_changed?: boolean;
      promo_price_changed?: boolean;
    }[];
  };
  modifyingOption: boolean;
  location: {
    country: string;
    state: string;
    city: string;
  };
  priceOption: boolean;
  optionPriceOption: boolean;
}>({
  option: {
    label: "",
  },
  modifyingOption: false,
  location: {
    country: "",
    state: "",
    city: "",
  },
  priceOption: false,
  optionPriceOption: false,
});
const validation = {
  editable: useRegle(editable, {
    category: {
      required: withMessage(required, "Product category is required."),
    },
    new_category: {
      required: withMessage(
        requiredIf(() => editable.category === "others"),
        "New category name is required.",
      ),
    },
    photos: {
      $rewardEarly: true,
      minLength: withMessage(
        (value) => (value as []).length > 1,
        "At least two product photos are required.",
      ),
      size: withMessage(
        (value: Maybe<(File | string)[]>) =>
          !(value && value.some((el) => typeof el !== "string" && el.size >= 5 * 1024 * 1024)),
        "Each photo must be less than 5MB in size.",
      ),
    },
    video_link: { url },
    base_price: {
      required: withMessage(
        (value: Maybe<string>) => Number(value) > 0,
        "A base price must be specified for the product.",
      ),
      lowestInOptions: withMessage((value: Maybe<string>) => {
        if (!editable.option_group) return true;
        let lowestOptionPrice = Math.min(
          ...editable.option_group.options.map((option) => Number(option.price) || Infinity),
          ...(editable.option_group.options.some((option) => option.sub_options)
            ? editable.option_group.options.flatMap(
                (option) =>
                  option.sub_options?.map((sub_option) => Number(sub_option.price) || Infinity) ||
                  [],
              )
            : []),
        );
        if (isFinite(lowestOptionPrice)) return Number(value) <= lowestOptionPrice;
        return true;
      }, "Base price must be less than or equal to the lowest option price."),
    },
    base_promo_price: {
      lessThanBasePrice: withMessage((value: Maybe<string>) => {
        if (value === undefined || value === null) return true;
        if (Number(value) <= 0) return false;
        if (editable.base_price === undefined) return true;
        return Number(value) < Number(editable.base_price);
      }, "Promotional price must be less than the base price."),
    },
    option_group: {
      title: {
        required: withMessage(
          requiredIf(() => utils.isObject(editable.option_group)),
          "A title must be specified for this option group.",
        ),
      },
      options: {
        $rewardEarly: true,
        minLength: withMessage(
          (value) => !utils.isObject(editable.option_group) || (value as []).length > 1,
          "At least two option must be added here.",
        ),
      },
    },
    sub_option_group: {
      title: {
        required: withMessage(
          requiredIf(() => utils.isObject(editable.sub_option_group)),
          "A title must be specified for this option group.",
        ),
      },
      options: {
        $rewardEarly: true,
        minLength: withMessage(
          (value) => !utils.isObject(editable.sub_option_group) || (value as []).length > 1,
          "At least two option must be added here.",
        ),
      },
    },
    specifications: {
      $rewardEarly: true,
      minLength: withMessage(
        (value) => (value as []).length > 1,
        "At least two product specifications are required.",
      ),
      $each: {
        name: { required },
        value: { required },
      },
    },
    overview: {
      required: withMessage(required, "Product overview is required."),
    },
    details_attachment: {
      maxSize: withMessage(
        maxFileSize(5 * 1024 * 1024),
        "Selected document must be less than 5MB in size.",
      ),
    },
  }),
  option: useRegle(placeholder.option, {
    label: {
      required: withMessage(required, "A unique label must be specified for this option."),
      unique: withMessage((value) => {
        let existsInMain =
          editable.option_group?.options.some((option) => option.label === value) ?? false;
        let existsInSub =
          editable.sub_option_group?.options.some((option) => option.label === value) ?? false;
        return (!existsInMain && !existsInSub) || placeholder.modifyingOption;
      }, "An option with this label already exists."),
    },
    promo_price: {
      lessThanPrice: withMessage((value: Maybe<string>) => {
        if (value === undefined || value === null) return true;
        if (Number(value) <= 0) return false;
        if (placeholder.option.price === undefined) return true;
        return Number(value) < Number(placeholder.option.price);
      }, "Promotional price must be less than the base price."),
    },
    photo: {
      maxSize: withMessage(
        maxFileSize(5 * 1024 * 1024),
        "Selected photo must be less than 5MB in size.",
      ),
    },
    sub_options: {
      $each: (sub_option) => ({
        promo_price: {
          lessThanPrice: withMessage((value: Maybe<string>) => {
            if (value === undefined || value === null) return true;
            if (!sub_option.value.is_active) return true;
            if (Number(value) <= 0) return false;
            if (sub_option.value.price === undefined) return true;
            return Number(value) < Number(sub_option.value.price);
          }, "Promotional price must be less than the base price."),
        },
      }),
    },
  }),
  location: useRegle(placeholder.location, {
    country: { required },
    state: { required },
    city: { required },
  }),
};
const productCategories = {
  "Computers & Accessories": [
    "Brand",
    "Model",
    "Condition",
    "Processor",
    "RAM",
    "Storage",
    "Display Size",
    "Battery Life",
    "Operating System",
    "Connectivity",
    "Camera",
    "Weight",
    "Dimensions",
  ],
  "Phones & Tablets": [
    "Brand",
    "Model",
    "Condition",
    "Processor",
    "RAM",
    "Storage",
    "Display Size",
    "Battery Life",
    "Operating System",
    "Connectivity",
    "Camera",
    "Weight",
    "Dimensions",
  ],
  "Home Appliances": [
    "Brand",
    "Model",
    "Condition",
    "Power Consumption",
    "Capacity",
    "Dimensions",
    "Weight",
    "Color",
    "Material",
  ],
  "Fashion & Beauty": [
    "Brand",
    "Material",
    "Size",
    "Color",
    "Fit Type",
    "Care Instructions",
    "Pattern",
    "Sleeve Length",
    "Neckline",
  ],
  "Sports & Fitness": ["Brand", "Type", "Material", "Size/Dimensions", "Weight", "Color"],
  "Books & Stationery": ["Author", "Publisher", "ISBN", "Language", "Pages", "Genre"],
  Automotive: [
    "Make",
    "Model",
    "Year",
    "Mileage",
    "Condition",
    "Engine Type",
    "Transmission",
    "Fuel Type",
    "Color",
  ],
  "Health & Wellness": [
    "Brand",
    "Type",
    "Ingredients/Materials",
    "Size/Dimensions",
    "Weight",
    "Usage Instructions",
  ],
};
const progress = ref<{
  message: string;
  loaded?: number;
  completed: boolean | null;
}>({
  message: "",
  completed: false,
});

function handleNewPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    [...input.files].forEach((file) => editable.photos.push(file));
    input.value = "";
    nextTick(() => input.scrollIntoView({ behavior: "smooth", block: "center" }));
  }
}
async function createNewProductOption() {
  if (editable.option_group) {
    editable.sub_option_group = {
      title: "",
      options: [],
    };
    await nextTick();
    validation.editable.r$.sub_option_group.$reset();
    document.getElementById("sub-option-group-title")?.focus();
    document
      .getElementById("sub-option-group-title")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    editable.option_group = {
      title: "",
      options: [],
    };
    await nextTick();
    validation.editable.r$.option_group.$reset();
    document.getElementById("option-group-title")?.focus();
    document
      .getElementById("option-group-title")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
async function configProductOption({ settings }: DialogEvent) {
  let caller = settings.caller!;
  let callergroup = caller.hasAttribute("data-sub-category") ? "sub" : "main";

  if (caller.dataset.optionId !== undefined) {
    let optionId = parseInt(caller.dataset.optionId);
    const option =
      callergroup === "sub"
        ? editable.sub_option_group?.options[optionId]
        : editable.option_group?.options[optionId];
    if (option) {
      placeholder.modifyingOption = true;
      placeholder.option = { ...option };
    }
  } else {
    placeholder.modifyingOption = false;
    placeholder.option = {
      label: "",
    };
  }
  await nextTick();
  validation.option.r$.$reset();
}
function processProductOption({ settings, exit }: Dialoger) {
  validation.option.r$.$validate();
  if (validation.option.r$.$invalid) return;

  let caller = settings.caller!;
  let callergroup = caller.hasAttribute("data-sub-category") ? "sub" : "main";

  if (caller.dataset.optionId !== undefined) {
    const optionId = parseInt(caller.dataset.optionId);
    if (callergroup === "sub") {
      if (editable.sub_option_group?.options[optionId]) {
        if (placeholder.option.label.trim())
          editable.sub_option_group.options[optionId] = {
            ...placeholder.option,
          };
        else editable.sub_option_group.options.splice(optionId, 1);
      }
    } else if (callergroup === "main") {
      if (editable.option_group?.options[optionId]) {
        if (placeholder.option.label.trim())
          editable.option_group.options[optionId] = {
            ...placeholder.option,
          };
        else editable.option_group.options.splice(optionId, 1);
      }
    }
  } else if (placeholder.option.label.trim()) {
    if (callergroup === "sub")
      editable.sub_option_group?.options.push({
        ...placeholder.option,
      });
    else if (callergroup === "main") editable.option_group?.options.push({ ...placeholder.option });
  }

  validation.editable.r$.base_price.$touch();
  exit();
}
function addSpecification(template?: string[]) {
  if (template) {
    editable.specifications = template.map((spec) => ({
      name: spec,
      value: "",
    }));
    nextTick(() =>
      (
        document.querySelector(
          "#spec-table > tbody > tr:first-child > td:nth-child(2) input",
        ) as HTMLInputElement
      )?.focus(),
    );
  } else {
    editable.specifications.push({ name: "", value: "" });
    nextTick(() =>
      (
        document.querySelector(
          "#spec-table > tbody > tr:last-child > td:first-child input",
        ) as HTMLInputElement
      )?.focus(),
    );
  }
}
function setLocation({ exit }: Dialoger) {
  validation.location.r$.$validate();
  if (validation.location.r$.$invalid) return;

  editable.location = placeholder.location;
  exit();
}
function clearLocation({ exit }: Dialoger) {
  delete editable.location;
  placeholder.location = {
    country: "",
    state: "",
    city: "",
  };
  validation.location.r$.$reset();
  exit();
}
async function nextTab() {
  await validation.editable.r$.$validate();

  if (validation.editable.r$.$invalid) {
    await nextTick();
    (document.querySelector("#edit-product .error, .field .text-error") as HTMLElement)?.focus();
    document
      .querySelector("#edit-product .error, .field .text-error")
      ?.closest(".field")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  progress.value.loaded = undefined;
  progress.value.message = "Preparing your product for upload...";

  let uploader = document.querySelector("#upload-status");
  if (!uploader!.classList.contains("active")) {
    utils.triggerEvent(uploader!, "dgconsole", "open dialog");
    await utils.notifyOnEvent(uploader!, "isReady");
  }

  if (progress.value.completed) return;

  progress.value.completed = false;

  try {
    // check if files have be uploaded before
    if (
      editable.photos.some((photo) => typeof photo !== "string") ||
      (editable.option_group &&
        editable.option_group.options.some(({ photo }) => photo && typeof photo !== "string")) ||
      (editable.sub_option_group &&
        editable.sub_option_group.options.some(
          ({ photo }) => photo && typeof photo !== "string",
        )) ||
      (editable.details_attachment && typeof editable.details_attachment !== "string")
    ) {
      const filesData = new FormData();
      editable.photos.forEach((photo, index) => {
        if (typeof photo === "string") return;
        filesData.append("photos", photo, index.toString());
      });
      editable.option_group?.options.forEach((option, index) => {
        if (option.photo && typeof option.photo !== "string")
          filesData.append("option_group", option.photo, index.toString());
      });
      editable.sub_option_group?.options.forEach((option, index) => {
        if (option.photo && typeof option.photo !== "string")
          filesData.append("sub_option_group", option.photo, index.toString());
      });
      if (editable.details_attachment && typeof editable.details_attachment !== "string") {
        filesData.append("details_attachment", editable.details_attachment);
      }

      progress.value.loaded = undefined;
      progress.value.message = "Uploading product files...";

      const uploads = await $fetch("/api/file-upload", {
        query: { upload_dir: route.params.slug, image_width: 900 },
        body: filesData,
        method: "post",
      });

      if ("photos" in uploads) {
        uploads.photos.forEach((elem) => {
          editable.photos[parseInt(elem.filename)] = elem.data;
        });
      }
      if ("option_group" in uploads) {
        uploads.option_group.forEach((elem) => {
          editable.option_group!.options[parseInt(elem.filename)]!.photo = elem.data;
        });
      }
      if ("sub_option_group" in uploads) {
        uploads.sub_option_group.forEach((elem) => {
          editable.sub_option_group!.options[parseInt(elem.filename)]!.photo = elem.data;
        });
      }
      if ("details_attachment" in uploads) {
        editable.details_attachment = uploads.details_attachment[0]?.data;
      }
    }
    progress.value.loaded = undefined;
    progress.value.message = "Saving changes to product...";

    const edits = {
      ...structuredClone(toRaw(editable)),
    };

    await $fetch("/api/product/update", {
      method: "patch",
      query: {
        id: product.value!.id,
        action: "edit",
      },
      body: edits,
    });

    progress.value.loaded = undefined;
    progress.value.message = "Done";
    await nextTick();
    progress.value.completed = true;
  } catch (error) {
    progress.value.completed = null;
    console.error("Product update failed", error);
    return;
  }
}
function reset() {
  if (product.value) {
    if (product.value?.category.includes("others:")) {
      editable.category = "others";
      editable.new_category = product.value.category.replace("others:", "");
    } else {
      editable.category = product.value.category;
      editable.new_category = undefined;
    }
    editable.photos = product.value.photos;
    editable.video_link = product.value.video_link;
    editable.base_price = product.value.base_price;
    editable.base_promo_price = product.value.base_promo_price;
    editable.option_group = product.value.option_group;
    editable.sub_option_group = product.value.sub_option_group;
    editable.specifications = product.value.specifications;
    editable.overview = product.value.overview;
    editable.details_attachment = product.value.details_attachment;
    editable.location = product.value.location;
    if (product.value.location) placeholder.location = product.value.location;
  }
}

onMounted(() => reset());
watchEffect(() => {
  if (editable.sub_option_group?.options === undefined && editable.option_group) {
    editable.option_group.options.forEach((option) => {
      option.sub_options = undefined;
    });
  } else if (editable.option_group) {
    editable.option_group.options.forEach((option) => {
      option.sub_options = option.sub_options || [];
      let newMap = editable.sub_option_group?.options.map((el, index) => ({
        is_active:
          option.sub_options![index]?.label === el.label
            ? option.sub_options![index].is_active
            : true,
        label: el.label,
        price:
          option.sub_options![index]?.label === el.label &&
          option.sub_options![index]?.price_changed
            ? option.sub_options![index]!.price
            : el.price,
        promo_price:
          option.sub_options![index]?.label === el.label &&
          option.sub_options![index]?.promo_price_changed
            ? option.sub_options![index]!.promo_price
            : el.promo_price,
        price_changed: option.sub_options![index]?.price_changed,
        promo_price_changed: option.sub_options![index]?.promo_price_changed,
      }));

      option.sub_options = newMap;
    });
  }
});
useSortable("#prodPhotos > .scroll-items", editable.photos);
</script>

<template>
  <div v-if="product" class="auto-contain flex max-w-180 flex-1 flex-col">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 self-pointer-none mb-4 min-h-23 [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 bg-surface pin-top-blend m-0 flex items-end justify-between gap-3 transition-[font-size] duration-200"
      >
        Edit product
        <NuxtLink
          :to="{
            name: 'manage-biz-products',
            params: { slug: $route.params.slug },
          }"
          class="compact button text-sm"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
          <span class="content max-sm:hidden">Back</span>
        </NuxtLink>
      </div>
    </header>
    <form id="edit-product" @submit.prevent="nextTab" class="auto-contain no-edge max-w-lg flex-1">
      <div class="field">
        <label for="prod-category">Product category</label>
        <p class="text-sm opacity-65">
          Choose a category from the dropdown below that best fits the product you're adding. You
          can also select “Others” from the dropdown to make a new one.
        </p>
        <LimbDropdown
          v-model="editable.category"
          type="search select"
          :class="{ error: validation.editable.r$.category.$error }"
          @change="
            $event !== 'others' ||
            nextTick(() => utils.document().getElementById('prod-category-new')?.focus())
          "
          id="prod-category"
          placeholder="Select category"
        >
          <div class="drop menu">
            <div class="item" v-for="category in Object.keys(productCategories)">
              {{ category }}
            </div>
            <div data-value="others" class="item">Others</div>
          </div>
        </LimbDropdown>
        <div
          class="text-error text-sm"
          v-for="error of validation.editable.r$.category.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <div v-if="editable.category === 'others'" class="field">
          <label for="prod-category-new">New category name</label>
          <div class="text-sm opacity-65">
            Note: Your product will remain in the “Others” category in Explore until the new
            category is reviewed and standardized.
          </div>
          <input
            v-model="editable.new_category"
            id="prod-category-new"
            class="form-item"
            :class="{ error: validation.editable.r$.new_category.$error }"
            type="text"
            placeholder="Category name"
          />
          <div
            class="text-error text-sm"
            v-for="error of validation.editable.r$.new_category.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" />
            {{ error }}
          </div>
        </div>
      </div>
      <div class="field">
        <label for="prod-title">Title</label>
        <div class="text-sm opacity-65">
          It should be as descriptive and unique as possible. Include brand name, model, and key
          features.
        </div>
        <input
          v-model="product.title"
          id="prod-title"
          class="form-item"
          readonly
          type="text"
          placeholder="Product title"
        />
      </div>
      <div class="field">
        <label>Add photo</label>
        <div class="text-sm opacity-65">
          Photos help customers see the product. Use clear, well-lit images that showcase the
          product from different angles. A photo can be dragged to re-order it.
        </div>
        <LimbIScroller
          id="prodPhotos"
          :options="{ autoSetup: true }"
          class="[&_.sortable-ghost]:opacity-0"
        >
          <div
            v-for="(photo, index) in editable.photos"
            class="relative flex flex-col items-center"
          >
            <img :src="utils.fileToURL(photo)" alt="Product photo" class="thumbnail" />
            <button
              type="button"
              @click="editable.photos.splice(index, 1)"
              class="compact circular outlined button bg-overlay absolute top-1 right-1 text-xs"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div v-if="typeof photo !== 'string'" class="text-sm">
              {{ (photo.size / 1024 / 1024).toFixed(1) }}MB
            </div>
          </div>
        </LimbIScroller>
        <div
          class="text-error text-sm"
          v-for="error in validation.editable.r$.photos.$self.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <label class="icon button design-takeover">
          <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
            editable.photos.length ? "Add more photos" : "Add photos"
          }}
          <input type="file" multiple @change="handleNewPhoto" accept="image/*" />
        </label>
      </div>
      <div class="field">
        <label>Link to YouTube or Facebook video</label>
        <input
          v-model="editable.video_link"
          id="prod-video"
          class="form-item"
          :class="{ error: validation.editable.r$.video_link.$error }"
          type="text"
          placeholder="e.g. https://youtube.com/..."
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.editable.r$.video_link.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label for="prod-price">Price</label>
        <div class="text-sm opacity-65">
          If there are product options, the price here should be the lowest option price. Price can
          also be set with product options.
        </div>
        <LimbCurrencyInput
          v-model="editable.base_price"
          @input="validation.editable.r$.base_promo_price.$touch"
          id="prod-price"
          class="form-item"
          :class="{ error: validation.editable.r$.base_price.$error }"
          placeholder="Product price"
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.editable.r$.base_price.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <button
          v-if="!placeholder.priceOption && !editable.base_promo_price"
          type="button"
          @click="
            () => {
              placeholder.priceOption = true;
              nextTick(() => {
                utils.document().getElementById('base-promo-price')?.focus();
              });
            }
          "
          class="text-primary text-left hover:underline"
        >
          More pricing options
        </button>
        <div v-else class="field">
          <label>Promotional price (optional)</label>
          <p class="text-sm opacity-65">
            You can optionally add a promo price for this product. This price is shown when promo is
            enabled.
          </p>
          <LimbCurrencyInput
            v-model="editable.base_promo_price"
            id="base-promo-price"
            class="form-item"
            :class="{ error: validation.editable.r$.base_promo_price.$error }"
            placeholder="Product promo price"
          />
          <div
            class="text-error text-sm"
            v-for="error of validation.editable.r$.base_promo_price.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" />
            {{ error }}
          </div>
        </div>
      </div>
      <div class="field">
        <label>Product options</label>
        <div class="text-sm opacity-65">
          Product options are variations of the product, such as color, size, or configuration. You
          can add a maximum of two option groups.
        </div>
        <button
          type="button"
          v-if="!editable.option_group"
          @click="createNewProductOption"
          class="compact button"
        >
          Add an option group
        </button>
        <template v-else>
          <fieldset class="flex flex-col gap-2">
            <button
              type="button"
              @click="
                ((editable.option_group = undefined), (editable.sub_option_group = undefined))
              "
              v-tooltip:aria.unblocking
              aria-label="Remove option group"
              class="circular icon button ml-auto bg-transparent text-sm"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div class="field">
              <label>Option group title</label>
              <input
                v-model="editable.option_group.title"
                class="form-item"
                :class="{
                  error: validation.editable.r$.option_group.title.$error,
                }"
                id="option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
              <div
                class="text-error text-sm"
                v-for="error of validation.editable.r$.option_group.title.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
              <div class="lined sub heading a-block px-3">
                Add options below for:
                <div class="trailing">
                  {{ editable.option_group.title }}
                </div>
              </div>
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in editable.option_group.options"
                  class="item open-modal"
                  data-target="app-option"
                  :data-option-id="index"
                  v-tooltip:aria.unblocking
                  aria-label="Click to modify"
                >
                  <img
                    v-if="option.photo"
                    :src="utils.fileToURL(option.photo)"
                    alt="Option photo"
                  />
                  <div class="content">
                    <div class="font-bold">{{ option.label }}</div>
                    <div v-if="option.price" class="text-primary font-bold">
                      ₦{{ option.price.toLocaleString() }}
                    </div>
                    <div v-if="option.promo_price" class="text-success font-bold">
                      ₦{{ option.promo_price.toLocaleString() }}
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="editable.option_group.options.splice(index, 1)"
                    class="circular trailing icon button ex-open-modal text-sm"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </div>
                <button type="button" class="button as-app open-modal" data-target="app-option">
                  <Icon class="text-xl" name="material-symbols:add" />
                  Add option
                </button>
              </div>
              <div
                class="text-error text-sm"
                v-for="error of validation.editable.r$.option_group.options.$self?.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
            </div>
          </fieldset>
          <div class="field">
            <label>Product sub-option</label>
            <div class="text-sm opacity-65">
              <p>
                A sub-option group can also be added if necessary. For example, if your main option
                group is "Size," your sub-option group could be "Colour." This enables customers to
                select a combination of size and colour for the product.
              </p>
              <p>
                Sub-options can only be added if there are options in the main option group.
                Sub-options can also be customized for each option in the main option group.
              </p>
            </div>
            <button
              type="button"
              v-if="!editable.sub_option_group"
              @click="createNewProductOption"
              class="compact button"
            >
              Add a sub-option group
            </button>
            <fieldset v-else class="flex flex-col gap-2">
              <button
                type="button"
                @click="editable.sub_option_group = undefined"
                v-tooltip:aria.unblocking
                aria-label="Remove sub-option group"
                class="circular icon button ml-auto bg-transparent text-sm"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div class="field">
                <label>Sub-option group title</label>
                <input
                  v-model="editable.sub_option_group.title"
                  class="form-item"
                  :class="{
                    error: validation.editable.r$.sub_option_group.title.$error,
                  }"
                  id="sub-option-group-title"
                  type="text"
                  placeholder="e.g. Color, Size, etc."
                />
                <div
                  class="text-error text-sm"
                  v-for="error of validation.editable.r$.sub_option_group.title.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
                <div class="lined sub heading a-block px-3">
                  Add options below for:
                  <div class="trailing">
                    {{ editable.sub_option_group.title }}
                  </div>
                </div>
                <div class="wrappable menu">
                  <div
                    v-for="(option, index) in editable.sub_option_group.options"
                    class="item open-modal"
                    data-target="app-option"
                    data-sub-category
                    :data-option-id="index"
                  >
                    <img
                      v-if="option.photo"
                      :src="utils.fileToURL(option.photo)"
                      alt="sub-option photo"
                    />
                    <div class="content">
                      <div class="font-bold">{{ option.label }}</div>
                      <div v-if="option.price" class="text-primary font-bold">
                        ₦{{ option.price.toLocaleString() }}
                      </div>
                      <div v-if="option.promo_price" class="text-success font-bold">
                        ₦{{ option.promo_price.toLocaleString() }}
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="editable.sub_option_group.options.splice(index, 1)"
                      class="circular trailing icon button ex-open-modal text-sm"
                    >
                      <Icon name="material-symbols:delete-outline-rounded" />
                    </button>
                  </div>
                  <button
                    type="button"
                    class="button as-app open-modal"
                    data-sub-category
                    data-target="app-option"
                  >
                    <Icon class="text-xl" name="material-symbols:add" />
                    Add option
                  </button>
                </div>
                <div
                  class="text-error text-sm"
                  v-for="error of validation.editable.r$.sub_option_group.options.$self?.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
              </div>
            </fieldset>
          </div>
        </template>
      </div>
      <div class="field">
        <label>Product Specifications</label>
        <div class="text-sm opacity-65">
          <p>
            Product specifications provide detailed information about the product's features,
            dimensions, materials, and other relevant details that help customers make informed
            purchasing decisions.
          </p>
          <p>
            You can add as many specifications as you want. Just click on the "Add specification"
            button below.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span>Or start by selecting a preset:</span>
          <LimbDropdown class="compact button" placeholder="Select a template">
            Choose Preset
            <div class="drop menu">
              <div
                class="item"
                v-for="(template, templateName) in productCategories"
                @click="addSpecification(template)"
              >
                {{ templateName }}
              </div>
            </div>
          </LimbDropdown>
        </div>
        <table id="spec-table" class="basic table align-top">
          <thead>
            <tr>
              <th>Specification</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(spec, index) in validation.editable.r$.specifications.$each">
              <td>
                <div class="field m-0">
                  <input
                    v-model="spec.name.$value"
                    :id="`spec-name${index}`"
                    class="form-item w-full"
                    :class="{ error: spec.name.$error }"
                    type="text"
                    placeholder="Specification name"
                  />
                  <div class="text-error text-sm" v-for="error of spec.name.$errors" :key="error">
                    <Icon name="material-symbols:error-rounded" />
                    {{ error }}
                  </div>
                </div>
              </td>
              <td>
                <div class="field m-0">
                  <input
                    v-model="spec.value.$value"
                    :id="`spec-value${index}`"
                    class="form-item w-full"
                    :class="{ error: spec.value.$error }"
                    type="text"
                    placeholder="Specification value"
                  />
                  <div class="text-error text-sm" v-for="error of spec.value.$errors" :key="error">
                    <Icon name="material-symbols:error-rounded" />
                    {{ error }}
                  </div>
                </div>
              </td>
              <td class="text-center">
                <button
                  type="button"
                  @click="editable.specifications.splice(index, 1)"
                  v-tooltip:aria.unblocking
                  aria-label="Remove specification"
                  class="circular outlined icon button text-sm"
                >
                  <Icon name="material-symbols:delete-outline-rounded" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">
                <div
                  class="text-error mb-3 text-center text-sm font-normal"
                  v-for="error of validation.editable.r$.specifications.$self.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
                <button type="button" @click="addSpecification()" class="compact button w-full">
                  <Icon name="material-symbols:add" /> Add specification
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="field">
        <label>Your review</label>
        <p class="text-sm opacity-65">
          Share your personal review of the product. Highlight its key features, benefits, and what
          makes it a great choice for customers. A compelling description can help buyers make an
          informed decision.
        </p>
        <textarea
          v-model="editable.overview"
          class="form-item"
          :class="{ error: validation.editable.r$.overview.$error }"
          rows="3"
          placeholder="Write your review here..."
        ></textarea>
        <div
          class="text-error text-sm"
          v-for="error of validation.editable.r$.overview.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label>Product details attachment (PDF)</label>
        <p class="text-sm opacity-65">
          You can also add a PDF attachment that contains detailed information about the product,
          such as a user manual, spec sheet, or brochure. This can provide customers with additional
          insights and help them make a more informed purchasing decision.
        </p>
        <div
          v-if="editable.details_attachment"
          class="relative mb-3 flex w-max flex-col items-center"
        >
          <Icon name="mdi:file-pdf-box" class="text-6xl text-red-500" />
          <button
            type="button"
            @click="editable.details_attachment = undefined"
            class="compact circular outlined button bg-overlay absolute top-1 right-1 text-xs"
          >
            <Icon name="material-symbols:close-rounded" />
          </button>
          <div v-if="typeof editable.details_attachment === 'string'" class="text-sm">
            {{ editable.details_attachment.split("/").slice(-1)[0] }}
          </div>
          <template v-else>
            <div class="text-sm">{{ editable.details_attachment.name }}</div>
            <div class="text-sm">
              {{ (editable.details_attachment.size / 1024 / 1024).toFixed(1) }}MB
            </div>
          </template>
        </div>
        <label class="icon button design-takeover">
          <Icon name="material-symbols:picture-as-pdf-outline-rounded" />{{
            `${editable.details_attachment ? "Change attachment" : "Add attachment"}`
          }}
          <input
            type="file"
            @change="editable.details_attachment = ($event.target as HTMLInputElement).files?.[0]"
            accept="application/pdf, .pdf"
          />
        </label>
      </div>
      <div class="field">
        <label>Product location</label>
        <p class="text-sm opacity-65">
          Specify the location where the product is available. This information helps customers find
          products that are conveniently located for them. If not specified, your business location
          will be used instead.
        </p>
        <button
          v-if="!editable.location"
          type="button"
          class="compact button open-modal"
          data-target="prod-location"
        >
          Specify product location
        </button>
        <fieldset class="flex items-center justify-between" v-else>
          <div>
            <Icon name="material-symbols:pin-drop-outline-rounded" />
            {{
              `${editable.location?.city}, ${editable.location?.state}, ${editable.location?.country}`
            }}
          </div>
          <button type="button" class="compact button open-modal" data-target="prod-location">
            Edit location
          </button>
        </fieldset>
      </div>
      <button type="submit" class="sr-only">Next</button>
    </form>
    <footer class="bg-surface pin-bottom-blend z-level-1 sticky bottom-0 mt-2 px-4 pt-4 pb-8">
      <div class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our
          <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
        </p>
        <button @click="nextTab" class="primary button">Save changes</button>
      </div>
    </footer>
    <LimbModal id="app-option" :options="{ controller: configProductOption }" v-slot="{ control }">
      <div class="dialog">
        <header class="flex gap-3 px-6 py-4">
          <div class="truncate font-bold">
            {{ placeholder.modifyingOption ? "Modify" : "Add" }} an option
          </div>
          <button type="button" class="circular flat button as-text exit-modal ml-auto">
            <Icon name="material-symbols:close-rounded" />
          </button>
        </header>
        <form class="px-6 py-4">
          <div class="field">
            <label>Label</label>
            <input
              v-model="placeholder.option.label"
              class="form-item"
              id="option-label"
              :class="{
                error: validation.option.r$.label.$error,
              }"
              md-autofocus
              type="text"
              placeholder="Option label"
            />
            <div
              class="text-error text-sm"
              v-for="error of validation.option.r$.label.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Price (optional)</label>
            <LimbCurrencyInput
              v-model="placeholder.option.price"
              @input="validation.option.r$.promo_price.$touch"
              id="option-price"
              class="form-item"
              placeholder="Option price"
            />
            <button
              v-if="!placeholder.optionPriceOption && !placeholder.option.promo_price"
              type="button"
              @click="
                () => {
                  placeholder.optionPriceOption = true;
                  nextTick(() => {
                    utils.document().getElementById('option-promo-price')?.focus();
                  });
                }
              "
              class="text-primary text-left hover:underline"
            >
              More pricing options
            </button>
            <div v-else class="field">
              <label>Promotional price (optional)</label>
              <p class="text-sm opacity-65">
                You can optionally add a promo price for this option. This price is shown when promo
                is enabled.
              </p>
              <LimbCurrencyInput
                v-model="placeholder.option.promo_price"
                id="option-promo-price"
                class="form-item"
                :class="{ error: validation.option.r$.promo_price.$error }"
                placeholder="Option promo price"
              />
              <div
                class="text-error text-sm"
                v-for="error of validation.option.r$.promo_price.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
            </div>
          </div>
          <div class="field">
            <label>Unique option picture (optional)</label>
            <div v-if="placeholder.option.photo" class="relative flex w-max flex-col items-center">
              <img
                :src="utils.fileToURL(placeholder.option.photo)"
                alt="Product photo"
                class="thumbnail"
              />
              <button
                type="button"
                @click="placeholder.option.photo = undefined"
                class="compact circular outlined button bg-overlay absolute top-1 right-1 text-xs"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div v-if="typeof placeholder.option.photo !== 'string'" class="text-sm">
                {{ (placeholder.option.photo.size / 1024 / 1024).toFixed(1) }}MB
              </div>
            </div>
            <div
              class="text-error text-sm"
              v-for="error of validation.option.r$.photo.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
            <label class="icon button design-takeover">
              <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
                `${placeholder.option.photo ? "Change photo" : "Add photo"}`
              }}
              <input
                type="file"
                @change="placeholder.option.photo = ($event.target as HTMLInputElement).files?.[0]"
                accept="image/*"
              />
            </label>
          </div>
          <div class="field items-end">
            <button
              type="submit"
              class="primary button"
              @click.prevent="processProductOption(control)"
            >
              {{ placeholder.modifyingOption ? "Modify" : "Add" }} option
            </button>
          </div>
          <div v-if="placeholder.option.sub_options" class="field">
            <label>sub-option group</label>
            <div class="text-sm opacity-65">
              Toggle the sub-option you want to add to this option. You can also click on the price
              to modify it.
            </div>
            <div v-if="editable.sub_option_group" class="wrappable menu">
              <div v-for="(option, index) in editable.sub_option_group.options" class="item">
                <div
                  class="icon"
                  :class="{
                    active: !!placeholder.option.sub_options[index]!.is_active,
                  }"
                  @click="
                    ((placeholder.option.sub_options![index]!.is_active =
                      !placeholder.option.sub_options![index]!.is_active),
                    validation.option.r$.sub_options.$each[index]!.promo_price.$touch())
                  "
                >
                  <Icon name="material-symbols:check-box-outline-blank" class="nview" />
                  <Icon name="material-symbols:check" class="aview" />
                </div>
                <img
                  v-if="option.photo"
                  :src="utils.fileToURL(option.photo)"
                  alt="sub-option photo"
                />
                <div class="content flex flex-col">
                  <div class="font-bold">{{ option.label }}</div>
                  <label class="text-primary"
                    >₦
                    <LimbCurrencyInput
                      v-model="placeholder.option.sub_options[index]!.price"
                      :id="`sub-option${index}-price`"
                      @input="
                        ((placeholder.option.sub_options![index]!.price_changed! =
                          $event.target.value !== option.price),
                        validation.option.r$.sub_options.$each[index]!.promo_price.$touch())
                      "
                      class="form-item text-fit text-primary"
                      placeholder="Add option price"
                    />
                  </label>
                  <label class="text-success"
                    >₦
                    <LimbCurrencyInput
                      v-model="placeholder.option.sub_options[index]!.promo_price"
                      :id="`sub-option${index}-promo-price`"
                      @input="
                        placeholder.option.sub_options![index]!.promo_price_changed! =
                          $event.target.value !== option.promo_price
                      "
                      class="form-item text-fit text-success"
                      :class="{
                        error: validation.option.r$.sub_options.$each[index]!.promo_price.$error,
                      }"
                      placeholder="Add option promo price"
                    />
                    <div
                      class="text-error text-sm"
                      v-for="error of validation.option.r$.sub_options.$each[index]!.promo_price
                        .$errors"
                      :key="error"
                    >
                      <Icon name="material-symbols:error-rounded" />
                      {{ error }}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </LimbModal>
    <LimbModal id="prod-location" v-slot="{ control }">
      <div class="dialog">
        <header class="flex gap-3 px-6 py-4">
          <div class="truncate font-bold">Add Location</div>
          <button type="button" class="circular flat button as-text exit-modal ml-auto">
            <Icon name="material-symbols:close-rounded" />
          </button>
        </header>
        <form class="px-6 py-4">
          <div class="field">
            <label>Country</label>
            <input
              v-model.trim="placeholder.location.country"
              class="form-item"
              :class="{ error: validation.location.r$.country.$error }"
              id="prod-location"
              type="text"
              placeholder="Enter country"
            />
            <div
              class="text-error text-sm"
              v-for="error of validation.location.r$.country.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>State</label>
            <input
              v-model.trim="placeholder.location.state"
              class="form-item"
              :class="{ error: validation.location.r$.state.$error }"
              id="prod-state"
              type="text"
              placeholder="Enter state"
            />
            <div
              class="text-error text-sm"
              v-for="error of validation.location.r$.state.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>City</label>
            <input
              v-model.trim="placeholder.location.city"
              class="form-item"
              :class="{ error: validation.location.r$.city.$error }"
              id="prod-city"
              type="text"
              placeholder="Enter city"
            />
            <div
              class="text-error text-sm"
              v-for="error of validation.location.r$.city.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="flex gap-4">
            <button
              type="button"
              @click.prevent="clearLocation(control)"
              class="compact button flex-1"
            >
              Clear Location
            </button>
            <button
              type="submit"
              @click.prevent="setLocation(control)"
              class="primary compact button flex-1"
            >
              Set Location
            </button>
          </div>
        </form>
      </div>
    </LimbModal>
    <LimbModal id="upload-status" :options="{ closeOnEsc: false, closeOnWrapperClick: false }">
      <div class="dialog centered max-w-125 p-6">
        <div v-if="progress.completed" class="flex flex-col items-center gap-3">
          <Icon
            name="material-symbols:check-circle-outline-rounded"
            class="text-success text-5xl"
          />
          <p class="m-0 text-center">Product added successfully!</p>
          <div class="flex w-full gap-4 *:flex-1">
            <NuxtLink
              :to="{
                name: 'manage-biz-products',
                params: { slug: $route.params.slug },
              }"
              class="exit-modal primary button"
            >
              View products
            </NuxtLink>
            <button class="outlined button exit-modal">Add another product</button>
          </div>
        </div>
        <div v-else-if="progress.completed === null" class="flex flex-col items-center gap-3">
          <Icon name="material-symbols:error-outline-rounded" class="text-error text-5xl" />
          <p class="m-0 text-center">An error occurred.</p>
          <div class="flex w-full gap-4 *:flex-1">
            <button @click="nextTab" class="primary button">Try again</button>
            <button class="outlined button exit-modal">Exit</button>
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
    </LimbModal>
  </div>
</template>
