<script setup lang="ts">
definePageMeta({ name: 'add-product', auth: false });

const productCategories = [
  'Computers & Accessories',
  'Phones & Tablets',
  'Home Appliances',
  'Fashion & Beauty',
  'Sports & Fitness',
  'Books & Stationery',
  'Automotive',
  'Health & Wellness',
];
const newProduct = reactive<{
  category: string;
  title: string;
  photo: File[];
  videoLink: string;
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
    title?: string;
    options?: { label: string; price?: number; photo?: File }[];
  };
  quantity: number;
}>({
  category: '',
  title: '',
  photo: [],
  videoLink: '',
  quantity: 1,
});
const optionPlaceholder = ref<{
  label: string;
  price?: number;
  photo?: File;
  subOptions?: [boolean, number][];
}>({
  label: '',
});
const optionPlaceholderModifying = ref(false);

watch(
  () => newProduct.subOptionGroup?.options,
  (newVal) => {
    if (newVal === undefined && newProduct.optionGroup) {
      newProduct.optionGroup.options.forEach((option) => {
        option.subOptions = undefined;
      });
    } else if (newProduct.optionGroup) {
      newProduct.optionGroup.options.forEach((option) => {
        option.subOptions = newProduct.subOptionGroup?.options.map(() => [
          true,
          undefined,
        ]);
      });
    }
  },
  { deep: true }
);

