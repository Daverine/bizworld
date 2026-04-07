<script lang="ts" setup>
import type { Maybe } from '@regle/core';
import { url, required, requiredIf } from '@regle/rules';
import { useSortable } from '@vueuse/integrations/useSortable';
import axios from 'axios';
import type { InternalApi } from 'nitropack';

definePageMeta({
  name: 'add-product',
  layout: 'details',
  auth: false,
  noCart: true,
});

const route = useRoute();
const newProduct = reactive<{
  tab1: {
    category?: string;
    new_category?: string;
    title?: string;
    photos: (File | string)[];
    video_link?: string;
  };
  tab2: {
    base_price: number;
    option_group?: {
      title: string;
      options: {
        label: string;
        price?: number;
        photo?: File | string;
        sub_options?: {
          is_active: boolean;
          label: string;
          price?: number;
          price_changed?: boolean;
        }[];
      }[];
    };
    sub_option_group?: {
      title: string;
      options: { label: string; price?: number; photo?: File | string }[];
    };
  };
  tab3: {
    specifications: {
      name: string;
      value: string;
    }[];
    overview?: string;
  };
}>({
  tab1: {
    photos: [],
  },
  tab2: {
    base_price: 0,
  },
  tab3: {
    specifications: [],
  },
});
const optionPlaceholder = ref<{
  label: string;
  price?: number;
  photo?: File | string;
  sub_options?: {
    is_active: boolean;
    label: string;
    price?: number;
    price_changed?: boolean;
  }[];
}>({
  label: '',
});
const validation = {
  tab1: useRegle(newProduct.tab1, {
    category: {
      required: withMessage(required, 'Product category is required'),
    },
    new_category: {
      required: withMessage(
        requiredIf(() => newProduct.tab1.category === 'others'),
        'New category name is required',
      ),
    },
    title: { required: withMessage(required, 'Product title is required') },
    photos: {
      $rewardEarly: true,
      minLength: withMessage(
        (value) => (value as []).length > 1,
        'At least two product photo is required.',
      ),
      size: withMessage(
        (value) =>
          !Boolean(value && (value as (File | string)[]).some((el) => typeof el !== 'string' && el.size >= 5 * 1024 * 1024)),
        'Each photo must be less than 5MB in size.',
      ),
    },
    video_link: { url },
  }),
  tab2: useRegle(newProduct.tab2, {
    base_price: {
      required: withMessage(
        (value: Maybe<number>) => typeof value === 'number' && value > 0,
        'A base price must be specified for the product.',
      ),
    },
    option_group: {
      title: {
        required: withMessage(
          requiredIf(() => utils.isObject(newProduct.tab2.option_group)),
          'A title must be specified for this options group.',
        ),
      },
      options: {
        $rewardEarly: true,
        minLength: withMessage(
          (value) =>
            !utils.isObject(newProduct.tab2.option_group) ||
            (value as []).length > 1,
          'At least two option must be added here.',
        ),
      },
    },
    sub_option_group: {
      title: {
        required: withMessage(
          requiredIf(() => utils.isObject(newProduct.tab2.sub_option_group)),
          'A title must be specified for this options group.',
        ),
      },
      options: {
        $rewardEarly: true,
        minLength: withMessage(
          (value) =>
            !utils.isObject(newProduct.tab2.sub_option_group) ||
            (value as []).length > 1,
          'At least two option must be added here.',
        ),
      },
    },
  }),
  tab3: useRegle(newProduct.tab3, {
    specifications: {
      $rewardEarly: true,
      minLength: withMessage(
        (value) => (value as []).length > 1,
        'At least two product specification is required.',
      ),
      $each: {
        name: { required },
        value: { required },
      },
    },
    overview: {
      required: withMessage(required, 'Product overview is required'),
    },
  }),
  optionPlaceholder: useRegle(optionPlaceholder, {
    label: {
      required: withMessage(
        required,
        'A unique label must be specified for this option.',
      ),
      unique: withMessage((value) => {
        let existsInMain =
          newProduct.tab2.option_group?.options.some(
            (option) => option.label === value,
          ) ?? false;
        let existsInSub =
          newProduct.tab2.sub_option_group?.options.some(
            (option) => option.label === value,
          ) ?? false;
        return (
          (!existsInMain && !existsInSub) || optionPlaceholderModifying.value
        );
      }, 'An option with this label already exists.'),
    },
    photo: {
      maxSize: withMessage(
        maxFileSize(5 * 1024 * 1024),
        'Selected photo must be less than 5MB in size.',
      ),
    },
  }),
};
const optionPlaceholderModifying = ref(false);
const productCategories = {
  'Computers & Accessories': [
    'Brand',
    'Model',
    'Condition',
    'Processor',
    'RAM',
    'Storage',
    'Display Size',
    'Battery Life',
    'Operating System',
    'Connectivity',
    'Camera',
    'Weight',
    'Dimensions',
  ],
  'Phones & Tablets': [
    'Brand',
    'Model',
    'Condition',
    'Processor',
    'RAM',
    'Storage',
    'Display Size',
    'Battery Life',
    'Operating System',
    'Connectivity',
    'Camera',
    'Weight',
    'Dimensions',
  ],
  'Home Appliances': [
    'Brand',
    'Model',
    'Condition',
    'Power Consumption',
    'Capacity',
    'Dimensions',
    'Weight',
    'Color',
    'Material',
  ],
  'Fashion & Beauty': [
    'Brand',
    'Material',
    'Size',
    'Color',
    'Fit Type',
    'Care Instructions',
    'Pattern',
    'Sleeve Length',
    'Neckline',
  ],
  'Sports & Fitness': [
    'Brand',
    'Type',
    'Material',
    'Size/Dimensions',
    'Weight',
    'Color',
  ],
  'Books & Stationery': [
    'Author',
    'Publisher',
    'ISBN',
    'Language',
    'Pages',
    'Genre',
  ],
  Automotive: [
    'Make',
    'Model',
    'Year',
    'Mileage',
    'Condition',
    'Engine Type',
    'Transmission',
    'Fuel Type',
    'Color',
  ],
  'Health & Wellness': [
    'Brand',
    'Type',
    'Ingredients/Materials',
    'Size/Dimensions',
    'Weight',
    'Usage Instructions',
  ],
};
const progress = ref<{
  message: string;
  loaded: null | number;
  completed: boolean;
}>({
  message: '',
  loaded: null,
  completed: false,
});

