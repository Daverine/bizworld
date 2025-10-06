<script setup lang="ts">
import type { DialogEvent } from '~/composables/dialoger';

definePageMeta({
  name: 'add-service',
  layout: 'details',
  auth: false,
  noCart: true,
});

const newService = reactive<{
  tab1: {
    category: string;
    newCategory?: string;
    title: string;
    photo: File[];
    videoLink: string;
  };
  tab2: {
    price?: number;
    optionGroup?: {
      title: string;
      options: {
        label: string;
        price?: number;
        photo?: File;
        subOptions?: [boolean, number | undefined][];
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
    category: '',
    title: '',
    photo: [],
    videoLink: '',
  },
  tab2: {
    price: undefined,
    optionGroup: undefined,
    subOptionGroup: undefined,
  },
  tab3: {
    specifications: [],
    overview: '',
  },
});
const optionPlaceholder = ref<{
  label: string;
  price?: number;
  photo?: File;
  subOptions?: [boolean, number | undefined][];
}>({
  label: '',
});
const optionPlaceholderModifying = ref(false);
const serviceCategories = {
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

watch(
  () => newService.tab2.subOptionGroup?.options,
  (newVal) => {
    if (newVal === undefined && newService.tab2.optionGroup) {
      newService.tab2.optionGroup.options.forEach((option) => {
        option.subOptions = undefined;
      });
    } else if (newService.tab2.optionGroup) {
      newService.tab2.optionGroup.options.forEach((option) => {
        option.subOptions = newService.tab2.subOptionGroup?.options.map(() => [
          true,
          undefined,
        ]);
      });
    }
  },
  { deep: true }
);

function focusNewCategory() {
  nextTick(() => document.getElementById('prod-category-new')?.focus());
}
function fileToURL(file: File) {
  return URL.createObjectURL(file);
}
function handleNewPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    newService.tab1.photo.push(input.files[0]);
    input.value = '';
  }
}
function createNewServiceOption() {
  if (newService.tab2.optionGroup) {
    newService.tab2.subOptionGroup = {
      title: '',
      options: [],
    };
    nextTick(() => document.getElementById('sub-option-group-title')?.focus());
  } else {
    newService.tab2.optionGroup = {
      title: '',
      options: [],
    };
    nextTick(() => document.getElementById('option-group-title')?.focus());
  }
}
function configServiceOption(event: DialogEvent) {
  let caller = event.caller!;
  let callergroup = caller.hasAttribute('data-sub-category') ? 'sub' : 'main';

  if (caller.dataset.optionId !== undefined) {
    let optionId = parseInt(caller.dataset.optionId);
    const option =
      callergroup === 'sub'
        ? newService.tab2.subOptionGroup?.options[optionId]
        : newService.tab2.optionGroup?.options[optionId];
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
}
function processServiceOption(event: DialogEvent) {
  let caller = event.caller!;
  let callergroup = caller.hasAttribute('data-sub-category') ? 'sub' : 'main';

  if (caller.dataset.optionId !== undefined) {
    const optionId = parseInt(caller.dataset.optionId);
    if (callergroup === 'sub') {
      if (newService.tab2.subOptionGroup?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newService.tab2.subOptionGroup.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newService.tab2.subOptionGroup.options.splice(optionId, 1);
      }
    } else if (callergroup === 'main') {
      if (newService.tab2.optionGroup?.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newService.tab2.optionGroup.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newService.tab2.optionGroup.options.splice(optionId, 1);
      }
    }
  } else if (optionPlaceholder.value.label.trim()) {
    if (callergroup === 'sub')
      newService.tab2.subOptionGroup?.options.push({
        ...optionPlaceholder.value,
      });
    else if (callergroup === 'main')
      newService.tab2.optionGroup?.options.push({ ...optionPlaceholder.value });
  }

  optionPlaceholder.value = {
    label: '',
  };
}
function addSpecification() {
  newService.tab3.specifications.push({ name: '', value: '' });
}

const currentTab = ref('tab1');
const nextTab = () => {
  const currentIndex = Object.keys(newService).indexOf(currentTab.value);
  if (currentIndex < Object.keys(newService).length - 1) {
    currentTab.value = Object.keys(newService)[currentIndex + 1] || '';
  }
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};
const prevTab = () => {
  const currentIndex = Object.keys(newService).indexOf(currentTab.value);
  if (currentIndex > 0) {
    currentTab.value = Object.keys(newService)[currentIndex - 1] || '';
  }
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};
</script>
<template>
  <div class="container-md">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1"
      style="min-height: 5.75rem; margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 flexbox guttered flex-separate align-end surface-bg pin-top-blend 0-margined"
      >
        Add service
        <NuxtLink
          :to="{
            name: 'manage-biz-services',
            params: { id: $route.params.id },
          }"
          class="compact small button"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
          <span class="content sm-and-down-hidden">Back</span>
        </NuxtLink>
      </div>
    </header>
    <div id="add-service" class="container-sm no-edge" style="min-height: 80vh">
      <div
        class="tab-page"
        v-for="id in ['tab1']"
        :class="currentTab === id ? 'active' : ''"
      >
        <div class="field">
          <label for="prod-category">Category</label>
          <div class="supp-text faint-text">
            Choose a category from the dropdown below that best fits the service
            you're adding. You can also select “Others” from the dropdown to
            make a new one.
          </div>
          <LimbDropdown
            v-model="newService.tab1.category"
            class="search select"
            id="prod-category"
            placeholder="Select category"
          >
            <div class="drop menu">
              <div
                class="item"
                v-for="category in Object.keys(serviceCategories)"
              >
                {{ category }}
              </div>
              <div data-value="others" class="item" @click="focusNewCategory">
                Others
              </div>
            </div>
          </LimbDropdown>
        </div>
        <div v-if="newService.tab1.category === 'others'" class="field">
          <label for="prod-category-new">New category name</label>
          <div class="supp-text faint-text">
            Note: Your service will stay in the “Others” category of our explore
            section until the new category is reviewed and standardized.
          </div>
          <input
            v-model="newService.tab1.newCategory"
            id="prod-category-new"
            class="form-item"
            type="text"
            placeholder="Category name"
            required
          />
        </div>
        <div class="field">
          <label for="prod-title">Title</label>
          <div class="supp-text faint-text">
            It should be descriptive and unique as possible. Include brand name,
            model, and key features.
          </div>
          <input
            v-model="newService.tab1.title"
            id="prod-title"
            class="form-item"
            type="text"
            placeholder="Service title"
            required
          />
        </div>
        <div class="field">
          <label>Add photo</label>
          <div class="supp-text faint-text">
            Photos help customers to see the service. Use clear, well-lit images
            that showcase the service from different angles.
          </div>
          <LimbIScroller :options="{ autoSetup: true }">
            <div
              v-for="(photo, index) in newService.tab1.photo"
              class="thumbnail image"
            >
              <img :src="fileToURL(photo)" alt="Service photo" />
              <button
                @click="newService.tab1.photo.splice(index, 1)"
                class="small circular icon button"
                style="position: absolute; top: 0.25rem; right: 0.25rem"
              >
                <Icon name="material-symbols:delete-outline-rounded" />
              </button>
            </div>
          </LimbIScroller>
          <label class="icon button design-takeover">
            <Icon name="material-symbols:add" /> Add
            {{ newService.tab1.photo.length ? 'another' : '' }} photo
            <input type="file" @change="handleNewPhoto" accept="image/*" />
          </label>
        </div>
        <div class="field">
          <label>Link to youtube or Facebook video</label>
          <input
            v-model="newService.tab1.videoLink"
            class="form-item"
            type="text"
            placeholder="e.g. https://youtube.com/..."
          />
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
            If there is a service options, price here should be the lower price
            option. Price can also be added with service options.
          </div>
          <LimbCurrencyInput
            v-model="newService.tab2.price"
            id="prod-price"
            class="form-item"
            placeholder="Service price"
            required
          />
        </div>
        <div class="field">
          <label>Service options</label>
          <div class="supp-text faint-text">
            Service options are variations of the service, such as color, size,
            or config option. You can add a maximum of two option groups.
          </div>
          <button
            v-if="!newService.tab2.optionGroup"
            @click="createNewServiceOption"
            class="compact button"
          >
            Add an option group
          </button>
          <fieldset v-if="newService.tab2.optionGroup">
            <button
              @click="newService.tab2.optionGroup = undefined"
              v-tooltip:aria.unblocking
              aria-label="Remove option group"
              class="auto-l-margined small circular outlined icon button"
            >
              <Icon name="material-symbols:delete-outline-rounded" />
            </button>
            <div class="field">
              <label>Option group title</label>
              <input
                v-model="newService.tab2.optionGroup.title"
                class="form-item"
                id="option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
            </div>
            <div class="lined sub heading a-block">
              Options for:
              <div class="trailing">
                {{ newService.tab2.optionGroup.title }}
              </div>
            </div>
            <div class="wrappable menu">
              <div
                v-for="(option, index) in newService.tab2.optionGroup.options"
                class="item open-modal"
                data-target="app-option"
                :data-option-id="index"
              >
                <img
                  v-if="option.photo"
                  :src="fileToURL(option.photo)"
                  alt="Option photo"
                />
                <div class="content">
                  <div class="bold">{{ option.label }}</div>
                  <div v-if="option.price" class="primary-text bold">
                    ₦{{ option.price.toLocaleString() }}
                  </div>
                </div>
                <button
                  @click="newService.tab2.optionGroup.options.splice(index, 1)"
                  class="small circular trailing icon button ex-open-modal"
                >
                  <Icon name="material-symbols:delete-outline-rounded" />
                </button>
              </div>
              <button class="button as-app open-modal" data-target="app-option">
                <Icon class="huge" name="material-symbols:add" />
                Add option
              </button>
            </div>
          </fieldset>
        </div>
        <div v-if="newService.tab2.optionGroup" class="field">
          <label>Service sub-options</label>
          <div class="supp-text faint-text">
            <p>
              A sub-options group can also be added if necessary. For example,
              if your main option group is "Size," your sub-option group could
              be "Colour." This enables customers to select a combination of
              size and colour for the service.
            </p>
            <p>
              Just so you know, sub-options can only be added if there are
              options in the main option group.
            </p>
          </div>
          <button
            v-if="!newService.tab2.subOptionGroup"
            @click="createNewServiceOption"
            class="compact button"
          >
            Add a sub option group
          </button>
          <fieldset v-if="newService.tab2.subOptionGroup">
            <button
              @click="newService.tab2.subOptionGroup = undefined"
              v-tooltip:aria.unblocking
              aria-label="Remove sub-option group"
              class="auto-l-margined small circular outlined icon button"
            >
              <Icon name="material-symbols:delete-outline-rounded" />
            </button>
            <div class="field">
              <label>Sub-option group title</label>
              <input
                v-model="newService.tab2.subOptionGroup.title"
                class="form-item"
                id="sub-option-group-title"
                type="text"
                placeholder="e.g. Color, Size, etc."
              />
            </div>
            <div class="lined sub heading a-block">
              Options for:
              <div class="trailing">
                {{ newService.tab2.subOptionGroup.title }}
              </div>
            </div>
            <div class="wrappable menu">
              <div
                v-for="(option, index) in newService.tab2.subOptionGroup
                  .options"
                class="item open-modal"
                data-target="app-option"
                data-sub-category
                :data-option-id="index"
              >
                <img
                  v-if="option.photo"
                  :src="fileToURL(option.photo)"
                  alt="sub-option photo"
                />
                <div class="content">
                  <div class="bold">{{ option.label }}</div>
                  <div v-if="option.price" class="primary-text bold">
                    ₦{{ option.price.toLocaleString() }}
                  </div>
                </div>
                <button
                  @click="
                    newService.tab2.subOptionGroup.options.splice(index, 1)
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
            controller: configServiceOption,
            complete: processServiceOption,
          }"
        >
          <div class="dialog">
            <div class="header flexbox guttered">
              <div class="bold truncate">
                {{ optionPlaceholderModifying ? 'Modify' : 'Add' }} an option
              </div>
              <button
                class="circular flat button as-text exit-modal"
                style="margin-left: auto"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
            </div>
            <div class="content">
              <div class="field">
                <label>Label</label>
                <input
                  v-model="optionPlaceholder.label"
                  class="form-item"
                  md-autofocus
                  type="text"
                  placeholder="Option label"
                  required
                />
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
                    :src="fileToURL(optionPlaceholder.photo)"
                    alt="Service photo"
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
              <div class="field align-end">
                <button class="primary button exit-modal">
                  {{ optionPlaceholderModifying ? 'Modify' : 'Add' }} option
                </button>
              </div>
              <div v-if="optionPlaceholder.subOptions" class="field">
                <label>Sub-options group</label>
                <div class="supp-text faint-text">
                  Toggle the sub-options you want to add to this option.
                </div>
                <div
                  v-if="newService.tab2.subOptionGroup"
                  class="wrappable menu"
                >
                  <div
                    v-for="(option, index) in newService.tab2.subOptionGroup
                      .options"
                    class="item"
                    @click="
                      optionPlaceholder.subOptions[index]![0] =
                        !optionPlaceholder.subOptions[index]![0]
                    "
                  >
                    <div
                      class="icon"
                      :class="{
                        active: Boolean(optionPlaceholder.subOptions[index]?.[0]),
                      }"
                    >
                      <Icon
                        name="material-symbols:check-box-outline-blank"
                        class="nview"
                      />
                      <Icon name="material-symbols:check" class="aview" />
                    </div>
                    <img
                      v-if="option.photo"
                      :src="fileToURL(option.photo)"
                      alt="sub-option photo"
                    />
                    <div class="content">
                      <div class="bold">{{ option.label }}</div>
                      <div v-if="option.price" class="primary-text bold">
                        ₦{{ option.price.toLocaleString() }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LimbModal>
      </div>
      <div
        class="tab-page"
        v-for="id in ['tab3']"
        :class="currentTab === id ? 'active' : ''"
      >
        <div class="field">
          <label>Service Specifications</label>
          <div class="supp-text faint-text">
            <p>
              Service specifications provide detailed information about the
              service's features, dimensions, materials, and other relevant
              details that help customers make informed purchasing decisions.
            </p>
            <p>
              You can add as many specifications as you want. Just click on the
              "Add specification" button below.
            </p>
          </div>
          <div class="flexbox align-center flex-wrap guttered">
            <span>Or use a template:</span>
            <LimbDropdown
              class="select flexible"
              placeholder="Select a template"
            >
              <div class="drop menu">
                <div
                  class="item"
                  v-for="(template, templateName) in serviceCategories"
                  @click="
                    newService.tab3.specifications = template.map((spec) => ({
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
          <table class="basic table">
            <thead>
              <tr>
                <th>Specification</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(spec, index) in newService.tab3.specifications">
                <td>
                  <input
                    v-model="spec.name"
                    class="form-item fluid"
                    type="text"
                    placeholder="Specification name"
                  />
                </td>
                <td>
                  <input
                    v-model="spec.value"
                    class="form-item fluid"
                    type="text"
                    placeholder="Specification value"
                  />
                </td>
                <td class="text-center">
                  <button
                    @click="newService.tab3.specifications.splice(index, 1)"
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
                    class="compact fluid button"
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
          <p class="supp-text faint-text">
            Share your personal review of the service. Highlight its key
            features, benefits, and what makes it a great choice for customers.
            A compelling description can help buyers make an informed decision.
          </p>
          <textarea
            v-model="newService.tab3.overview"
            class="form-item"
            rows="3"
            placeholder="Write your review here..."
          ></textarea>
        </div>
      </div>
    </div>
    <footer
      class="sticky surface-bg padded pin-bottom-blend z-level-1"
      style="bottom: 0px; margin-top: 0.5rem"
    >
      <div v-if="currentTab === 'tab1'" class="flexbox flex-column">
        <p class="text-center">
          By continuing, you agree to our
          <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
        </p>
        <button @click="nextTab" class="primary button">Next</button>
      </div>
      <div v-else class="flexbox flex-separate align-center guttered">
        <span class="text-muted">
          {{ Object.keys(newService).indexOf(currentTab) + 1 }} of
          {{ Object.keys(newService).length }}
        </span>
        <div class="flexbox guttered">
          <button @click="prevTab" class="flat button">Previous</button>
          <button
            v-if="currentTab === Object.keys(newService).pop()"
            class="primary button exit-modal"
          >
            Finish
          </button>
          <button @click="nextTab" v-else class="primary button">Next</button>
        </div>
      </div>
    </footer>
  </div>
</template>
