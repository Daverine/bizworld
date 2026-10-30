<script setup lang="ts">
import { isFilled, required, requiredIf, url } from "@regle/rules";

definePageMeta({
  name: "add-service",
  layout: "details",
  auth: false,
  noCart: true,
});

const mainForm = reactive<{
  title: string;
  pictures: File[];
  video_link?: string;
  description?: string;
  duration: string;
  specifications: {
    name: string;
    value: string | boolean;
  }[];
  price_avail: "Fixed" | "On Request";
  price: string;
  packages?: {
    label: string;
    picture?: File | string;
    description: string;
    duration?: string;
    specifications: {
      name: string;
      value: string | boolean;
    }[];
    price: string;
  }[];
  bookable: boolean;
}>({
  title: "",
  pictures: [],
  price_avail: "Fixed",
  price: "",
  duration: "",
  specifications: [],
  bookable: false,
});
const placeholder = reactive<{
  pack: {
    label: string;
    picture?: File | string;
    duration?: string;
    description: string;
    specifications: {
      name: string;
      value: string | boolean;
    }[];
    price: string;
  };
  modifyingPack?: number;
}>({
  pack: {
    label: "",
    duration: "",
    description: "",
    specifications: [],
    price: "",
  },
});
const specSuggestion = computed(() => {
  return [
    ...new Set([
      ...mainForm.specifications.map(({ name }) => name),
      ...(mainForm.packages?.flatMap(({ specifications }) =>
        specifications.map((spec) => spec.name),
      ) || []),
    ]),
  ];
});
const validation = {
  service: useRegle(mainForm, {
    title: { required: withMessage(required, "Service title is required.") },
    pictures: {
      $each: {},
      minLength: withMessage(
        (value: Maybe<(File | string)[]>) => !!value && value.length > 0,
        "At least a picture is required.",
      ),
      size: withMessage(
        (value: Maybe<(File | string)[]>) =>
          !!value && value.every((el) => typeof el === "string" || el.size <= 5 * 1024 * 1024),
        "Each picture must be less than 5MB in size.",
      ),
    },
    video_link: { url },
    description: {
      required: withMessage(required, "Service description is required."),
    },
    specifications: {
      minLength: withMessage(
        (value: Maybe<typeof mainForm.specifications>) => !!value && value.length > 1,
        "At least two service specifications are required.",
      ),
      unique: withMessage(
        (value: Maybe<typeof mainForm.specifications>) =>
          new Set(value?.map(({ name }) => name)).size === value?.length,
        "Each specifications name added should be unique.",
      ),
      $each: {
        name: { required },
        value: { required },
      },
    },
    price: {
      required: withMessage(
        requiredIf(mainForm.price_avail === "Fixed"),
        "A base price is required for the product.",
      ),
    },
  }),
  pack: useRegle(
    computed(() => placeholder.pack),
    {
      label: {
        unique: withMessage(
          (value: Maybe<string>) =>
            isFilled(value) &&
            (!mainForm.packages ||
              mainForm.packages.every(
                (option, index) =>
                  option.label !== value ||
                  (typeof placeholder.modifyingPack === "number" &&
                    placeholder.modifyingPack === index),
              )),
          "A unique label is required for this package.",
        ),
      },
      picture: {
        maxSize: withMessage(
          maxFileSize(5 * 1024 * 1024),
          "Selected picture must be less than 5MB in size.",
        ),
      },
      description: {
        required: withMessage(required, "Package description is required."),
      },
      specifications: {
        $each: {
          name: { required },
          value: { required },
        },
      },
    },
  ),
};
function handleNewPicture(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    mainForm.pictures.push(input.files[0]);
    input.value = "";
  }
}
function addSpecification(isPackage?: boolean, template?: string[] | string) {
  if (Array.isArray(template)) {
    let spec = template.map((spec) => ({
      name: spec,
      value: "",
    }));

    if (isPackage) {
      placeholder.pack.specifications = spec;
      nextTick(() =>
        (
          document.querySelector(
            "#pack-specs > tbody > tr:first-child > td:nth-child(2) input",
          ) as HTMLInputElement
        )?.focus(),
      );
    } else {
      mainForm.specifications = spec;
      nextTick(() =>
        (
          document.querySelector(
            "#main-specs > tbody > tr:first-child > td:nth-child(2) input",
          ) as HTMLInputElement
        )?.focus(),
      );
    }
  } else if (template === "check") {
    if (isPackage) {
      placeholder.pack.specifications.push({ name: "", value: true });
      nextTick(() =>
        (
          document.querySelector(
            "#pack-specs > tbody > tr:last-child > td:first-child input",
          ) as HTMLInputElement
        )?.focus(),
      );
    } else {
      mainForm.specifications.push({ name: "", value: true });
      nextTick(() =>
        (
          document.querySelector(
            "#main-specs > tbody > tr:last-child > td:first-child input",
          ) as HTMLInputElement
        )?.focus(),
      );
    }
  } else {
    if (isPackage) {
      placeholder.pack.specifications.push({ name: "", value: "" });
      nextTick(() =>
        (
          document.querySelector(
            "#pack-specs > tbody > tr:last-child > td:first-child input",
          ) as HTMLInputElement
        )?.focus(),
      );
    } else {
      mainForm.specifications.push({ name: "", value: "" });
      nextTick(() =>
        (
          document.querySelector(
            "#main-specs > tbody > tr:last-child > td:first-child input",
          ) as HTMLInputElement
        )?.focus(),
      );
    }
  }
}
async function configurePackage({ target, settings }: Dialoger) {
  let caller = settings.caller!;

  if (caller.dataset.packId !== undefined) {
    let packId = parseInt(caller.dataset.packId);
    const sPackage = JSON.parse(JSON.stringify(mainForm.packages?.[packId]));

    if (sPackage) {
      placeholder.modifyingPack = packId;
      placeholder.pack = sPackage;
    }
  }

  await nextTick();
  validation.pack.r$.$reset();

  const cleanupCloseEvent = useEventListener(target, "dialogIsClosed", () => {
    placeholder.modifyingPack = undefined;
    placeholder.pack = {
      label: "",
      duration: "",
      description: "",
      specifications: [],
      price: "",
    };
    cleanupCloseEvent();
  });
}
async function processPackage({ exit }: Dialoger) {
  await validation.pack.r$.$validate();
  if (validation.pack.r$.$invalid) return;

  if (typeof placeholder.modifyingPack === "number") {
    let index = placeholder.modifyingPack;

    if (mainForm.packages?.[index]) {
      mainForm.packages![index] = {
        ...placeholder.pack,
      };
    }
  } else if (mainForm.packages) mainForm.packages.push({ ...placeholder.pack });
  else mainForm.packages = [{ ...placeholder.pack }];

  exit();
}
</script>
<template>
  <div class="auto-contain max-w-180">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 self-pointer-none mb-4 min-h-23 [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 bg-surface shadow-t-blend m-0 flex items-end justify-between gap-3 transition-[font-size] duration-200"
      >
        Add service
        <NuxtLink
          :to="{
            name: 'manage-biz-services',
            params: { slug: $route.params.slug },
          }"
          class="compact button text-sm"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
          <span class="content max-sm:hidden">Back</span>
        </NuxtLink>
      </div>
    </header>
    <form id="add-service" class="auto-contain no-edge flex max-w-lg flex-1 flex-col gap-4">
      <div class="field">
        <label for="service-title">Service title</label>
        <p class="text-sm opacity-65">
          It should contain what this service is called or can be called specifically.
        </p>
        <input
          v-model="mainForm.title"
          id="service-title"
          class="form-item"
          :class="{ error: validation.service.r$.title.$error }"
          type="text"
          placeholder="Service title"
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.service.r$.title.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label>Add picture</label>
        <p class="text-sm opacity-65">
          Pictures help customers to see what the service look like. Use clear, well-lit images that
          showcase this service well. A picture can be dragged to re-order it.
        </p>
        <LimbIScroller
          id="service-pictures"
          :options="{ autoSetup: true }"
          class="[&_.sortable-ghost]:opacity-0"
        >
          <div
            v-for="(picture, index) in mainForm.pictures"
            class="relative flex flex-col items-center"
          >
            <img :src="utils.fileToURL(picture)" alt="Product picture" class="thumbnail" />
            <button
              type="button"
              @click="mainForm.pictures.splice(index, 1)"
              class="compact circular outlined button bg-overlay absolute top-1 right-1 text-xs"
            >
              <Icon name="material-symbols:close-rounded" />
            </button>
            <div v-if="typeof picture !== 'string'" class="text-sm">
              {{ (picture.size / 1024 / 1024).toFixed(1) }}MB
            </div>
          </div>
        </LimbIScroller>
        <div
          class="text-error text-sm"
          v-for="error in validation.service.r$.pictures.$self.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
        <label class="button design-takeover">
          <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
            mainForm.pictures.length ? "Add more pictures" : "Add pictures"
          }}
          <input
            id="picture-selector"
            type="file"
            multiple
            @change="handleNewPicture"
            accept="image/*"
          />
        </label>
      </div>
      <div class="field">
        <label for="service-video">Link to YouTube or Facebook video</label>
        <input
          v-model="mainForm.video_link"
          id="service-video"
          class="form-item"
          :class="{ error: validation.service.r$.video_link.$error }"
          type="text"
          placeholder="e.g. https://youtube.com/..."
        />
        <div
          class="text-error text-sm"
          v-for="error of validation.service.r$.video_link.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label for="service-description">Description</label>
        <p class="text-sm opacity-65">
          Describe your service to help customers understand what you are offering.
        </p>
        <textarea
          v-model="mainForm.description"
          id="service-description"
          class="form-item"
          :class="{ error: validation.service.r$.description.$error }"
          placeholder="Service description"
          rows="3"
        ></textarea>
        <div
          class="text-error text-sm"
          v-for="error of validation.service.r$.description.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <label for="service-duration">Duration</label>
        <p class="text-sm opacity-65">
          Set a duration for this service to let customers know how long it takes to get it done.
        </p>
        <input
          v-model="mainForm.duration"
          id="service-duration"
          class="form-item"
          type="text"
          placeholder="Service duration"
        />
      </div>
      <div class="field">
        <label>Service Specifications</label>
        <div class="text-sm opacity-65">
          <p>
            Outline specific expectation this service can includes. This help customers know in
            summary what to expect when purchasing this service.
          </p>
          <p>
            You can add as many specifications as you want by clicking on the "Add check spec"
            button for a Checkbox value or the "Add custom spec" button for a text value.
          </p>
        </div>
        <table id="main-specs" class="basic table align-top">
          <thead>
            <tr>
              <th>Specification</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(spec, index) in validation.service.r$.specifications.$each">
              <td>
                <div class="field">
                  <LimbDropdown
                    type="select"
                    boundless
                    placeholder="Specification name"
                    v-model="spec.name.$value"
                    class="w-full"
                    :class="{ error: spec.name.$error }"
                  />
                  <div class="dropdown menu">
                    <LimbOption
                      v-for="name in specSuggestion.filter(
                        (sSpec) =>
                          !mainForm.specifications.map(({ name }) => name).includes(sSpec) ||
                          sSpec === spec.name.$value,
                      )"
                      class="item"
                      :data-value="name"
                    >
                      {{ name }}
                    </LimbOption>
                  </div>
                  <div class="text-error text-sm" v-for="error of spec.name.$errors" :key="error">
                    <Icon name="material-symbols:error-rounded" />
                    {{ error }}
                  </div>
                </div>
              </td>
              <td class="takenover">
                <label class="field items-center">
                  <input
                    v-if="typeof spec.value.$value === 'string'"
                    v-model="spec.value.$value"
                    :id="`spec-value${index}`"
                    class="form-item w-full"
                    :class="{ error: spec.value.$error }"
                    type="text"
                    placeholder="Specification value"
                  />
                  <input
                    v-else
                    v-model="spec.value.$value"
                    :id="`spec-value${index}`"
                    class="form-item text-xl"
                    :class="{ error: spec.value.$error }"
                    type="checkbox"
                    placeholder="Specification value"
                  />
                  <div class="text-error text-sm" v-for="error of spec.value.$errors" :key="error">
                    <Icon name="material-symbols:error-rounded" />
                    {{ error }}
                  </div>
                </label>
              </td>
              <td class="text-center">
                <button
                  type="button"
                  @click="mainForm.specifications.splice(index, 1)"
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
                  v-for="error of validation.service.r$.specifications.$self.$errors"
                  :key="error"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
                <div class="flex gap-4">
                  <button
                    type="button"
                    @click="addSpecification(false, 'check')"
                    class="compact button w-full"
                  >
                    <Icon name="material-symbols:add" /> Add check spec
                  </button>
                  <button type="button" @click="addSpecification()" class="compact button w-full">
                    <Icon name="material-symbols:add" /> Add custom spec
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="field">
        <label for="service-price">Price</label>
        <p class="text-sm opacity-65">
          Set a price for your service to let customers know how much it costs.
        </p>
        <div class="grid gap-3 sm:grid-cols-2">
          <LimbDropdown v-model="mainForm.price_avail" type="select">
            <div class="dropdown menu">
              <LimbOption class="item">Fixed</LimbOption>
              <LimbOption class="item">On Request</LimbOption>
            </div>
          </LimbDropdown>
          <LimbCurrencyInput
            v-model="mainForm.price"
            :disabled="mainForm.price_avail === 'On Request'"
            id="service-price"
            class="form-item"
            :class="{ error: validation.service.r$.price.$error }"
            placeholder="Service price"
          />
        </div>
        <div
          class="text-error text-sm"
          v-for="error of validation.service.r$.price.$errors"
          :key="error"
        >
          <Icon name="material-symbols:error-rounded" />
          {{ error }}
        </div>
      </div>
      <div class="field">
        <div class="field-label">Service Package Variation</div>
        <div class="text-sm opacity-65">
          <p>
            Add variations to your service package so customers can choose from diffrent options,
            such as standard, or premium. Each option can have its own specifications and price.
          </p>
          <p>Note: Customers will automatically see the "Basic" option when you add a variation.</p>
        </div>
        <button type="button" class="button open-modal" data-target="pack-form">
          <Icon name="material-symbols:add-rounded" />
          Add a package
        </button>
        <div class="wrappable menu">
          <div
            v-for="(pack, pIndex) in mainForm.packages"
            class="rounded-block flex w-full max-w-62.5 flex-col gap-4 border p-4"
          >
            <header class="flex items-center justify-between gap-4">
              <div class="font-semibold">{{ pack.label }}</div>
              <button
                type="button"
                @click="mainForm.packages?.splice(pIndex, 1)"
                class="circular trailing icon button ex-open-modal text-sm"
              >
                <Icon name="material-symbols:delete-outline-rounded" />
              </button>
            </header>
            <div v-if="pack.price" class="text-xl font-semibold">
              ₦{{ parseFloat(pack.price).toLocaleString() }}
            </div>
            <p class="m-0">{{ pack.description }}</p>
            <div v-if="pack.duration" class="flex items-center justify-between gap-4">
              <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" />
              {{ pack.duration }}
            </div>
            <table v-if="pack.specifications.length" class="clear table">
              <tbody>
                <tr v-for="row in pack.specifications">
                  <td>{{ row.name }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              :data-pack-id="pIndex"
              class="button open-modal"
              data-target="pack-form"
            >
              Edit package
            </button>
          </div>
        </div>
      </div>
      <div class="field">
        <label for="service-bookable">Booking</label>
        <label class="flex items-center justify-between gap-4 text-base font-normal"
          >Is this service bookable
          <input
            type="checkbox"
            id="service-bookable"
            v-model="mainForm.bookable"
            class="form-switch"
        /></label>
        <p class="text-sm opacity-65">If a service is bookable, customers can as well book it.</p>
      </div>
    </form>
    <footer
      class="bg-surface shadow-b-blend z-level-1 sticky p-4"
      style="bottom: 0px; margin-top: 0.5rem"
    >
      <div class="flex flex-col">
        <p class="text-center">
          By continuing, you agree to our
          <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
        </p>
        <button class="primary button">Continue</button>
      </div>
    </footer>

    <LimbModal id="pack-form" :options="{ controller: configurePackage }" v-slot="{ control }">
      <form class="dialog flex flex-col">
        <header class="flex gap-3 px-6 py-4">
          <div class="truncate font-bold">
            {{
              typeof placeholder.modifyingPack === "number" ? "Modify a package" : "Add a package"
            }}
          </div>
          <button type="button" class="circular flat button as-text exit-modal ml-auto">
            <Icon name="material-symbols:close-rounded" />
          </button>
        </header>
        <div class="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pt-4">
          <div class="field">
            <label for="pack-label">Label</label>
            <p class="text-sm opacity-65">
              This should contain a name for the package. Eg. Startard, Premium, etc
            </p>
            <LimbDropdown
              type="select"
              boundless
              v-model="placeholder.pack.label"
              class="form-item"
              id="pack-label"
              :class="{
                error: validation.pack.r$.label.$error,
              }"
              md-autofocus
              placeholder="Option label"
            />
            <div class="dropdown menu">
              <div class="item" role="option">Standard</div>
              <div class="item" role="option">Premium</div>
            </div>
            <div
              class="text-error text-sm"
              v-for="error of validation.pack.r$.label.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label for="add-pack-picture">Unique package picture (optional)</label>
            <div v-if="placeholder.pack.picture" class="relative flex w-max flex-col items-center">
              <img
                :src="utils.fileToURL(placeholder.pack.picture)"
                alt="Product picture"
                class="thumbnail"
              />
              <button
                type="button"
                @click="placeholder.pack.picture = undefined"
                class="compact circular outlined button bg-overlay absolute top-1 right-1 text-xs"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div v-if="typeof placeholder.pack.picture !== 'string'" class="text-sm">
                {{ (placeholder.pack.picture.size / 1024 / 1024).toFixed(1) }}MB
              </div>
            </div>
            <div
              class="text-error text-sm"
              v-for="error of validation.pack.r$.picture.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
            <label class="button design-takeover">
              <Icon name="material-symbols:add-a-photo-outline-rounded" />{{
                `${placeholder.pack.picture ? "Change picture" : "Add picture"}`
              }}
              <input
                id="add-pack-picture"
                type="file"
                @change="placeholder.pack.picture = ($event.target as HTMLInputElement).files?.[0]"
                accept="image/*"
              />
            </label>
          </div>
          <div class="field">
            <label for="pack-description">Description</label>
            <p class="text-sm opacity-65">
              Describe what this package entails as diffrent from the basic service.
            </p>
            <textarea
              v-model="placeholder.pack.description"
              id="pack-description"
              class="form-item"
              :class="{ error: validation.pack.r$.description.$error }"
              placeholder="Package description"
              rows="2"
            ></textarea>
            <div
              class="text-error text-sm"
              v-for="error of validation.pack.r$.description.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label for="pack-duration">Duration (optional)</label>
            <input
              v-model="placeholder.pack.duration"
              id="pack-duration"
              class="form-item"
              type="text"
              placeholder="Package duration"
            />
          </div>
          <div class="field">
            <div class="field-label">Specifications</div>
            <div class="text-sm opacity-65">
              <p>
                Click on the add specification button to choose from the available specification and
                configure.
              </p>
              <p>
                Note: Basic specifications you applied to this service outside this package also
                apply to this package unless you add it here and specify a different value.
              </p>
            </div>
            <table id="pack-specs" class="basic table align-top">
              <thead>
                <tr>
                  <th>Specification</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(spec, index) in validation.pack.r$.specifications.$each">
                  <td>
                    <div class="field">
                      <LimbDropdown
                        type="select"
                        boundless
                        placeholder="Specification name"
                        v-model="spec.name.$value"
                        class="w-full"
                        :class="{ error: spec.name.$error }"
                      />
                      <div class="dropdown menu">
                        <LimbOption
                          v-for="name in specSuggestion.filter(
                            (sSpec) =>
                              !placeholder.pack.specifications
                                .map(({ name }) => name)
                                .includes(sSpec) || sSpec === spec.name.$value,
                          )"
                          class="item"
                          :data-value="name"
                        >
                          {{ name }}
                        </LimbOption>
                      </div>
                      <div
                        class="text-error text-sm"
                        v-for="error of spec.name.$errors"
                        :key="error"
                      >
                        <Icon name="material-symbols:error-rounded" />
                        {{ error }}
                      </div>
                    </div>
                  </td>
                  <td class="takenover">
                    <label class="field items-center">
                      <input
                        v-if="typeof spec.value.$value === 'string'"
                        v-model="spec.value.$value"
                        :id="`spec-value${index}`"
                        class="form-item w-full"
                        :class="{ error: spec.value.$error }"
                        type="text"
                        placeholder="Specification value"
                      />
                      <input
                        v-else
                        v-model="spec.value.$value"
                        :id="`spec-value${index}`"
                        class="form-item text-xl"
                        :class="{ error: spec.value.$error }"
                        type="checkbox"
                        placeholder="Specification value"
                      />
                      <div
                        class="text-error text-sm"
                        v-for="error of spec.value.$errors"
                        :key="error"
                      >
                        <Icon name="material-symbols:error-rounded" />
                        {{ error }}
                      </div>
                    </label>
                  </td>
                  <td class="text-center">
                    <button
                      type="button"
                      @click="placeholder.pack.specifications.splice(index, 1)"
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
                      v-for="error of validation.pack.r$.specifications.$self.$errors"
                      :key="error"
                    >
                      <Icon name="material-symbols:error-rounded" />
                      {{ error }}
                    </div>
                    <div class="flex gap-4">
                      <button
                        type="button"
                        @click="addSpecification(true, 'check')"
                        class="compact button w-full"
                      >
                        <Icon name="material-symbols:add" /> Add check spec
                      </button>
                      <button
                        type="button"
                        @click="addSpecification(true)"
                        class="compact button w-full"
                      >
                        <Icon name="material-symbols:add" /> Add custom spec
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="field">
            <label for="pack-price">Price (Optional)</label>
            <LimbCurrencyInput
              v-model="placeholder.pack.price"
              v-if="mainForm.price_avail === 'Fixed'"
              id="pack-price"
              class="form-item"
              :class="{ error: validation.pack.r$.price.$error }"
              placeholder="Package price"
            />
            <div
              class="text-error text-sm"
              v-for="error of validation.pack.r$.price.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <footer class="bg-surface shadow-b-blend sticky bottom-0 mt-2 flex justify-end py-4">
            <button type="submit" class="primary button" @click.prevent="processPackage(control)">
              {{ typeof placeholder.modifyingPack === "number" ? "Modify package" : "Add package" }}
            </button>
          </footer>
        </div>
      </form>
    </LimbModal>
  </div>
</template>
