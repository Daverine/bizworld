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
  base_price: string;
  option_group?: {
    title: string;
    options: {
      label: string;
      price?: string;
      photo?: File | string;
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
    options: { label: string; price?: string; photo?: File | string }[];
  };
  specifications: {
    name: string;
    value: string;
  }[];
  overview?: string;
  details_attachment?: File | string;
}>({
  photos: [],
  base_price: "0",
  specifications: [],
});

const optionPlaceholder = ref<{
  label: string;
  price?: string;
  photo?: File | string;
  sub_options?: {
    is_active: boolean;
    label: string;
    price?: string;
    price_changed?: boolean;
  }[];
}>({
  label: "",
});
const validation = {
  editable: useRegle(editable, {
    category: {
      required: withMessage(required, "Product category is required"),
    },
    new_category: {
      required: withMessage(
        requiredIf(() => editable.category === "others"),
        "New category name is required",
      ),
    },
    photos: {
      $rewardEarly: true,
      minLength: withMessage(
        (value) => (value as []).length > 1,
        "At least two product photo is required.",
      ),
      size: withMessage(
        (value) =>
          !(
            value &&
            (value as (File | string)[]).some(
              (el) => typeof el !== "string" && el.size >= 5 * 1024 * 1024,
            )
          ),
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
        if (isFinite(lowestOptionPrice)) {
          return Number(value) <= lowestOptionPrice;
        }
        return true;
      }, "Base price must be less than or equal to the lowest option price."),
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
        "At least two product specification is required.",
      ),
      $each: {
        name: { required },
        value: { required },
      },
    },
    overview: {
      required: withMessage(required, "Product overview is required"),
    },
    details_attachment: {
      maxSize: withMessage(
        maxFileSize(5 * 1024 * 1024),
        "Selected document must be less than 5MB in size.",
      ),
    },
  }),
  optionPlaceholder: useRegle(optionPlaceholder, {
    label: {
      required: withMessage(required, "A unique label must be specified for this option."),
      unique: withMessage((value) => {
        let existsInMain =
          editable.option_group?.options.some((option) => option.label === value) ?? false;
        let existsInSub =
          editable.sub_option_group?.options.some((option) => option.label === value) ?? false;
        return (!existsInMain && !existsInSub) || optionPlaceholderModifying.value;
      }, "An option with this label already exists."),
    },
    photo: {
      maxSize: withMessage(
        maxFileSize(5 * 1024 * 1024),
        "Selected photo must be less than 5MB in size.",
      ),
    },
  }),
};
const optionPlaceholderModifying = ref(false);
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
        price_changed: option.sub_options![index]?.price_changed,
      }));

      option.sub_options = newMap;
    });
  }
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
      optionPlaceholderModifying.value = true;
      optionPlaceholder.value = { ...option };
    }
  } else {
    optionPlaceholderModifying.value = false;
    optionPlaceholder.value = {
      label: "",
    };
  }
  await nextTick();
  validation.optionPlaceholder.r$.$reset();
}
function processProductOption({ settings, exit }: Dialoger) {
  validation.optionPlaceholder.r$.$validate();
  if (validation.optionPlaceholder.r$.$invalid) return;

  let caller = settings.caller!;
  let callergroup = caller.hasAttribute("data-sub-category") ? "sub" : "main";

  if (caller.dataset.optionId !== undefined) {
    const optionId = parseInt(caller.dataset.optionId);
    if (callergroup === "sub") {
      if (editable.sub_option_group?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          editable.sub_option_group.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else editable.sub_option_group.options.splice(optionId, 1);
      }
    } else if (callergroup === "main") {
      if (editable.option_group?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          editable.option_group.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else editable.option_group.options.splice(optionId, 1);
      }
    }
  } else if (optionPlaceholder.value.label.trim()) {
    if (callergroup === "sub")
      editable.sub_option_group?.options.push({
        ...optionPlaceholder.value,
      });
    else if (callergroup === "main")
      editable.option_group?.options.push({ ...optionPlaceholder.value });
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

useSortable("#prodPhotos > .scroll-items", editable.photos);

async function nextTab() {
  await validation.editable.r$.$validate();
  if (validation.editable.r$.$invalid) {
    await nextTick();
    (document.querySelector(".field .error, .field .text-error") as HTMLElement)?.focus();
    document
      .querySelector(".field .error, .field .text-error")
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
    progress.value.message = "Adding product...";

    const edits = {
      ...structuredClone(toRaw(editable)),
    };

    await $fetch("/api/product/update", {
      method: "patch",
      query: {
        id: product.value!.id,
      },
      body: edits,
    });

    progress.value.loaded = undefined;
    progress.value.message = "Done";
    await nextTick();
    progress.value.completed = true;
  } catch (error) {
    progress.value.completed = null;
    console.log("Product update failed", error);
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
    editable.option_group = product.value.option_group;
    editable.sub_option_group = product.value.sub_option_group;
    editable.specifications = product.value.specifications;
    editable.overview = product.value.overview;
    editable.details_attachment = product.value.details_attachment;
  }
}

onMounted(() => reset());
</script>

<template>
  <div v-if="product" class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 self-pointer-none [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 transition-[font-size] duration-200 flex gap-3 justify-between items-end bg-surface pin-top-blend m-0"
      >
        Edit product
        <NuxtLink
          :to="{
            name: 'manage-biz-products',
            params: { slug: $route.params.slug },
          }"
          class="compact text-sm button"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
          <span class="content max-sm:hidden">Back</span>
        </NuxtLink>
      </div>
    </header>
    <form id="edit-product" class="max-w-lg auto-contain no-edge min-h-[80vh]">
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
          class="text-sm text-error"
          v-for="error of validation.editable.r$.category.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div v-if="editable.category === 'others'" class="field">
        <label for="prod-category-new">New category name</label>
        <div class="text-sm opacity-65">
          Note: Your product will stay in the “Others” category of our explore section until the new
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
          class="text-sm text-error"
          v-for="error of validation.editable.r$.new_category.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label for="prod-title">Title</label>
        <div class="text-sm opacity-65">
          It should be descriptive and unique as possible. Include brand name, model, and key
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
          Photos help customers to see the product. Use clear, well-lit images that showcase the
          product from different angles. A photo can be dragged to re-order it.
        </div>
        <LimbIScroller
          id="prodPhotos"
          :options="{ autoSetup: true }"
          class="[&_.sortable-ghost]:opacity-0"
        >
          <div
            v-for="(photo, index) in editable.photos"
            class="flex flex-col items-center relative"
          >
            <img :src="utils.fileToURL(photo)" alt="Product photo" class="thumbnail" />
            <button
              type="button"
              @click="editable.photos.splice(index, 1)"
              class="text-xs compact circular outlined button bg-overlay"
              style="position: absolute; top: 0.25rem; right: 0.25rem"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div v-if="typeof photo !== 'string'" class="text-sm">
              {{ (photo.size / 1024 / 1024).toFixed(1) }}MB
            </div>
          </div>
        </LimbIScroller>
        <div
          class="text-sm text-error"
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
        <label>Link to youtube or Facebook video</label>
        <input
          v-model="editable.video_link"
          id="prod-video"
          class="form-item"
          :class="{ error: validation.editable.r$.video_link.$error }"
          type="text"
          placeholder="e.g. https://youtube.com/..."
        />
        <div
          class="text-sm text-error"
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
          If there is a product options, price here should be the lower price option. Price can also
          be added with product options.
        </div>
        <LimbCurrencyInput
          v-model="editable.base_price"
          id="prod-price"
          class="form-item"
          :class="{ error: validation.editable.r$.base_price.$error }"
          placeholder="Product price"
        />
        <div
          class="text-sm text-error"
          v-for="error of validation.editable.r$.base_price.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label>Product options</label>
        <div class="text-sm opacity-65">
          Product options are variations of the product, such as color, size, or config option. You
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
        <fieldset v-if="editable.option_group" class="flex flex-col gap-2">
          <button
            type="button"
            @click="((editable.option_group = undefined), (editable.sub_option_group = undefined))"
            v-tooltip:aria.unblocking
            aria-label="Remove option group"
            class="ml-auto text-sm circular bg-transparent icon button"
          >
            <Icon name="material-symbols:close-rounded" />
          </button>
          <div class="field">
            <label>option group title</label>
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
              class="text-sm text-error"
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
                <img v-if="option.photo" :src="utils.fileToURL(option.photo)" alt="Option photo" />
                <div class="content">
                  <div class="font-bold">{{ option.label }}</div>
                  <div v-if="option.price" class="text-primary font-bold">
                    ₦{{ Number(option.price).toLocaleString() }}
                  </div>
                </div>
                <button
                  type="button"
                  @click="editable.option_group.options.splice(index, 1)"
                  class="text-sm circular trailing icon button ex-open-modal"
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
              class="text-sm text-error"
              v-for="error of validation.editable.r$.option_group.options.$self?.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
        </fieldset>
      </div>
      <div v-if="editable.option_group" class="field">
        <label>Product sub-option</label>
        <div class="text-sm opacity-65">
          <p>
            A sub-option group can also be added if necessary. For example, if your main option
            group is "Size," your sub-option group could be "Colour." This enables customers to
            select a combination of size and colour for the product.
          </p>
          <p>
            Just so you know, sub-option can only be added if there are options in the main option
            group. sub-option can also be customized under each options of the main option group.
          </p>
        </div>
        <button
          type="button"
          v-if="!editable.sub_option_group"
          @click="createNewProductOption"
          class="compact button"
        >
          Add a sub option group
        </button>
        <fieldset v-if="editable.sub_option_group" class="flex flex-col gap-2">
          <button
            type="button"
            @click="editable.sub_option_group = undefined"
            v-tooltip:aria.unblocking
            aria-label="Remove sub-option group"
            class="ml-auto text-sm circular bg-transparent icon button"
          >
            <Icon name="material-symbols:close-rounded" />
          </button>
          <div class="field">
            <label>sub-option group title</label>
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
              class="text-sm text-error"
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
                    ₦{{ Number(option.price).toLocaleString() }}
                  </div>
                </div>
                <button
                  type="button"
                  @click="editable.sub_option_group.options.splice(index, 1)"
                  class="text-sm circular trailing icon button ex-open-modal"
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
              class="text-sm text-error"
              v-for="error of validation.editable.r$.sub_option_group.options.$self?.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
        </fieldset>
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
        <div class="flex items-center flex-wrap gap-3">
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
                  <div class="text-sm text-error" v-for="error of spec.name.$errors" :key="error">
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
                  <div class="text-sm text-error" v-for="error of spec.value.$errors" :key="error">
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
                  class="text-sm circular outlined icon button"
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
                  class="text-sm text-center font-normal mb-3 text-error"
                  v-for="error of validation.editable.r$.specifications.$self.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
                <button type="button" @click="addSpecification()" class="compact w-full button">
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
          class="text-sm text-error"
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
          class="flex flex-col items-center relative w-max mb-3"
        >
          <Icon name="mdi:file-pdf-box" class="text-6xl text-red-500" />
          <div class="text-sm">
            {{
              typeof editable.details_attachment === "string"
                ? editable.details_attachment.split("/").slice(-1)[0]
                : editable.details_attachment.name
            }}
          </div>
          <div v-if="typeof editable.details_attachment !== 'string'" class="text-sm">
            {{ (editable.details_attachment.size / 1024 / 1024).toFixed(1) }}MB
          </div>
          <a
            v-else
            :href="editable.details_attachment"
            target="_blank"
            class="text-sm mt-1 compact button"
          >
            View attachment
          </a>
          <button
            type="button"
            @click="editable.details_attachment = undefined"
            class="text-xs compact circular outlined button bg-overlay"
            style="position: absolute; top: 0.25rem; right: 0.25rem"
          >
            <Icon name="material-symbols:close-rounded" />
          </button>
        </div>
        <label v-else class="icon button design-takeover">
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
      <button type="submit" class="sr-only">Next</button>
    </form>
    <footer
      class="sticky bg-surface p-4 pin-bottom-blend z-level-1"
      style="bottom: 0px; margin-top: 0.5rem"
    >
      <div class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our
          <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
        </p>
        <button @click="nextTab" class="primary button">Next</button>
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
        <div class="header flex gap-3">
          <div class="font-bold truncate">
            {{ optionPlaceholderModifying ? "Modify" : "Add" }} an option
          </div>
          <button
            type="button"
            class="circular flat button as-text exit-modal"
            style="margin-left: auto"
          >
            <Icon name="material-symbols:close-rounded" />
          </button>
        </div>
        <form class="content">
          <div class="field">
            <label>Label</label>
            <input
              v-model="optionPlaceholder.label"
              class="form-item"
              id="option-label"
              :class="{
                error: validation.optionPlaceholder.r$.label.$error,
              }"
              md-autofocus
              type="text"
              placeholder="Option label"
            />
            <div
              class="text-sm text-error"
              v-for="error of validation.optionPlaceholder.r$.label.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Price (optional)</label>
            <LimbCurrencyInput
              v-model="optionPlaceholder.price"
              id="option-price"
              class="form-item"
              placeholder="Option price"
            />
          </div>
          <div class="field">
            <label>Option unique picture (optional)</label>
            <div v-if="optionPlaceholder.photo" class="flex flex-col items-center relative w-max">
              <img
                :src="utils.fileToURL(optionPlaceholder.photo)"
                alt="Product photo"
                class="thumbnail"
              />
              <button
                type="button"
                @click="optionPlaceholder.photo = undefined"
                class="text-xs compact circular outlined button bg-overlay"
                style="position: absolute; top: 0.25rem; right: 0.25rem"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div v-if="typeof optionPlaceholder.photo !== 'string'" class="text-sm">
                {{ (optionPlaceholder.photo.size / 1024 / 1024).toFixed(1) }}MB
              </div>
            </div>
            <div
              class="text-sm text-error"
              v-for="error of validation.optionPlaceholder.r$.photo.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
            <label class="icon button design-takeover">
              <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
                `${optionPlaceholder.photo ? "Change photo" : "Add photo"}`
              }}
              <input
                type="file"
                @change="optionPlaceholder.photo = ($event.target as HTMLInputElement).files?.[0]"
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
              {{ optionPlaceholderModifying ? "Modify" : "Add" }} option
            </button>
          </div>
          <div v-if="optionPlaceholder.sub_options" class="field">
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
                    active: !!optionPlaceholder.sub_options[index]!.is_active,
                  }"
                  @click="
                    optionPlaceholder.sub_options[index]!.is_active =
                      !optionPlaceholder.sub_options[index]!.is_active
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
                <div class="content">
                  <div class="font-bold">{{ option.label }}</div>
                  <label class="text-primary"
                    >₦
                    <LimbCurrencyInput
                      v-model="optionPlaceholder.sub_options[index]!.price"
                      :id="`sub-option${index}-price`"
                      @input="
                        optionPlaceholder.sub_options![index]!.price_changed! =
                          $event.target.value !== option.price
                      "
                      class="form-item text-fit text-primary"
                      placeholder="Add option price"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </LimbModal>
    <LimbModal id="upload-status" :options="{ closeOnEsc: false, closeOnWrapperClick: false }">
      <div class="dialog centered max-w-125">
        <div class="content">
          <div v-if="progress.completed" class="flex flex-col items-center gap-3">
            <Icon
              name="material-symbols:check-circle-outline-rounded"
              class="text-success text-5xl"
            />
            <p class="text-center m-0">Product added successfully!</p>
            <div class="flex gap-4 w-full *:flex-1">
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
            <p class="text-center m-0">An error occurred.</p>
            <div class="flex gap-4 w-full *:flex-1">
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
      </div>
    </LimbModal>
  </div>
</template>