function fileToURL(file: File) {
  return URL.createObjectURL(file);
}
function handleNewPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    newProduct.photo.push(input.files[0]);
    input.value = '';
  }
}
function createNewProductOption() {
  if (newProduct.optionGroup) {
    newProduct.subOptionGroup = {
      title: '',
      options: [],
    };
    nextTick(() => document.getElementById('sub-option-group-title')?.focus());
  } else {
    newProduct.optionGroup = {
      title: '',
      options: [],
    };
    nextTick(() => document.getElementById('option-group-title')?.focus());
  }
}
function configProductOption(event) {
  let caller = event.caller;
  let callergroup = caller.hasAttribute('data-sub-category') ? 'sub' : 'main';

  if (caller.dataset.optionId !== undefined) {
    let optionId = parseInt(caller.dataset.optionId);
    const option =
      callergroup === 'sub'
        ? newProduct.subOptionGroup.options[optionId]
        : newProduct.optionGroup.options[optionId];
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
function processProductOption(event) {
  let caller = event.caller;
  let callergroup = caller.hasAttribute('data-sub-category') ? 'sub' : 'main';

  if (caller.dataset.optionId !== undefined) {
    const optionId = parseInt(caller.dataset.optionId);
    if (callergroup === 'sub') {
      if (newProduct.subOptionGroup.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newProduct.subOptionGroup.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newProduct.subOptionGroup.options.splice(optionId, 1);
      }
    } else if (callergroup === 'main') {
      if (newProduct.optionGroup.options[optionId]) {
        if (optionPlaceholder.value.label.trim())
          newProduct.optionGroup.options[optionId] = {
            ...optionPlaceholder.value,
          };
        else newProduct.optionGroup.options.splice(optionId, 1);
      }
    }
  } else if (optionPlaceholder.value.label.trim()) {
    if (callergroup === 'sub')
      newProduct.subOptionGroup.options.push({ ...optionPlaceholder.value });
    else if (callergroup === 'main')
      newProduct.optionGroup.options.push({ ...optionPlaceholder.value });
  }

  optionPlaceholder.value = {
    label: '',
  };
}
</script>
<template>
  <div class="as-page">
    <LimbModal
      id="app-option"
      :options="{
        controller: configProductOption,
        complete: processProductOption,
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
            <label>Option label</label>
            <input
              v-model="optionPlaceholder.label"
              class="form-item"
              md-autofocus
              type="text"
            />
          </div>
          <div class="field">
            <label>Price (optional)</label>
            <input
              v-model.number="optionPlaceholder.price"
              class="form-item"
              type="number"
              placeholder="Option price"
            />
          </div>
          <div class="field">
            <label>Option unique picture (optional)</label>
            <div v-if="optionPlaceholder.photo" class="thumbnail image">
              <img
                :src="fileToURL(optionPlaceholder.photo)"
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
                  ).files[0]
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
            <div class="wrappable menu">
              <div
                v-for="(option, index) in newProduct.subOptionGroup.options"
                class="item"
                @click="
                  optionPlaceholder.subOptions[index][0] =
                    !optionPlaceholder.subOptions[index][0]
                "
              >
                <div
                  class="icon"
                  :class="{
                    active: Boolean(optionPlaceholder.subOptions[index][0]),
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
    <div
      class="menu sticky z-level-3"
      style="
        top: 0px;
        border-bottom: 1px solid var(--outline);
        background-color: var(--surface);
      "
    >
      <Shareables name="main_menu" />
    </div>
    <div class="container-md">
      <header
        v-scrollPin="{ notifyStuckState: true, top: 63 }"
        class="scrollpin fluid z-level-1 pin-top-blend"
        style="background-color: var(--surface); margin-bottom: 1rem"
      >
        <div
          class="p-h3 lined heading h3 0-margined align-end flexbox guttered flex-separate"
        >
          <div>
            <Icon name="material-symbols:sell-outline" />
            Add product
          </div>
        </div>
      </header>

      <div class="content container-sm padded">
        <div class="tab-page active">
          <div class="field">
            <label for="prod-category">Category</label>
            <LimbDropdown
              v-model="newProduct.category"
              class="search select"
              id="prod-category"
              placeholder="Select category"
            >
              <div class="drop menu">
                <div class="item" v-for="category in productCategories">
                  {{ category }}
                </div>
                <div class="item">Create a new category</div>
              </div>
            </LimbDropdown>
          </div>
          <div class="field">
            <label for="prod-title">Product title</label>
            <div class="supp-text faint-text">
              It should be descriptive and unique as possible. Include brand
              name, model, and key features.
            </div>
            <input
              v-model="newProduct.title"
              id="prod-title"
              class="form-item"
              type="text"
              placeholder="Product title"
              required
            />
          </div>
          <div class="field">
            <label>Add photo</label>
            <div class="supp-text faint-text">
              Photos help customers to see the product. Use clear, well-lit
              images that showcase the product from different angles.
            </div>
            <LimbIScroller :options="{ autoSetup: true }">
              <div
                v-for="(photo, index) in newProduct.photo"
                class="thumbnail image"
              >
                <img :src="fileToURL(photo)" alt="Product photo" />
                <button
                  @click="newProduct.photo.splice(index, 1)"
                  class="small circular icon button"
                  style="position: absolute; top: 0.25rem; right: 0.25rem"
                >
                  <Icon name="material-symbols:delete-outline-rounded" />
                </button>
              </div>
            </LimbIScroller>
            <label class="icon button design-takeover">
              <Icon name="material-symbols:add" /> Add
              {{ newProduct.photo.length ? 'another' : '' }} photo
              <input type="file" @change="handleNewPhoto" accept="image/*" />
            </label>
          </div>
          <div class="field">
            <label>Link to youtube or Facebook video</label>
            <input
              v-model="newProduct.videoLink"
              class="form-item"
              type="text"
              placeholder="e.g. https://youtube.com/..."
            />
          </div>
        </div>
        <div class="tab-page active">
          <div class="field">
            <label for="prod-price">Price</label>
            <div class="supp-text faint-text">
              If there is a product options, price here should be the lower
              price option. Price can also be added with product options.
            </div>
            <input
              v-model.number="newProduct.price"
              id="prod-price"
              class="form-item"
              type="number"
              placeholder="Product price"
              required
            />
          </div>
          <div class="field">
            <label>Product options</label>
            <div class="supp-text faint-text">
              Product options are variations of the product, such as color,
              size, or config option. You can add a maximum of two option
              groups.
            </div>
            <button
              v-if="!newProduct.optionGroup"
              @click="createNewProductOption"
              class="compact button"
            >
              Add an option group
            </button>
            <fieldset v-if="newProduct.optionGroup">
              <button
                @click="newProduct.optionGroup = undefined"
                v-tooltip.unblocking="'Remove option group'"
                class="auto-l-margined small circular outlined icon button"
              >
                <Icon name="material-symbols:delete-outline-rounded" />
              </button>
              <div class="field">
                <label>Option group title</label>
                <input
                  v-model="newProduct.optionGroup.title"
                  class="form-item"
                  id="option-group-title"
                  type="text"
                  placeholder="e.g. Color, Size, etc."
                />
              </div>
              <div class="lined sub heading a-block">
                Options for:
                <div class="trailing">
                  {{ newProduct.optionGroup.title }}
                </div>
              </div>
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in newProduct.optionGroup.options"
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
                    @click="newProduct.optionGroup.options.splice(index, 1)"
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
            </fieldset>
          </div>
          <div v-if="newProduct.optionGroup" class="field">
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
              v-if="!newProduct.subOptionGroup"
              @click="createNewProductOption"
              class="compact button"
            >
              Add a sub opiton group
            </button>
            <fieldset v-if="newProduct.subOptionGroup">
              <button
                @click="newProduct.subOptionGroup = undefined"
                v-tooltip.unblocking="'Remove sub-option group'"
                class="auto-l-margined small circular outlined icon button"
              >
                <Icon name="material-symbols:delete-outline-rounded" />
              </button>
              <div class="field">
                <label>Sub-option group title</label>
                <input
                  v-model="newProduct.subOptionGroup.title"
                  class="form-item"
                  id="sub-option-group-title"
                  type="text"
                  placeholder="e.g. Color, Size, etc."
                />
              </div>
              <div class="lined sub heading a-block">
                Options for:
                <div class="trailing">
                  {{ newProduct.subOptionGroup.title }}
                </div>
              </div>
              <div class="wrappable menu">
                <div
                  v-for="(option, index) in newProduct.subOptionGroup.options"
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
                    @click="newProduct.subOptionGroup.options.splice(index, 1)"
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
        </div>
        <div class="tab-page active">
          <div class="field">
            <label>Product Specifications</label>
            <div class="supp-text faint-text">
              <p>
                Product specifications provide detailed information about the
                product's features, dimensions, materials, and other relevant
                details that help customers make informed purchasing decisions.
              </p>
              <p>
                You can add as many specifications as you want. Just click on
                the "Add specification" button below.
              </p>
            </div>
            <LimbDropdown class="select" placeholder="Select a template">
              <div class="drop menu">
                <div class="item">Electronics</div>
                <div class="item">Clothing</div>
                <div class="item">Home Appliances</div>
                <div class="item">Books</div>
                <div class="item">Sports Equipment</div>
                <div class="item">Automotive</div>
                <div class="item">Health & Wellness</div>
              </div>
            </LimbDropdown>
            <table class="table">
              <thead>
                <tr>
                  <th>Specification</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      class="form-item fluid"
                      type="text"
                      placeholder="e.g. Weight, Dimensions, Material, etc."
                    />
                  </td>
                  <td>
                    <input
                      class="form-item fluid"
                      type="text"
                      placeholder="e.g. 1.5kg, 10x5x3 inches, Plastic, etc."
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2">
                    <button class="compact fluid button">
                      <Icon name="material-symbols:add" /> Add specification
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div class="footer">
        <div v-if="true" class="flexbox flex-column">
          <p class="text-center">
            By continuing, you agree to our
            <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
          </p>
          <button class="primary button">Continue</button>
        </div>
        <div v-else class="flexbox flex-separate align-center guttered">
          <span class="text-muted"> 1 of 3 </span>
          <div class="flexbox guttered">
            <button class="flat button">Previous</button>
            <button v-if="false" class="primary button exit-modal">
              Finish
            </button>
            <button v-else class="primary button">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
