<script lang="ts" setup>
import { url, required, requiredIf } from '@regle/rules';
import { useSortable } from '@vueuse/integrations/useSortable';

definePageMeta({
  name: 'add-product',
  layout: 'details',
  auth: false,
  noCart: true,
});

const newProduct = reactive<{
  tab1: {
    category?: string;
    newCategory?: string;
    title?: string;
    photos: File[];
    videoLink?: string;
  };
  tab2: {
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
  tab2: {},
  tab3: {
    specifications: [],
  },
});
const optionPlaceholder = ref<{
  label: string;
  price?: number;
  photo?: File;
  subOptions?: {
    isActive: boolean;
    label: string;
    price?: number;
    priceChanged?: boolean;
  }[];
}>({
  label: '',
});
const validation = {
  tab1: useRegle(newProduct.tab1, {
    category: {
      required: withMessage(required, 'Product category is required'),
    },
    newCategory: {
      required: withMessage(
        requiredIf(() => newProduct.tab1.category === 'others'),
        'New category name is required'
      ),
    },
    title: { required: withMessage(required, 'Product title is required') },
    photos: {
      $rewardEarly: true,
      minLength: withMessage(
        (value) => (value as []).length > 1,
        'At least two product photo is required.'
      ),
      size: withMessage(
        (value) =>
          !Boolean(
            (value as []).find((el) => (el as File).size >= 5 * 1024 * 1024)
          ),
        'Each photo must be less than 5MB in size.'
      ),
    },
    videoLink: { url },
  }),
  tab2: useRegle(newProduct.tab2, {
    price: {
      required: withMessage(
        (value) => (value as number) > 0,
        'A base price must be specified for the product.'
      ),
    },
    optionGroup: {
      title: {
        required: withMessage(
          requiredIf(() => typeof newProduct.tab2.optionGroup === 'object'),
          'A title must be specified for this option group.'
        ),
      },
      options: {
        $rewardEarly: true,
        minLength: withMessage(
          (value) =>
            typeof newProduct.tab2.optionGroup !== 'object' ||
            (value as []).length > 1,
          'At least two option must be added here.'
        ),
        $each: {
          label: { required },
        },
      },
    },
    subOptionGroup: {
      title: {
        required: withMessage(
          requiredIf(() => typeof newProduct.tab2.subOptionGroup === 'object'),
          'A title must be specified for this option group.'
        ),
      },
      options: {
        $rewardEarly: true,
        minLength: withMessage(
          (value) =>
            typeof newProduct.tab2.optionGroup !== 'object' ||
            (value as []).length > 1,
          'At least two option must be added here.'
        ),
        $each: {
          label: { required },
        },
      },
    },
  }),
  tab3: useRegle(newProduct.tab3, {
    specifications: {
      minLength: withMessage(
        (value) => (value as []).length > 1,
        'At least two product specification is required.'
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
      $rewardEarly: true,
      required: withMessage(
        required,
        'A unique label must be specified for this option.'
      ),
      unique: withMessage((value) => {
        let existsInMain =
          newProduct.tab2.optionGroup?.options.some(
            (option) => option.label === value
          ) ?? false;
        let existsInSub =
          newProduct.tab2.subOptionGroup?.options.some(
            (option) => option.label === value
          ) ?? false;
        return (
          (!existsInMain && !existsInSub) || optionPlaceholderModifying.value
        );
      }, 'An option with this label already exists.'),
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

watchEffect(() => {
  if (
    newProduct.tab2.subOptionGroup?.options === undefined &&
    newProduct.tab2.optionGroup
  ) {
    newProduct.tab2.optionGroup.options.forEach((option) => {
      option.subOptions = undefined;
    });
  } else if (newProduct.tab2.optionGroup) {
    newProduct.tab2.optionGroup.options.forEach((option) => {
      option.subOptions = option.subOptions || [];
      let newMap = newProduct.tab2.subOptionGroup?.options.map((el, index) => ({
        isActive:
          option.subOptions![index]?.label === el.label
            ? option.subOptions![index].isActive
            : true,
        label: el.label,
        price:
          option.subOptions![index]?.label === el.label &&
          option.subOptions![index]?.priceChanged
            ? option.subOptions![index]!.price
            : el.price,
        priceChanged: option.subOptions![index]?.priceChanged,
      }));

      option.subOptions = newMap;
    });
  }
});

function focusNewCategory() {
  nextTick(() => document.getElementById('prod-category-new')?.focus());
}
function handleNewPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  newProduct.tab1.photos.push(input.files?.[0] as File);
  input.value = '';
  nextTick(() => input.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
async function createNewProductOption() {
  if (newProduct.tab2.optionGroup) {
    newProduct.tab2.subOptionGroup = {
      title: '',
      options: [],
    };
    await nextTick();
    validation.tab2.r$.subOptionGroup.$reset();
    document.getElementById('sub-option-group-title')?.focus();
    document
      .getElementById('sub-option-group-title')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    newProduct.tab2.optionGroup = {
      title: '',
      options: [],
    };
    await nextTick();
    validation.tab2.r$.optionGroup.$reset();
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
        ? newProduct.tab2.subOptionGroup?.options[optionId]
        : newProduct.tab2.optionGroup?.options[optionId];
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
      if (newProduct.tab2.subOptionGroup?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newProduct.tab2.subOptionGroup.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newProduct.tab2.subOptionGroup.options.splice(optionId, 1);
      }
    } else if (callergroup === 'main') {
      if (newProduct.tab2.optionGroup?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newProduct.tab2.optionGroup.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newProduct.tab2.optionGroup.options.splice(optionId, 1);
      }
    }
  } else if (optionPlaceholder.value.label.trim()) {
    if (callergroup === 'sub')
      newProduct.tab2.subOptionGroup?.options.push({
        ...optionPlaceholder.value,
      });
    else if (callergroup === 'main')
      newProduct.tab2.optionGroup?.options.push({ ...optionPlaceholder.value });
  }

  optionPlaceholder.value = {
    label: '',
  };
  exit();
}
function addSpecification() {
  newProduct.tab3.specifications.push({ name: '', value: '' });
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
        '.tab-page.active .error, .tab-page.active .error-text'
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
  }
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
          <p class="supp-text faint-text">
            Choose a category from the dropdown below that best fits the product
            you're adding. You can also select “Others” from the dropdown to
            make a new one.
          </p>
          <LimbDropdown
            v-model="newProduct.tab1.category"
            class="search select"
            :class="{ error: validation.tab1.r$.category.$error }"
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
              <div data-value="others" class="item" @click="focusNewCategory">
                Others
              </div>
            </div>
          </LimbDropdown>
          <ul
            v-if="validation.tab1.r$.category.$error"
            class="supp-text error-text"
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
        <div v-if="newProduct.tab1.category === 'others'" class="field">
          <label for="prod-category-new">New category name</label>
          <div class="supp-text faint-text">
            Note: Your product will stay in the “Others” category of our explore
            section until the new category is reviewed and standardized.
          </div>
          <input
            v-model="newProduct.tab1.newCategory"
            id="prod-category-new"
            class="form-item"
            :class="{ error: validation.tab1.r$.newCategory.$error }"
            type="text"
            placeholder="Category name"
            required
          />
          <ul
            v-if="validation.tab1.r$.newCategory.$error"
            class="supp-text error-text"
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
          <label for="prod-title">Title</label>
          <div class="supp-text faint-text">
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
            required
          />
          <ul
            v-if="validation.tab1.r$.title.$error"
            class="supp-text error-text"
          >
            <li v-for="error of validation.tab1.r$.title.$errors" :key="error">
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="field">
          <label>Add photo</label>
          <div class="supp-text faint-text">
            Photos help customers to see the product. Use clear, well-lit images
            that showcase the product from different angles.
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
                class="mini circular icon button"
                style="position: absolute; top: 0.25rem; right: 0.25rem"
              >
                <Icon name="material-symbols:delete-outline-rounded" />
              </button>
              <div class="small">
                {{ (photo.size / 1024 / 1024).toFixed(1) }}MB
              </div>
            </div>
          </LimbIScroller>
          <ul
            v-if="validation.tab1.r$.photos.$error"
            class="supp-text error-text"
          >
            <li v-for="error in validation.tab1.r$.photos.$errors" :key="error">
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
          <label class="icon button design-takeover">
            <Icon name="material-symbols:add" /> Add
            {{ newProduct.tab1.photos.length ? 'another' : '' }} photo
            <input type="file" @change="handleNewPhoto" accept="image/*" />
          </label>
        </div>
        <div class="field">
          <label>Link to youtube or Facebook video</label>
          <input
            v-model="newProduct.tab1.videoLink"
            class="form-item"
            :class="{ error: validation.tab1.r$.videoLink.$error }"
            type="text"
            placeholder="e.g. https://youtube.com/..."
          />
          <ul
            v-if="validation.tab1.r$.videoLink.$error"
            class="supp-text error-text"
          >
            <li
              v-for="error of validation.tab1.r$.videoLink.$errors"
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
        <div class="field">
          <label for="prod-price">Price</label>
          <div class="supp-text faint-text">
            If there is a product options, price here should be the lower price
            option. Price can also be added with product options.
          </div>
          <LimbCurrencyInput
            v-model="newProduct.tab2.price"
            id="prod-price"
            class="form-item"
            :class="{ error: validation.tab2.r$.price.$error }"
            placeholder="Product price"
            required
          />
          <ul
            v-if="validation.tab2.r$.price.$error"
            class="supp-text error-text"
          >
            <li v-for="error of validation.tab2.r$.price.$errors" :key="error">
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="field">
          <label>Product options</label>
          <div class="supp-text faint-text">
            Product options are variations of the product, such as color, size,
            or config option. You can add a maximum of two option groups.
          </div>
          <button
            v-if="!newProduct.tab2.optionGroup"
            @click="createNewProductOption"
            class="compact button"
          >
            Add an option group
          </button>
          <fieldset
            v-if="newProduct.tab2.optionGroup"
            class="flex flex-col gap-2"
          >
            <button
              @click="
                (newProduct.tab2.optionGroup = undefined),
                  (newProduct.tab2.subOptionGroup = undefined)
              "
              v-tooltip:aria.unblocking
              aria-label="Remove option group"
              class="ml-auto small circular outlined icon button"
            >
              <Icon name="material-symbols:delete-outline-rounded" />
            </button>
            <div class="field">
              <label>Option group title</label>
              <input
                v-model="newProduct.tab2.optionGroup.title"
                class="form-item"
                :class="{
                  error: validation.tab2.r$.optionGroup.title.$error,
                }"
                id="option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
              <ul
                v-if="validation.tab2.r$.optionGroup.title.$error"
                class="supp-text error-text"
              >
                <li
                  v-for="error of validation.tab2.r$.optionGroup.title.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:close-rounded" />
                  {{ error }}
                </li>
              </ul>
            </div>
            <div class="lined sub heading a-block">
              Options for:
              <div class="trailing">
                {{ newProduct.tab2.optionGroup.title }}
              </div>
            </div>
            <div class="field">
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in newProduct.tab2.optionGroup.options"
                  class="item open-modal"
                  data-target="app-option"
                  :data-option-id="index"
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
                      newProduct.tab2.optionGroup.options.splice(index, 1)
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
              <ul
                v-if="validation.tab2.r$.optionGroup.options.$self.$error"
                class="supp-text error-text"
              >
                <li
                  v-for="error of validation.tab2.r$.optionGroup.options.$self
                    .$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:close-rounded" />
                  {{ error }}
                </li>
              </ul>
            </div>
          </fieldset>
        </div>
        <div v-if="newProduct.tab2.optionGroup" class="field">
          <label>Product sub-options</label>
          <div class="supp-text faint-text">
            <p>
              A sub-options group can also be added if necessary. For example,
              if your main option group is "Size," your sub-option group could
              be "Colour." This enables customers to select a combination of
              size and colour for the product.
            </p>
            <p>
              Just so you know, sub-options can only be added if there are
              options in the main option group.
            </p>
          </div>
          <button
            v-if="!newProduct.tab2.subOptionGroup"
            @click="createNewProductOption"
            class="compact button"
          >
            Add a sub option group
          </button>
          <fieldset
            v-if="newProduct.tab2.subOptionGroup"
            class="flex flex-col gap-2"
          >
            <button
              @click="newProduct.tab2.subOptionGroup = undefined"
              v-tooltip:aria.unblocking
              aria-label="Remove sub-option group"
              class="ml-auto small circular outlined icon button"
            >
              <Icon name="material-symbols:delete-outline-rounded" />
            </button>
            <div class="field">
              <label>Sub-option group title</label>
              <input
                v-model="newProduct.tab2.subOptionGroup.title"
                class="form-item"
                :class="{
                  error: validation.tab2.r$.subOptionGroup.title.$error,
                }"
                id="sub-option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
              <ul
                v-if="validation.tab2.r$.subOptionGroup.title.$error"
                class="supp-text error-text"
              >
                <li
                  v-for="error of validation.tab2.r$.subOptionGroup.title
                    .$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:close-rounded" />
                  {{ error }}
                </li>
              </ul>
            </div>
            <div class="lined sub heading a-block">
              Options for:
              <div class="trailing">
                {{ newProduct.tab2.subOptionGroup.title }}
              </div>
            </div>
            <div class="wrappable menu">
              <div
                v-for="(option, index) in newProduct.tab2.subOptionGroup
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
                    newProduct.tab2.subOptionGroup.options.splice(index, 1)
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
                  :class="{
                    error: validation.optionPlaceholder.r$.label.$error,
                  }"
                  md-autofocus
                  type="text"
                  placeholder="Option label"
                  required
                />
                <ul
                  v-if="validation.optionPlaceholder.r$.label.$error"
                  class="supp-text error-text"
                >
                  <li
                    v-for="error of validation.optionPlaceholder.r$.label
                      .$errors"
                    :key="error"
                  >
                    <Icon name="material-symbols:close-rounded" />
                    {{ error }}
                  </li>
                </ul>
              </div>
              <div class="field">
                <label>Price (optional)</label>
                <LimbCurrencyInput
                  v-model="optionPlaceholder.price"
                  class="form-item"
                  placeholder="Option price"
                />
              </div>
              <div class="field">
                <label>Option unique picture (optional)</label>
                <div v-if="optionPlaceholder.photo" class="thumbnail image">
                  <img
                    :src="utils.fileToURL(optionPlaceholder.photo)"
                    alt="Product photo"
                  />
                  <button
                    @click="optionPlaceholder.photo = undefined"
                    class="small circular icon button"
                    style="position: absolute; top: 0.25rem; right: 0.25rem"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </div>
                <label
                  v-if="!optionPlaceholder.photo"
                  class="icon button design-takeover"
                >
                  <Icon name="material-symbols:add" /> Add photo
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
              <div v-if="optionPlaceholder.subOptions" class="field">
                <label>Sub-options group</label>
                <div class="supp-text faint-text">
                  Toggle the sub-options you want to add to this option. You can
                  also click on the price to modify it.
                </div>
                <div
                  v-if="newProduct.tab2.subOptionGroup"
                  class="wrappable menu"
                >
                  <div
                    v-for="(option, index) in newProduct.tab2.subOptionGroup
                      .options"
                    class="item"
                  >
                    <div
                      class="icon"
                      :class="{
                        active: Boolean(
                          optionPlaceholder.subOptions[index]!.isActive
                        ),
                      }"
                      @click="
                        optionPlaceholder.subOptions[index]!.isActive =
                          !optionPlaceholder.subOptions[index]!.isActive
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
                          v-model="optionPlaceholder.subOptions[index]!.price"
                          @input="
                            optionPlaceholder.subOptions![
                              index
                            ]!.priceChanged! =
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
          <div class="supp-text faint-text">
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
                  @click="
                    newProduct.tab3.specifications = template.map((spec) => ({
                      name: spec,
                      value: '',
                    }))
                  "
                >
                  {{ templateName }}
                </div>
              </div>
            </LimbDropdown>
          </div>
          <table class="basic table align-top">
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
                      class="form-item w-full"
                      :class="{ error: spec.name.$error }"
                      type="text"
                      placeholder="Specification name"
                    />
                    <ul v-if="spec.name.$error" class="supp-text error-text">
                      <li v-for="error of spec.name.$errors" :key="error">
                        <Icon name="material-symbols:close-rounded" />
                        {{ error }}
                      </li>
                    </ul>
                  </div>
                </td>
                <td>
                  <div class="field">
                    <input
                      v-model="spec.value.$value"
                      class="form-item w-full"
                      :class="{ error: spec.value.$error }"
                      type="text"
                      placeholder="Specification value"
                    />
                    <ul v-if="spec.value.$error" class="supp-text error-text">
                      <li v-for="error of spec.value.$errors" :key="error">
                        <Icon name="material-symbols:close-rounded" />
                        {{ error }}
                      </li>
                    </ul>
                  </div>
                </td>
                <td class="text-center">
                  <button
                    @click="newProduct.tab3.specifications.splice(index, 1)"
                    v-tooltip:aria.unblocking
                    aria-label="Remove specification"
                    class="small circular outlined icon button"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  <button
                    @click="addSpecification"
                    class="compact w-full button"
                  >
                    <Icon name="material-symbols:add" /> Add specification
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
          <ul
            v-if="validation.tab3.r$.specifications.$self.$error"
            class="supp-text error-text"
          >
            <li
              v-for="error of validation.tab3.r$.specifications.$self.$errors"
              :key="error"
            >
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="field">
          <label>Your review</label>
          <p class="supp-text faint-text">
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
          <ul
            v-if="validation.tab3.r$.overview.$error"
            class="supp-text error-text"
          >
            <li
              v-for="error of validation.tab3.r$.overview.$errors"
              :key="error"
            >
              <Icon name="material-symbols:close-rounded" />
              {{ error }}
            </li>
          </ul>
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
  </div>
</template>