watchEffect(() => {
  if (
    newProduct.tab2.sub_option_group?.options === undefined &&
    newProduct.tab2.option_group
  ) {
    newProduct.tab2.option_group.options.forEach((option) => {
      option.sub_options = undefined;
    });
  } else if (newProduct.tab2.option_group) {
    newProduct.tab2.option_group.options.forEach((option) => {
      option.sub_options = option.sub_options || [];
      let newMap = newProduct.tab2.sub_option_group?.options.map((el, index) => ({
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
    [...input.files].forEach((file) => newProduct.tab1.photos.push(file));
    input.value = '';
    nextTick(() =>
      input.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
  }
}
async function createNewProductOption() {
  if (newProduct.tab2.option_group) {
    newProduct.tab2.sub_option_group = {
      title: '',
      options: [],
    };
    await nextTick();
    validation.tab2.r$.sub_option_group.$reset();
    document.getElementById('sub-option-group-title')?.focus();
    document
      .getElementById('sub-option-group-title')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    newProduct.tab2.option_group = {
      title: '',
      options: [],
    };
    await nextTick();
    validation.tab2.r$.option_group.$reset();
    document.getElementById('option-group-title')?.focus();
    document
      .getElementById('option-group-title')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
async function configProductOption({ settings }: DialogEvent) {
  let caller = settings.caller!;
  let callergroup = caller.hasAttribute('data-sub-category') ? 'sub' : 'main';

  if (caller.dataset.optionId !== undefined) {
    let optionId = parseInt(caller.dataset.optionId);
    const option =
      callergroup === 'sub'
        ? newProduct.tab2.sub_option_group?.options[optionId]
        : newProduct.tab2.option_group?.options[optionId];
    if (option) {
      optionPlaceholderModifying.value = true;
      optionPlaceholder.value = { ...option };
    }
  } else {
    optionPlaceholderModifying.value = false;
    optionPlaceholder.value = {
      label: '',
    };
  }
  await nextTick();
  validation.optionPlaceholder.r$.$reset();
}
function processProductOption({ settings, exit }: Dialoger) {
  validation.optionPlaceholder.r$.$validate();
  if (validation.optionPlaceholder.r$.$invalid) return;

  let caller = settings.caller!;
  let callergroup = caller.hasAttribute('data-sub-category') ? 'sub' : 'main';

  if (caller.dataset.optionId !== undefined) {
    const optionId = parseInt(caller.dataset.optionId);
    if (callergroup === 'sub') {
      if (newProduct.tab2.sub_option_group?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newProduct.tab2.sub_option_group.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newProduct.tab2.sub_option_group.options.splice(optionId, 1);
      }
    } else if (callergroup === 'main') {
      if (newProduct.tab2.option_group?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newProduct.tab2.option_group.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newProduct.tab2.option_group.options.splice(optionId, 1);
      }
    }
  } else if (optionPlaceholder.value.label.trim()) {
    if (callergroup === 'sub')
      newProduct.tab2.sub_option_group?.options.push({
        ...optionPlaceholder.value,
      });
    else if (callergroup === 'main')
      newProduct.tab2.option_group?.options.push({ ...optionPlaceholder.value });
  }

  exit();
}
function addSpecification(template?: string[]) {
  if (template) {
    newProduct.tab3.specifications = template.map((spec) => ({
      name: spec,
      value: '',
    }));
    nextTick(() =>
      (
        document.querySelector(
          '#spec-table > tbody > tr:first-child > td:nth-child(2) input',
        ) as HTMLInputElement
      )?.focus(),
    );
  } else {
    newProduct.tab3.specifications.push({ name: '', value: '' });
    nextTick(() =>
      (
        document.querySelector(
          '#spec-table > tbody > tr:last-child > td:first-child input',
        ) as HTMLInputElement
      )?.focus(),
    );
  }
}

useSortable('#prodPhotos > .scroll-items', newProduct.tab1.photos);

const currentTab = ref('tab1');
async function nextTab() {
  const key = currentTab.value as keyof typeof validation;
  validation[key].r$.$validate();
  if (validation[key].r$.$invalid) {
    await nextTick();
    (
      document.querySelector(
        '.tab-page.active .error, .tab-page.active .error-text',
      ) as HTMLElement
    )?.focus();
    document
      .querySelector('.tab-page.active .error, .tab-page.active .error-text')
      ?.closest('.field')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const currentIndex = Object.keys(newProduct).indexOf(currentTab.value);
  if (currentIndex < Object.keys(newProduct).length - 1) {
    currentTab.value = Object.keys(newProduct)[currentIndex + 1] || '';
    await nextTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    (
      document
        .querySelector('.tab-page.active')
        ?.querySelector(utils.focusableElementsSelector) as HTMLElement
    )?.focus();
    return;
  }

  let uploader = document.querySelector('#upload-status');

  utils.triggerEvent(uploader!, 'dgconsole', 'open dialog');

  if (progress.value.completed) return;

  progress.value.loaded = null;
  progress.value.message = 'Preparing your product for upload...';
  await utils.notifyOnEvent(uploader!, 'isReady');

  const picData = new FormData();
  newProduct.tab1.photos.forEach((photo, index) => {
    if (typeof photo === 'string') return;
    picData.append('photos', photo, index.toString());
  });
  newProduct.tab2.option_group?.options.forEach((option, index) => {
    if (option.photo && typeof option.photo !== 'string')
      picData.append('optionsPhotos', option.photo, index.toString());
  });
  newProduct.tab2.sub_option_group?.options.forEach((option, index) => {
    if (option.photo && typeof option.photo !== 'string')
      picData.append('sub_optionsPhotos', option.photo, index.toString());
  });

  const picToURL = await axios.post(
    `/api/upload/picture/${route.params.id}/900`,
    picData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          if (progressEvent.loaded >= (progressEvent.total || 0)) {
            progress.value.loaded = null;
            progress.value.message = 'Optimizing photos for use...';
            return;
          }

          progress.value.loaded = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          progress.value.message =
            'Uploading product photos... ' + progress.value.loaded + '%';
        }
      },
    },
  );

  if (!picToURL.data) return;
  progress.value.loaded = null;
  progress.value.message = 'Finalizing...';

  const product = {
    business_id: route.params.id as string,
    ...structuredClone(toRaw(newProduct.tab1)),
    ...structuredClone(toRaw(newProduct.tab2)),
    ...structuredClone(toRaw(newProduct.tab3)),
  };

  Object.keys(picToURL.data).forEach((key) => {
    if (key === 'photos') {
      picToURL.data[key].forEach((elem: { filename: string; data: string }) => {
        product.photos[parseInt(elem.filename)] = elem.data;
      });
    } else if (key === 'optionsPhotos') {
      picToURL.data[key].forEach((elem: { filename: string; data: string }) => {
        product.option_group!.options[parseInt(elem.filename)]!.photo = elem.data;
      });
    } else if (key === 'sub_optionsPhotos') {
      picToURL.data[key].forEach((elem: { filename: string; data: string }) => {
        product.sub_option_group!.options[parseInt(elem.filename)]!.photo =
          elem.data;
      });
    }
  });
  const api = '/api/product/create' as const;
  type userResponse = InternalApi[typeof api]['post'];
  const resp = await axios.post<userResponse>(api, product);
  if (resp?.data) {
    progress.value.loaded = null;
    progress.value.message = 'Done';
  }
  await nextTick();
  progress.value.completed = true;
  return;
}
function prevTab() {
  const currentIndex = Object.keys(newProduct).indexOf(currentTab.value);
  if (currentIndex > 0) {
    currentTab.value = Object.keys(newProduct)[currentIndex - 1] || '';
  }
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
</script>

<template>
  <div class="container-md">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1"
      style="min-height: 5.75rem; margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 flex gap-3 justify-between items-end surface-bg pin-top-blend m-0"
      >
        Add product
        <NuxtLink
          :to="{
            name: 'manage-biz-products',
            params: { id: $route.params.id },
          }"
          class="compact small button"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
          <span class="content max-sm:hidden">Back</span>
        </NuxtLink>
      </div>
    </header>
    <div id="add-product" class="container-sm no-edge min-h-[80vh]">
      <div
        class="tab-page"
        v-for="id in ['tab1']"
        :class="currentTab === id ? 'active' : ''"
      >
        <div class="field">
          <label for="prod-category">Product category</label>
          <p class="text-sm faint-text">
            Choose a category from the dropdown below that best fits the product
            you're adding. You can also select “Others” from the dropdown to
            make a new one.
          </p>
          <LimbDropdown
            v-model="newProduct.tab1.category"
            type="search select"
            :class="{ error: validation.tab1.r$.category.$error }"
            @change="
              $event !== 'others' ||
              nextTick(() =>
                (utils.document().getElementById('prod-category-new')?.focus()),
              )
            "
            id="prod-category"
            placeholder="Select category"
          >
            <div class="drop menu">
              <div
                class="item"
                v-for="category in Object.keys(productCategories)"
              >
                {{ category }}
              </div>
              <div data-value="others" class="item">Others</div>
            </div>
          </LimbDropdown>
          <div
            class="text-sm error-text"
            v-for="error of validation.tab1.r$.category.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
        </div>
        <div v-if="newProduct.tab1.category === 'others'" class="field">
          <label for="prod-category-new">New category name</label>
          <div class="text-sm faint-text">
            Note: Your product will stay in the “Others” category of our explore
            section until the new category is reviewed and standardized.
          </div>
          <input
            v-model="newProduct.tab1.new_category"
            id="prod-category-new"
            class="form-item"
            :class="{ error: validation.tab1.r$.new_category.$error }"
            type="text"
            placeholder="Category name"
          />
          <div
            class="text-sm error-text"
            v-for="error of validation.tab1.r$.new_category.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
        </div>
        <div class="field">
          <label for="prod-title">Title</label>
          <div class="text-sm faint-text">
            It should be descriptive and unique as possible. Include brand name,
            model, and key features.
          </div>
          <input
            v-model="newProduct.tab1.title"
            id="prod-title"
            class="form-item"
            :class="{ error: validation.tab1.r$.title.$error }"
            type="text"
            placeholder="Product title"
          />
          <div
            class="text-sm error-text"
            v-for="error of validation.tab1.r$.title.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
        </div>
        <div class="field">
          <label>Add photo</label>
          <div class="text-sm faint-text">
            Photos help customers to see the product. Use clear, well-lit images
            that showcase the product from different angles. A photo can be
            dragged to re-order it.
          </div>
          <LimbIScroller
            id="prodPhotos"
            :options="{ autoSetup: true }"
            class="[&_.sortable-ghost]:opacity-0"
          >
            <div
              v-for="(photo, index) in newProduct.tab1.photos"
              class="flex flex-col items-center relative"
            >
              <img
                :src="utils.fileToURL(photo)"
                alt="Product photo"
                class="thumbnail"
              />
              <button
                @click="newProduct.tab1.photos.splice(index, 1)"
                class="text-xs compact circular outlined button overlay-bg"
                style="position: absolute; top: 0.25rem; right: 0.25rem"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div v-if="typeof photo !== 'string'" class="small">
                {{ (photo.size / 1024 / 1024).toFixed(1) }}MB
              </div>
            </div>
          </LimbIScroller>
          <div
            class="text-sm error-text"
            v-for="error in validation.tab1.r$.photos.$self.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
          <label class="icon button design-takeover">
            <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
              newProduct.tab1.photos.length ? 'Add more photos' : 'Add photos'
            }}
            <input
              type="file"
              multiple
              @change="handleNewPhoto"
              accept="image/*"
            />
          </label>
        </div>
        <div class="field">
          <label>Link to youtube or Facebook video</label>
          <input
            v-model="newProduct.tab1.video_link"
            id="prod-video"
            class="form-item"
            :class="{ error: validation.tab1.r$.video_link.$error }"
            type="text"
            placeholder="e.g. https://youtube.com/..."
          />
          <div
            class="text-sm error-text"
            v-for="error of validation.tab1.r$.video_link.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
        </div>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab2']"
        :class="currentTab === id ? 'active' : ''"
      >
        <div class="field">
          <label for="prod-price">Price</label>
          <div class="text-sm faint-text">
            If there is a product options, price here should be the lower price
            option. Price can also be added with product options.
          </div>
          <LimbCurrencyInput
            v-model="newProduct.tab2.base_price"
            id="prod-price"
            class="form-item"
            :class="{ error: validation.tab2.r$.base_price.$error }"
            placeholder="Product price"
          />
          <div
            class="text-sm error-text"
            v-for="error of validation.tab2.r$.base_price.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
        </div>
        <div class="field">
          <label>Product options</label>
          <div class="text-sm faint-text">
            Product options are variations of the product, such as color, size,
            or config option. You can add a maximum of two options groups.
          </div>
          <button
            v-if="!newProduct.tab2.option_group"
            @click="createNewProductOption"
            class="compact button"
          >
            Add an options group
          </button>
          <fieldset
            v-if="newProduct.tab2.option_group"
            class="flex flex-col gap-2"
          >
            <button
              @click="
                ((newProduct.tab2.option_group = undefined),
                (newProduct.tab2.sub_option_group = undefined))
              "
              v-tooltip:aria.unblocking
              aria-label="Remove options group"
              class="ml-auto small circular bg-transparent icon button"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div class="field">
              <label>Options group title</label>
              <input
                v-model="newProduct.tab2.option_group.title"
                class="form-item"
                :class="{
                  error: validation.tab2.r$.option_group.title.$error,
                }"
                id="option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
              <div
                class="text-sm error-text"
                v-for="error of validation.tab2.r$.option_group.title.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </div>
              <div class="lined sub heading a-block px-3">
                Add options below for:
                <div class="trailing">
                  {{ newProduct.tab2.option_group.title }}
                </div>
              </div>
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in newProduct.tab2.option_group.options"
                  class="item open-modal"
                  data-target="app-option"
                  :data-option-id="index"
                  v-tooltip.aria.unblocking
                  aria-label="Click to modify"
                >
                  <img
                    v-if="option.photo"
                    :src="utils.fileToURL(option.photo)"
                    alt="Option photo"
                  />
                  <div class="content">
                    <div class="font-bold">{{ option.label }}</div>
                    <div v-if="option.price" class="primary-text font-bold">
                      ₦{{ option.price.toLocaleString() }}
                    </div>
                  </div>
                  <button
                    @click="
                      newProduct.tab2.option_group.options.splice(index, 1)
                    "
                    class="small circular trailing icon button ex-open-modal"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </div>
                <button
                  class="button as-app open-modal"
                  data-target="app-option"
                >
                  <Icon class="huge" name="material-symbols:add" />
                  Add option
                </button>
              </div>
              <div
                class="text-sm error-text"
                v-for="error of validation.tab2.r$.option_group.options.$self
                  ?.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </div>
            </div>
          </fieldset>
        </div>
        <div v-if="newProduct.tab2.option_group" class="field">
          <label>Product sub-options</label>
          <div class="text-sm faint-text">
            <p>
              A sub-options group can also be added if necessary. For example,
              if your main options group is "Size," your sub-options group could
              be "Colour." This enables customers to select a combination of
              size and colour for the product.
            </p>
            <p>
              Just so you know, sub-options can only be added if there are
              options in the main options group. Sub-options can also be
              customized under each options of the main options group.
            </p>
          </div>
          <button
            v-if="!newProduct.tab2.sub_option_group"
            @click="createNewProductOption"
            class="compact button"
          >
            Add a sub options group
          </button>
          <fieldset
            v-if="newProduct.tab2.sub_option_group"
            class="flex flex-col gap-2"
          >
            <button
              @click="newProduct.tab2.sub_option_group = undefined"
              v-tooltip:aria.unblocking
              aria-label="Remove sub-options group"
              class="ml-auto small circular bg-transparent icon button"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div class="field">
              <label>Sub-options group title</label>
              <input
                v-model="newProduct.tab2.sub_option_group.title"
                class="form-item"
                :class="{
                  error: validation.tab2.r$.sub_option_group.title.$error,
                }"
                id="sub-option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
              <div
                class="text-sm error-text"
                v-for="error of validation.tab2.r$.sub_option_group.title.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </div>
              <div class="lined sub heading a-block px-3">
                Add options below for:
                <div class="trailing">
                  {{ newProduct.tab2.sub_option_group.title }}
                </div>
              </div>
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in newProduct.tab2.sub_option_group
                    .options"
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
                    <div v-if="option.price" class="primary-text font-bold">
                      ₦{{ option.price.toLocaleString() }}
                    </div>
                  </div>
                  <button
                    @click="
                      newProduct.tab2.sub_option_group.options.splice(index, 1)
                    "
                    class="small circular trailing icon button ex-open-modal"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </div>
                <button
                  class="button as-app open-modal"
                  data-sub-category
                  data-target="app-option"
                >
                  <Icon class="huge" name="material-symbols:add" />
                  Add option
                </button>
              </div>
              <div
                class="text-sm error-text"
                v-for="error of validation.tab2.r$.sub_option_group.options.$self
                  ?.$errors"
                :key="error"
              >
                <Icon name="material-symbols:close-rounded" />
                {{ error }}
              </div>
            </div>
          </fieldset>
        </div>
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
                {{ optionPlaceholderModifying ? 'Modify' : 'Add' }} an option
              </div>
              <button
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
                  class="text-sm error-text"
                  v-for="error of validation.optionPlaceholder.r$.label.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:close-rounded" />
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
                <div
                  v-if="optionPlaceholder.photo"
                  class="flex flex-col items-center relative w-max"
                >
                  <img
                    :src="utils.fileToURL(optionPlaceholder.photo)"
                    alt="Product photo"
                    class="thumbnail"
                  />
                  <button
                    type="button"
                    @click="optionPlaceholder.photo = undefined"
                    class="text-xs compact circular outlined button overlay-bg"
                    style="position: absolute; top: 0.25rem; right: 0.25rem"
                  >
                    <Icon name="material-symbols:close-rounded" />
                  </button>
                  <div v-if="typeof optionPlaceholder.photo !== 'string'" class="small">
                    {{
                      (optionPlaceholder.photo.size / 1024 / 1024).toFixed(1)
                    }}MB
                  </div>
                </div>
                <div
                  class="text-sm error-text"
                  v-for="error of validation.optionPlaceholder.r$.photo.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:close-rounded" />
                  {{ error }}
                </div>
                <label class="icon button design-takeover">
                  <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
                    `${optionPlaceholder.photo ? 'Change photo' : 'Add photo'}`
                  }}
                  <input
                    type="file"
                    @change="
                      optionPlaceholder.photo = (
                        $event.target as HTMLInputElement
                      ).files?.[0]
                    "
                    accept="image/*"
                  />
                </label>
              </div>
              <div class="field items-end">
                <button
                  class="primary button"
                  @click.prevent="processProductOption(control)"
                >
                  {{ optionPlaceholderModifying ? 'Modify' : 'Add' }} option
                </button>
              </div>
              <div v-if="optionPlaceholder.sub_options" class="field">
                <label>Sub-options group</label>
                <div class="text-sm faint-text">
                  Toggle the sub-options you want to add to this option. You can
                  also click on the price to modify it.
                </div>
                <div
                  v-if="newProduct.tab2.sub_option_group"
                  class="wrappable menu"
                >
                  <div
                    v-for="(option, index) in newProduct.tab2.sub_option_group
                      .options"
                    class="item"
                  >
                    <div
                      class="icon"
                      :class="{
                        active: Boolean(
                          optionPlaceholder.sub_options[index]!.is_active,
                        ),
                      }"
                      @click="
                        optionPlaceholder.sub_options[index]!.is_active =
                          !optionPlaceholder.sub_options[index]!.is_active
                      "
                    >
                      <Icon
                        name="material-symbols:check-box-outline-blank"
                        class="nview"
                      />
                      <Icon name="material-symbols:check" class="aview" />
                    </div>
                    <img
                      v-if="option.photo"
                      :src="utils.fileToURL(option.photo)"
                      alt="sub-option photo"
                    />
                    <div class="content">
                      <div class="font-bold">{{ option.label }}</div>
                      <label class="primary-text"
                        >₦
                        <LimbCurrencyInput
                          v-model="optionPlaceholder.sub_options[index]!.price"
                          :id="`sub-option${index}-price`"
                          @input="
                            optionPlaceholder.sub_options![
                              index
                            ]!.price_changed! =
                              $event.target.value !== option.price
                          "
                          class="form-item text-fit primary-text"
                          placeholder="Add option price"
                      /></label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </LimbModal>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab3']"
        :class="currentTab === id ? 'active' : ''"
      >
        <div class="field">
          <label>Product Specifications</label>
          <div class="text-sm faint-text">
            <p>
              Product specifications provide detailed information about the
              product's features, dimensions, materials, and other relevant
              details that help customers make informed purchasing decisions.
            </p>
            <p>
              You can add as many specifications as you want. Just click on the
              "Add specification" button below.
            </p>
          </div>
          <div class="flex items-center flex-wrap gap-3">
            <span>Or start by selecting a preset:</span>
            <LimbDropdown
              class="compact button"
              placeholder="Select a template"
            >
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
              <tr
                v-for="(spec, index) in validation.tab3.r$.specifications.$each"
              >
                <td>
                  <div class="field">
                    <input
                      v-model="spec.name.$value"
                      :id="`spec-name${index}`"
                      class="form-item w-full"
                      :class="{ error: spec.name.$error }"
                      type="text"
                      placeholder="Specification name"
                    />
                    <div
                      class="text-sm error-text"
                      v-for="error of spec.name.$errors"
                      :key="error"
                    >
                      <Icon name="material-symbols:close-rounded" />
                      {{ error }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="field">
                    <input
                      v-model="spec.value.$value"
                      :id="`spec-value${index}`"
                      class="form-item w-full"
                      :class="{ error: spec.value.$error }"
                      type="text"
                      placeholder="Specification value"
                    />
                    <div
                      class="text-sm error-text"
                      v-for="error of spec.value.$errors"
                      :key="error"
                    >
                      <Icon name="material-symbols:close-rounded" />
                      {{ error }}
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <button
                    @click="newProduct.tab3.specifications.splice(index, 1)"
                    v-tooltip:aria.unblocking
                    aria-label="Remove specification"
                    class="small circular outlined icon button"
                  >
                    <Icon name="material-symbols:close-rounded" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  <div
                    class="text-sm text-center font-normal mb-3 error-text"
                    v-for="error of validation.tab3.r$.specifications.$self
                      .$errors"
                    :key="error"
                  >
                    <Icon name="material-symbols:close-rounded" />
                    {{ error }}
                  </div>
                  <button
                    @click="addSpecification()"
                    class="compact w-full button"
                  >
                    <Icon name="material-symbols:add" /> Add specification
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="field">
          <label>Your review</label>
          <p class="text-sm faint-text">
            Share your personal review of the product. Highlight its key
            features, benefits, and what makes it a great choice for customers.
            A compelling description can help buyers make an informed decision.
          </p>
          <textarea
            v-model="newProduct.tab3.overview"
            class="form-item"
            :class="{ error: validation.tab3.r$.overview.$error }"
            rows="3"
            placeholder="Write your review here..."
          ></textarea>
          <div
            class="text-sm error-text"
            v-for="error of validation.tab3.r$.overview.$errors"
            :key="error"
          >
            <Icon name="material-symbols:close-rounded" />
            {{ error }}
          </div>
        </div>
      </div>
    </div>
    <footer
      class="sticky surface-bg p-4 pin-bottom-blend z-level-1"
      style="bottom: 0px; margin-top: 0.5rem"
    >
      <div v-if="currentTab === 'tab1'" class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our
          <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
        </p>
        <button @click="nextTab" class="primary button">Next</button>
      </div>
      <div v-else class="flex justify-between items-center gap-3">
        <span class="text-muted">
          {{ Object.keys(newProduct).indexOf(currentTab) + 1 }} of
          {{ Object.keys(newProduct).length }}
        </span>
        <div class="flex gap-3">
          <button @click="prevTab" class="flat button">Previous</button>
          <button @click="nextTab" class="primary button">
            {{
              currentTab === Object.keys(newProduct).pop() ? 'Finish' : 'Next'
            }}
          </button>
        </div>
      </div>
    </footer>
    <LimbModal
      id="upload-status"
      :options="{ closeOnEsc: false, closeOnWrapperClick: false }"
    >
      <div class="dialog centered max-w-125">
        <div class="content">
          <div
            v-if="progress.completed"
            class="flex flex-col items-center gap-3"
          >
            <Icon
              name="material-symbols:check-circle-outline-rounded"
              class="success-text text-5xl"
            />
            <p class="text-center m-0">Product added successfully!</p>
            <div class="flex gap-4 w-full *:flex-1">
              <NuxtLink
                :to="{
                  name: 'manage-biz-products',
                  params: { id: route.params.id },
                }"
                class="exit-modal primary button"
              >
                View products
              </NuxtLink>
              <button class="outlined button exit-modal">
                Add another product
              </button>
            </div>
          </div>
          <div v-else class="flex flex-col items-center gap-4">
            <div
              class="m3-progress"
              :class="{ indeterminate: !Boolean(progress.loaded) }"
              :style="{ '--progress': progress.loaded?.toString() || '0' }"
            ></div>
            <p>{{ progress.message }}</p>
          </div>
        </div>
      </div>
    </LimbModal>
  </div>
</template>
