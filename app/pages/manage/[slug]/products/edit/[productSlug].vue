<script lang="ts" setup>
import type { Maybe } from "@regle/core";
import { isEmpty, isFilled, url, required, requiredIf } from "@regle/rules";
import { useSortable } from "@vueuse/integrations/useSortable";

definePageMeta({
  name: "edit-product",
  layout: "details",
  auth: { only: "user" },
  noCart: true,
});

const route = useRoute();
const { data: productCategories } = await useFetch("/api/product-categories", {
  key: "product-categories",
});
const { data: product } = await useFetch("/api/product/query", {
  query: { slug: route.params.productSlug },
});

const productForm = reactive<{
  category_id?: string;
  title?: string;
  photos: (File | string)[];
  video_link?: string;

  base_price?: string;
  base_promo_price?: string;
  option_group?: {
    title: string;
    options: {
      label: string;
      price: string;
      promo_price: string;
      photo?: File | string;
      sub_options?: {
        is_active: boolean;
        label: string;
        price: string;
        promo_price: string;
        price_changed?: boolean;
        promo_price_changed?: boolean;
      }[];
    }[];
  };
  sub_option_group?: {
    title: string;
    options: { label: string; price: string; promo_price: string; photo?: File | string }[];
  };

  specifications: {
    name: string;
    value: string;
  }[];
  overview?: string;
  details_attachment?: File | string;
  shipping?: {
    measurements?: {
      weight?: string;
      length?: string;
      width?: string;
      height?: string;
    };
    location?: {
      country: string;
      state: string;
      city: string;
      address: string;
    };
  };
  meta: Record<string, any>;
}>({
  photos: [],
  specifications: [],
  meta: {},
});
const placeholder = reactive<{
  option: {
    label: string;
    price: string;
    promo_price: string;
    photo?: File | string;
    sub_options?: {
      is_active: boolean;
      label: string;
      price: string;
      promo_price: string;
      price_changed?: boolean;
      promo_price_changed?: boolean;
    }[];
  };
  modifyingOption?: {
    group: string;
    index: number;
  };
  shipping: {
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
  priceOption: boolean;
  optionPriceOption: boolean;
  upload: {
    status: "initial" | "completed" | "error";
    message: string;
  };
}>({
  option: {
    label: "",
    price: "",
    promo_price: "",
  },
  shipping: {
    measurements: {},
    location: {
      country: "",
      state: "",
      city: "",
      address: "",
    },
  },
  priceOption: false,
  optionPriceOption: false,
  upload: {
    status: "initial",
    message: "",
  },
});
const locationFilled = () => Object.values(placeholder.shipping.location).some((val) => val);
const validation = {
  product: useRegle(productForm, {
    category_id: {
      required: withMessage(required, "Product category is required."),
    },
    title: { required: withMessage(required, "Product title is required.") },
    photos: {
      $each: {},
      minLength: withMessage(
        (value: Maybe<(File | string)[]>) => !!value && value.length > 1,
        "At least two product photos are required.",
      ),
      size: withMessage(
        (value: Maybe<(File | string)[]>) =>
          !value || value.every((el) => typeof el === "string" || el.size <= 5 * 1024 * 1024),
        "Each photo must be less than 5MB in size.",
      ),
    },
    video_link: { url },

    base_price: {
      required: withMessage(
        (value: Maybe<string>) => !!value && Number(value) > 0,
        "A base price is required for the product.",
      ),
      lowestInOptions: withMessage((value: Maybe<string>) => {
        if (!productForm.option_group) return true;
        let lowestOptionPrice = Math.min(
          ...productForm.option_group.options.map((option) => Number(option.price) || Infinity),
          ...(productForm.option_group.options.some((option) => option.sub_options)
            ? productForm.option_group.options.flatMap(
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
      lessThanBasePrice: withMessage(
        (value: Maybe<string>) =>
          !value ||
          (Number(value) > 0 &&
            (!productForm.base_price || Number(value) < Number(productForm.base_price))),
        "Promotional price must be greater than zero and less than the base price.",
      ),
    },
    option_group: {
      title: {
        required: withMessage(
          requiredIf(() => utils.isObject(productForm.option_group)),
          "A title is required for this option group.",
        ),
      },
      options: {
        $each: {},
        minLength: withMessage(
          (value: Maybe<any[]>) => !value || value.length > 1,
          "At least two options must be added here.",
        ),
      },
    },
    sub_option_group: {
      title: {
        required: withMessage(
          requiredIf(() => utils.isObject(productForm.sub_option_group)),
          "A title is required for this option group.",
        ),
      },
      options: {
        $each: {},
        minLength: withMessage(
          (value: Maybe<any[]>) => !value || value.length > 1,
          "At least two options must be added here.",
        ),
      },
    },

    specifications: {
      minLength: withMessage(
        (value: Maybe<any[]>) => !!value && value.length > 1,
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
  option: useRegle(
    computed(() => placeholder.option),
    {
      label: {
        unique: withMessage(
          (value: Maybe<string>) =>
            !!value &&
            productForm.option_group!.options.every(
              (option, index) =>
                option.label !== value ||
                (placeholder.modifyingOption &&
                  placeholder.modifyingOption.group === "main" &&
                  placeholder.modifyingOption.index === index),
            ) &&
            (!productForm.sub_option_group ||
              productForm.sub_option_group.options.every(
                (option, index) =>
                  option.label !== value ||
                  (placeholder.modifyingOption &&
                    placeholder.modifyingOption.group === "sub" &&
                    placeholder.modifyingOption.index === index),
              )),
          "A unique label is required for this option.",
        ),
      },
      promo_price: {
        lessThanOptionPriceOrBasePrice: withMessage(
          (value: Maybe<string>) =>
            !value ||
            (Number(value) > 0 &&
              (!placeholder.option.price ||
                Number(value) < Number(placeholder.option.price) ||
                (!placeholder.option.price && Number(value) < Number(productForm.base_price)))),
          "Promotional price must be greater than zero and less than the option price if present or less than base price.",
        ),
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
            lessThanOptionPriceOrBasePrice: withMessage(
              (value: Maybe<string>) =>
                !value ||
                !sub_option.value.is_active ||
                (Number(value) > 0 &&
                  (!sub_option.value.price ||
                    Number(value) < Number(sub_option.value.price) ||
                    (!sub_option.value.price && Number(value) < Number(productForm.base_price)))),
              "Promotional price must be greater than zero and less than this sub-option price if present or less than base price.",
            ),
          },
        }),
      },
    },
  ),
  shipping: useRegle(
    computed(() => placeholder.shipping),
    {
      location: {
        $self: {
          $rewardEarly: true,
          inComplete: withMessage(
            (value) =>
              !value ||
              Object.values(value).every((val) => isFilled(val)) ||
              Object.values(value).every((val) => isEmpty(val)),
            "Location boxes are incomplete; either fill them fully or clear them.",
          ),
        },
        country: {
          required: requiredIf(locationFilled),
        },
        state: {
          required: requiredIf(locationFilled),
        },
        city: {
          required: requiredIf(locationFilled),
        },
        address: {
          required: requiredIf(locationFilled),
        },
      },
    },
  ),
};

const specPresets = {
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

function handleNewPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    [...input.files].forEach((file) => productForm.photos.push(file));
    input.value = "";
    nextTick(() => input.scrollIntoView({ behavior: "smooth", block: "center" }));
  }
}
async function createproductFormOption() {
  if (productForm.option_group) {
    productForm.sub_option_group = {
      title: "",
      options: [],
    };
    await nextTick();
    validation.product.r$.sub_option_group.$reset();
    document.getElementById("sub-option-group-title")?.focus();
    document
      .getElementById("sub-option-group-title")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    productForm.option_group = {
      title: "",
      options: [],
    };
    await nextTick();
    validation.product.r$.option_group.$reset();
    document.getElementById("option-group-title")?.focus();
    document
      .getElementById("option-group-title")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
async function configProductOption({ target, settings }: Dialoger) {
  let caller = settings.caller!;
  let callergroup = caller.hasAttribute("data-sub-category") ? "sub" : "main";

  if (caller.dataset.optionId !== undefined) {
    let optionId = parseInt(caller.dataset.optionId);
    const option =
      callergroup === "sub"
        ? productForm.sub_option_group?.options[optionId]
        : productForm.option_group?.options[optionId];
    if (option) {
      placeholder.modifyingOption = { group: callergroup, index: optionId };
      placeholder.option = { ...structuredClone(toRaw(option)) };
    }
  }

  await nextTick();
  validation.option.r$.$reset();

  const cleanupCloseEvent = useEventListener(target, "dialogIsClosed", () => {
    placeholder.modifyingOption = undefined;
    placeholder.option = { label: "", price: "", promo_price: "" };
    cleanupCloseEvent();
  });
}
async function processProductOption({ settings, exit }: Dialoger) {
  await validation.option.r$.$validate();
  if (validation.option.r$.$invalid) return;

  let caller = settings.caller!;
  let callergroup = caller.hasAttribute("data-sub-category") ? "sub" : "main";

  if (placeholder.modifyingOption) {
    let index = placeholder.modifyingOption.index;
    if (callergroup === "sub") {
      if (productForm.sub_option_group?.options[index]) {
        if (placeholder.option.label.trim())
          productForm.sub_option_group.options[index] = {
            ...placeholder.option,
          };
        else productForm.sub_option_group.options.splice(index, 1);
      }
    } else if (callergroup === "main") {
      if (productForm.option_group?.options[index]) {
        if (placeholder.option.label.trim())
          productForm.option_group.options[index] = {
            ...placeholder.option,
          };
        else productForm.option_group.options.splice(index, 1);
      }
    }
  } else if (placeholder.option.label.trim()) {
    if (callergroup === "sub")
      productForm.sub_option_group?.options.push({
        ...placeholder.option,
      });
    else if (callergroup === "main")
      productForm.option_group?.options.push({ ...placeholder.option });
  }

  validation.product.r$.base_price.$touch();
  exit();
}
function addSpecification(template?: string[]) {
  if (template) {
    productForm.specifications = template.map((spec) => ({
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
    productForm.specifications.push({ name: "", value: "" });
    nextTick(() =>
      (
        document.querySelector(
          "#spec-table > tbody > tr:last-child > td:first-child input",
        ) as HTMLInputElement
      )?.focus(),
    );
  }
}
function configShippingModal({ target }: Dialoger) {
  const cleanupCloseEvent = useEventListener(target, "dialogIsClosed", () => {
    placeholder.shipping = {
      measurements: {},
      location: { country: "", state: "", city: "", address: "" },
    };
    cleanupCloseEvent();
  });
}
async function setShippingDetails({ exit }: Dialoger) {
  validation.shipping.r$.location.$self.$touch();
  await validation.shipping.r$.$validate();
  if (validation.shipping.r$.$invalid) return;

  if (
    Object.values(placeholder.shipping.location).some((val) => val) ||
    Object.values(placeholder.shipping.measurements).some((val) => val)
  )
    productForm.shipping = placeholder.shipping;
  else productForm.shipping = undefined;

  exit();
}
function clearLocation() {
  placeholder.shipping.location = {
    country: "",
    state: "",
    city: "",
    address: "",
  };
  validation.shipping.r$.location.$reset();
}
async function processForm() {
  await validation.product.r$.$validate();

  if (validation.product.r$.$invalid) {
    await nextTick();
    const errorInput = document.querySelector(
      "#product-form .error, #product-form .text-error",
    ) as Maybe<HTMLElement>;
    const errorField = errorInput?.closest(".field");

    if (errorInput?.matches(".text-error")) utils.getFocusableElementsFrom(errorField)[0]?.focus();
    else errorInput?.focus();
    errorField?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  placeholder.upload.message = "Preparing your product for upload...";

  const uploader = document.querySelector("#upload-status");

  if (uploader && !uploader.classList.contains("active")) {
    utils.triggerEvent(uploader, "dgconsole", "open dialog");
    await utils.notifyOnEvent(uploader, "dialogIsOpened");
  }

  if (placeholder.upload.status === "completed") return;

  placeholder.upload.status = "initial";

  try {
    // check if files have be uploaded before and upload them if not
    if (
      productForm.photos.some((photo) => typeof photo !== "string") ||
      (productForm.option_group &&
        productForm.option_group.options.some(({ photo }) => photo && typeof photo !== "string")) ||
      (productForm.sub_option_group &&
        productForm.sub_option_group.options.some(
          ({ photo }) => photo && typeof photo !== "string",
        )) ||
      (productForm.details_attachment && typeof productForm.details_attachment !== "string")
    ) {
      const formFiles = new FormData();
      productForm.photos.forEach((photo, index) => {
        if (typeof photo === "string") return;
        formFiles.append("photos", photo, index.toString());
      });
      productForm.option_group?.options.forEach((option, index) => {
        if (option.photo && typeof option.photo !== "string")
          formFiles.append("option_group", option.photo, index.toString());
      });
      productForm.sub_option_group?.options.forEach((option, index) => {
        if (option.photo && typeof option.photo !== "string")
          formFiles.append("sub_option_group", option.photo, index.toString());
      });
      if (productForm.details_attachment && typeof productForm.details_attachment !== "string") {
        formFiles.append("details_attachment", productForm.details_attachment);
      }

      placeholder.upload.message = "Uploading product files...";

      const filesURL = await $fetch("/api/file-upload", {
        query: { upload_dir: route.params.slug, image_width: 900 },
        body: formFiles,
        method: "post",
      });

      if ("photos" in filesURL) {
        filesURL.photos.forEach((elem) => {
          productForm.photos[parseInt(elem.filename)] = elem.data;
        });
      }
      if ("option_group" in filesURL) {
        filesURL.option_group.forEach((elem) => {
          productForm.option_group!.options[parseInt(elem.filename)]!.photo = elem.data;
        });
      }
      if ("sub_option_group" in filesURL) {
        filesURL.sub_option_group.forEach((elem) => {
          productForm.sub_option_group!.options[parseInt(elem.filename)]!.photo = elem.data;
        });
      }
      if ("details_attachment" in filesURL) {
        productForm.details_attachment = filesURL.details_attachment[0]?.data;
      }
    }

    placeholder.upload.message = "Adding product...";
    await $fetch("/api/product/update", {
      method: "patch",
      query: {
        id: product.value!.id,
        action: "edit",
      },
      body: {
        business_slug: route.params.slug,
        ...structuredClone(toRaw(productForm)),
      },
    });
    placeholder.upload.message = "Done";
    await nextTick();
    placeholder.upload.status = "completed";
  } catch (error) {
    placeholder.upload.status = "error";
    console.error("Product upload failed", error);
    return;
  }
}
function reset() {
  if (product.value) Object.assign(productForm, structuredClone(product.value));
}

onMounted(() => reset());
watchEffect(() => {
  if (productForm.sub_option_group?.options === undefined && productForm.option_group) {
    productForm.option_group.options.forEach((option) => {
      option.sub_options = undefined;
    });
  } else if (productForm.option_group) {
    productForm.option_group.options.forEach((option) => {
      option.sub_options = option.sub_options || [];
      let newMap = productForm.sub_option_group?.options.map((el, index) => ({
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
useSortable("#prod-photos > .scroll-items", productForm.photos);
</script>

<template>
  <div v-if="product" class="auto-contain flex max-w-180 flex-1 flex-col">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 self-pointer-none mb-4 min-h-23 [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 bg-surface shadow-t-blend m-0 flex items-end justify-between gap-3 transition-[font-size] duration-200"
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
    <form
      id="product-form"
      class="auto-contain no-edge max-w-lg flex-1"
      @submit.prevent="processForm"
    >
      <div class="field">
        <label for="prod-title">Product title</label>
        <div class="text-sm opacity-65">
          It should be as descriptive and unique as possible. Include brand name, model, and key
          features.
        </div>
        <input
          v-model="productForm.title"
          id="prod-title"
          readonly
          class="form-item"
          :class="{ error: validation.product.r$.title.$error }"
          type="text"
          placeholder="Product title"
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.product.r$.title.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label for="photo-selector">Add photo</label>
        <div class="text-sm opacity-65">
          Photos help customers see the product. Use clear, well-lit images that showcase the
          product from different angles. A photo can be dragged to re-order it.
        </div>
        <LimbIScroller
          id="prod-photos"
          :options="{ autoSetup: true }"
          class="[&_.sortable-ghost]:opacity-0"
        >
          <div
            v-for="(photo, index) in productForm.photos"
            class="relative flex flex-col items-center"
          >
            <img :src="utils.fileToURL(photo)" alt="Product photo" class="thumbnail" />
            <button
              type="button"
              @click="productForm.photos.splice(index, 1)"
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
          v-for="error in validation.product.r$.photos.$self.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <label class="button design-takeover">
          <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
            productForm.photos.length ? "Add more photos" : "Add photos"
          }}
          <input
            id="photo-selector"
            type="file"
            multiple
            @change="handleNewPhoto"
            accept="image/*"
          />
        </label>
      </div>
      <div class="field">
        <label for="prod-video">Link to YouTube or Facebook video</label>
        <input
          v-model="productForm.video_link"
          id="prod-video"
          class="form-item"
          :class="{ error: validation.product.r$.video_link.$error }"
          type="text"
          placeholder="e.g. https://youtube.com/..."
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.product.r$.video_link.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <div class="field-label">Category</div>
        <p class="text-sm opacity-65">
          Choose a category from the dropdown below that best fits the product you're adding. You
          can also select “Others” from the dropdown to make a new one.
        </p>
        <LimbDropdown
          v-model="productForm.category_id"
          type="search select"
          :class="{ error: validation.product.r$.category_id.$error }"
          @change="
            $event !== 'others' ||
            $nextTick(() => utils.document().getElementById('prod-category-new')?.focus())
          "
          id="prod-category"
          placeholder="Select category"
        />
        <div class="drop menu">
          <template
            v-for="cat in productCategories?.filter((category) => category.parent_id === null)"
            Key="cat.id"
          >
            <div class="item font-semibold">
              {{ cat.name }}
            </div>
            <div
              v-if="productCategories?.find((sub_cat) => sub_cat.parent_id === cat.id)"
              class="sub items border-l"
            >
              <div
                v-for="sub_cat in productCategories.filter(
                  (sub_cat) => sub_cat.parent_id === cat.id,
                )"
                class="item"
                :data-value="sub_cat.id"
                :key="sub_cat.id"
              >
                {{ sub_cat.name }}
              </div>
              <div class="item" :data-value="cat.id">{{ cat.name }} (Others)</div>
            </div>
          </template>
          <div data-value="-1" class="item">Others</div>
        </div>
        <div
          class="text-error text-sm"
          v-for="error of validation.product.r$.category_id.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <div v-if="productForm.category_id === '-1'" class="field">
          <label for="prod-category-new">New category name</label>
          <div class="text-sm opacity-65">
            Note: Your product will remain in the “Others” category in Explore until the new
            category is reviewed and standardized.
          </div>
          <input
            v-model="productForm.meta.new_category"
            id="prod-category-new"
            class="form-item"
            type="text"
            placeholder="Category name"
          />
        </div>
      </div>

      <div class="field">
        <label for="prod-price">Price</label>
        <div class="text-sm opacity-65">
          If there are product options, the price here should be the lowest option price. Price can
          also be set with product options.
        </div>
        <LimbCurrencyInput
          v-model="productForm.base_price"
          @input="validation.product.r$.base_promo_price.$touch"
          id="prod-price"
          class="form-item"
          :class="{ error: validation.product.r$.base_price.$error }"
          placeholder="Product price"
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.product.r$.base_price.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <button
          v-if="!placeholder.priceOption && !productForm.base_promo_price"
          type="button"
          @click="
            () => {
              placeholder.priceOption = true;
              $nextTick(() => {
                utils.document().getElementById('base-promo-price')?.focus();
              });
            }
          "
          class="text-primary text-left hover:underline"
        >
          More pricing options
        </button>
        <div v-else class="field">
          <label for="base-promo-price">Promotional price (optional)</label>
          <p class="text-sm opacity-65">
            You can optionally add a promo price for this product. This price is shown when promo is
            enabled.
          </p>
          <LimbCurrencyInput
            v-model="productForm.base_promo_price"
            id="base-promo-price"
            class="form-item"
            :class="{ error: validation.product.r$.base_promo_price.$error }"
            placeholder="Product promo price"
          />
          <div
            class="text-error text-sm"
            v-for="error of validation.product.r$.base_promo_price.$errors"
            :key="error"
          >
            <Icon name="material-symbols:error-rounded" />
            {{ error }}
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field-label">Product options</div>
        <div class="text-sm opacity-65">
          Product options are variations of the product, such as color, size, or configuration. You
          can add a maximum of two option groups.
        </div>
        <button
          type="button"
          v-if="!productForm.option_group"
          @click="createproductFormOption"
          class="compact button"
        >
          Add an option group
        </button>
        <template v-else>
          <fieldset class="flex flex-col gap-2">
            <button
              type="button"
              @click="
                ((productForm.option_group = undefined), (productForm.sub_option_group = undefined))
              "
              v-tooltip:aria.unblocking
              aria-label="Remove option group"
              class="circular icon button ml-auto bg-transparent text-sm"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div class="field">
              <label for="option-group-title">Option group title</label>
              <input
                v-model="productForm.option_group.title"
                class="form-item"
                :class="{
                  error: validation.product.r$.option_group.title.$error,
                }"
                id="option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
              <div
                class="text-error text-sm"
                v-for="error of validation.product.r$.option_group.title.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
              <div class="lined sub heading a-block px-3">
                Add options below for:
                <div class="trailing">
                  {{ productForm.option_group.title }}
                </div>
              </div>
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in productForm.option_group.options"
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
                    @click="productForm.option_group.options.splice(index, 1)"
                    class="circular trailing icon button ex-open-modal text-sm"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </div>
                <button type="button" class="button as-app open-modal" data-target="app-option">
                  <Icon class="text-xl" name="material-symbols:add-rounded" />
                  Add option
                </button>
              </div>
              <div
                class="text-error text-sm"
                v-for="error of validation.product.r$.option_group.options.$self?.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
            </div>
          </fieldset>
          <div class="field">
            <div class="field-label">Product sub-option</div>
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
              v-if="!productForm.sub_option_group"
              @click="createproductFormOption"
              class="compact button"
            >
              Add a sub-option group
            </button>
            <fieldset v-else class="flex flex-col gap-2">
              <button
                type="button"
                @click="productForm.sub_option_group = undefined"
                v-tooltip:aria.unblocking
                aria-label="Remove sub-option group"
                class="circular icon button ml-auto bg-transparent text-sm"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div class="field">
                <label for="sub-option-group-title">Sub-option group title</label>
                <input
                  v-model="productForm.sub_option_group.title"
                  class="form-item"
                  :class="{
                    error: validation.product.r$.sub_option_group.title.$error,
                  }"
                  id="sub-option-group-title"
                  type="text"
                  placeholder="e.g. Color, Size, etc."
                />
                <div
                  class="text-error text-sm"
                  v-for="error of validation.product.r$.sub_option_group.title.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
                <div class="lined sub heading a-block px-3">
                  Add options below for:
                  <div class="trailing">
                    {{ productForm.sub_option_group.title }}
                  </div>
                </div>
                <div class="wrappable menu">
                  <div
                    v-for="(option, index) in productForm.sub_option_group.options"
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
                      @click="productForm.sub_option_group.options.splice(index, 1)"
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
                    <Icon class="text-xl" name="material-symbols:add-rounded" />
                    Add option
                  </button>
                </div>
                <div
                  class="text-error text-sm"
                  v-for="error of validation.product.r$.sub_option_group.options.$self?.$errors"
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
        <div class="field-label">Product Specifications</div>
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
                v-for="(template, templateName) in specPresets"
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
            <tr v-for="(spec, index) in validation.product.r$.specifications.$each">
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
                  @click="productForm.specifications.splice(index, 1)"
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
                  v-for="error of validation.product.r$.specifications.$self.$errors"
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
        <div class="field-label">Product details attachment (PDF)</div>
        <p class="text-sm opacity-65">
          You can also add a PDF attachment that contains detailed information about the product,
          such as a user manual, spec sheet, or brochure. This can provide customers with additional
          insights and help them make a more informed purchasing decision.
        </p>
        <div
          v-if="productForm.details_attachment"
          class="relative mb-3 flex w-max flex-col items-center"
        >
          <Icon
            name="material-symbols:picture-as-pdf-outline-rounded"
            class="text-6xl text-red-500"
          />
          <button
            type="button"
            @click="productForm.details_attachment = undefined"
            class="compact circular outlined button bg-overlay absolute top-1 right-1 text-xs"
          >
            <Icon name="material-symbols:close-rounded" />
          </button>
          <div v-if="typeof productForm.details_attachment === 'string'" class="text-sm">
            {{ productForm.details_attachment.split("/").at(-1) }}
          </div>
          <template v-else>
            <div class="text-sm">{{ productForm.details_attachment.name }}</div>
            <div class="text-sm">
              {{ (productForm.details_attachment.size / 1024 / 1024).toFixed(1) }}MB
            </div>
          </template>
        </div>
        <label for="add-attachment" class="button design-takeover">
          <Icon name="material-symbols:picture-as-pdf-outline-rounded" />{{
            `${productForm.details_attachment ? "Change attachment" : "Add attachment"}`
          }}
          <input
            id="add-attachment"
            type="file"
            @change="
              productForm.details_attachment = ($event.target as HTMLInputElement).files?.[0]
            "
            accept="application/pdf, .pdf"
          />
        </label>
      </div>
      <div class="field">
        <label for="prod-overview">Your review</label>
        <p class="text-sm opacity-65">
          Share your personal review of the product. Highlight its key features, benefits, and what
          makes it a great choice for customers. A compelling description can help buyers make an
          informed decision.
        </p>
        <textarea
          id="prod-overview"
          v-model="productForm.overview"
          class="form-item"
          :class="{ error: validation.product.r$.overview.$error }"
          rows="3"
          placeholder="Write your review here..."
        ></textarea>
        <div
          class="text-error text-sm"
          v-for="error of validation.product.r$.overview.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <div class="field-label">Shipping Information</div>
        <p class="text-sm opacity-65">
          Add shipping information for the product. This includes details about measurements and
          pickup addresses. Providing clear shipping information helps customers understand what to
          expect when purchasing the product.
        </p>
        <button
          v-if="!productForm.shipping"
          type="button"
          class="compact button open-modal"
          data-target="prod-shipping"
        >
          Specify shipping information
        </button>
        <fieldset class="flex flex-col gap-3" v-else>
          <div v-if="productForm.shipping?.measurements">
            <span class="font-semibold">Measurements: </span>
            <span v-for="(value, measurement) in productForm.shipping?.measurements">
              <span class="capitalize">{{ measurement }}: </span> {{ value }} |
            </span>
          </div>
          <div
            v-if="
              productForm.shipping?.location &&
              Object.values(productForm.shipping.location).some((el) => isFilled(el))
            "
          >
            <span class="font-semibold">Overide pickup location: </span>
            {{
              `${productForm.shipping?.location?.address}, ${productForm.shipping?.location?.city}, ${productForm.shipping?.location?.state}, ${productForm.shipping?.location?.country}`
            }}
          </div>
          <button type="button" class="compact button open-modal" data-target="prod-shipping">
            Edit shipping information
          </button>
        </fieldset>
      </div>
      <button type="submit" class="sr-only">Continue</button>
    </form>
    <footer class="bg-surface shadow-b-blend z-level-1 mt-2 px-4 pt-4 pb-8">
      <div class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our
          <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
        </p>
        <button @click="processForm" class="primary button">Continue</button>
      </div>
    </footer>

    <LimbModal
      id="app-option"
      :options="{
        controller: configProductOption,
      }"
      v-slot="{ control }"
    >
      <div class="dialog">
        <header class="flex gap-3 px-6 py-4">
          <div class="truncate font-bold">
            {{ placeholder.modifyingOption ? "Modify an option" : "Add an option" }}
          </div>
          <button type="button" class="circular flat button as-text exit-modal ml-auto">
            <Icon name="material-symbols:close-rounded" />
          </button>
        </header>
        <form class="px-6 py-4">
          <div class="field">
            <label for="option-label">Label</label>
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
            <label for="option-price">Price (optional)</label>
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
                  $nextTick(() => {
                    utils.document().getElementById('option-promo-price')?.focus();
                  });
                }
              "
              class="text-primary text-left hover:underline"
            >
              More pricing options
            </button>
            <div v-else class="field">
              <label for="option-promo-price">Promotional price (optional)</label>
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
            <label for="add-option-photo">Unique option picture (optional)</label>
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
            <label class="button design-takeover">
              <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
                `${placeholder.option.photo ? "Change photo" : "Add photo"}`
              }}
              <input
                id="add-option-photo"
                type="file"
                @change="placeholder.option.photo = ($event.target as HTMLInputElement).files?.[0]"
                accept="image/*"
              />
            </label>
          </div>
          <div v-if="placeholder.option.sub_options" class="field">
            <div class="field-label">sub-option group</div>
            <div class="text-sm opacity-65">
              Toggle the sub-option you want to add to this option. You can also click on the price
              to modify it.
            </div>
            <div v-if="productForm.sub_option_group" class="wrappable menu">
              <div v-for="(option, index) in productForm.sub_option_group.options" class="item">
                <div
                  class="icon"
                  :class="{
                    active: placeholder.option.sub_options[index]!.is_active,
                  }"
                  @click="
                    ((placeholder.option.sub_options[index]!.is_active =
                      !placeholder.option.sub_options[index]!.is_active),
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
                        ((placeholder.option.sub_options[index]!.price_changed! =
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
                        placeholder.option.sub_options[index]!.promo_price_changed! =
                          $event.target.value !== option.promo_price
                      "
                      class="form-item text-fit text-success"
                      :class="{
                        error: validation.option.r$.sub_options.$each[index]?.promo_price.$error,
                      }"
                      placeholder="Add option promo price"
                    />
                    <div
                      class="text-error text-sm"
                      v-for="error of validation.option.r$.sub_options.$each[index]?.promo_price
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
          <div class="field items-end">
            <button
              type="submit"
              class="primary button"
              @click.prevent="processProductOption(control)"
            >
              {{ placeholder.modifyingOption ? "Modify option" : "Add option" }}
            </button>
          </div>
        </form>
      </div>
    </LimbModal>
    <LimbModal
      id="prod-shipping"
      :options="{ controller: configShippingModal }"
      v-slot="{ control }"
    >
      <form class="dialog flex flex-col">
        <header class="flex gap-3 px-6 py-4">
          <div class="truncate font-bold">Shipping Information</div>
          <button type="button" class="circular flat button as-text exit-modal ml-auto">
            <Icon name="material-symbols:close-rounded" />
          </button>
        </header>
        <div class="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <section>
            <div class="lined heading">Measurements</div>
            <p class="text-sm opacity-65">
              All measurements are optional. Make sure to include units when inputting measurements.
            </p>
            <div class="grid grid-cols-2 gap-x-4">
              <div class="field">
                <label for="prod-weight">Weight</label>
                <input
                  id="prod-weight"
                  type="text"
                  class="form-item"
                  v-model="placeholder.shipping.measurements.weight"
                  placeholder="Enter weight"
                />
              </div>
              <div class="field">
                <label for="prod-length">Length</label>
                <input
                  id="prod-length"
                  type="text"
                  class="form-item"
                  v-model="placeholder.shipping.measurements.length"
                  placeholder="Enter length"
                />
              </div>
              <div class="field">
                <label for="prod-width">Width</label>
                <input
                  id="prod-width"
                  type="text"
                  class="form-item"
                  v-model="placeholder.shipping.measurements.width"
                  placeholder="Enter width"
                />
              </div>
              <div class="field">
                <label for="prod-height">Height</label>
                <input
                  id="prod-height"
                  type="text"
                  class="form-item"
                  v-model="placeholder.shipping.measurements.height"
                  placeholder="Enter height"
                />
              </div>
            </div>
          </section>
          <section>
            <div class="lined heading flex items-end justify-between">
              Pickup Location Override
              <button type="button" @click.prevent="clearLocation()" class="compact button text-sm">
                Clear
              </button>
            </div>
            <p class="text-sm opacity-65">
              Your business specified location will be used as pickup location for this product if
              you did not specify an override location here.
            </p>
            <div
              class="text-error text-center text-sm"
              v-for="error of validation.shipping.r$.location.$self.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
            <div class="grid grid-cols-2 gap-x-4">
              <div class="field">
                <label for="prod-country">Country</label>
                <input
                  v-model.trim="placeholder.shipping.location.country"
                  class="form-item"
                  :class="{ error: validation.shipping.r$.location.country.$error }"
                  id="prod-country"
                  type="text"
                  placeholder="Enter country"
                />
              </div>
              <div class="field">
                <label for="prod-state">State</label>
                <input
                  v-model.trim="placeholder.shipping.location.state"
                  class="form-item"
                  :class="{ error: validation.shipping.r$.location.state.$error }"
                  id="prod-state"
                  type="text"
                  placeholder="Enter state"
                />
              </div>
              <div class="field">
                <label for="prod-city">City</label>
                <input
                  v-model.trim="placeholder.shipping.location.city"
                  class="form-item"
                  :class="{ error: validation.shipping.r$.location.city.$error }"
                  id="prod-city"
                  type="text"
                  placeholder="Enter city"
                />
              </div>
              <div class="field">
                <label for="prod-address">Address</label>
                <input
                  v-model.trim="placeholder.shipping.location.address"
                  class="form-item"
                  :class="{ error: validation.shipping.r$.location.address.$error }"
                  id="prod-address"
                  type="text"
                  placeholder="Enter address"
                />
              </div>
            </div>
          </section>
        </div>
        <footer class="flex justify-end px-6 py-4">
          <button type="submit" @click.prevent="setShippingDetails(control)" class="primary button">
            Add Info
          </button>
        </footer>
      </form>
    </LimbModal>
    <LimbModal id="upload-status" :options="{ closeOnEsc: false, closeOnWrapperClick: false }">
      <div class="dialog max-w-125 p-6">
        <div
          v-if="placeholder.upload.status === 'initial'"
          class="flex flex-col items-center gap-4"
        >
          <div class="m3-progress indeterminate"></div>
          <p>{{ placeholder.upload.message }}</p>
        </div>
        <div
          v-else-if="placeholder.upload.status === 'completed'"
          class="flex flex-col items-center gap-3"
        >
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
        <div
          v-else-if="placeholder.upload.status === 'error'"
          class="flex flex-col items-center gap-3"
        >
          <Icon name="material-symbols:error-outline-rounded" class="text-error text-5xl" />
          <p class="m-0 text-center">An error occurred.</p>
          <div class="flex w-full gap-4 *:flex-1">
            <button @click="processForm" class="primary button">Try again</button>
            <button class="outlined button exit-modal">Exit</button>
          </div>
        </div>
      </div>
    </LimbModal>
  </div>
</template>
