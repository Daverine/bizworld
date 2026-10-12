<script setup lang="ts">
definePageMeta({
  name: "add-service",
  layout: "details",
  auth: false,
  noCart: true,
});

const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const newService = reactive<{
  title: string;
  price: string;
  priceFigure?: number;
  duration: string;
  availExemption: string[];
  specifications: {
    name: string;
    value: string | boolean;
  }[];
  description?: string;
  photo: File[];
  videoLink?: string;
  requireBooking?: boolean;
}>({
  title: "",
  price: "",
  duration: "",
  availExemption: [],
  photo: [],
  specifications: [],
});
function fileToURL(file: File) {
  return URL.createObjectURL(file);
}
function handleNewPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    newService.photo.push(input.files[0]);
    input.value = "";
  }
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
    <div id="add-service" class="auto-contain no-edge max-w-lg" style="min-height: 80vh">
      <div>
        <div class="field">
          <label for="service-title">Service title</label>
          <div class="text-sm opacity-65">
            This field should contain what this is service called or can be called specifically.
          </div>
          <input
            v-model="newService.title"
            id="prod-title"
            class="form-item"
            type="text"
            placeholder="Service title"
            required
          />
        </div>
        <div class="field">
          <label>Add photo</label>
          <div class="text-sm opacity-65">
            Photos help customers to see what the service is all about.
          </div>
          <LimbIScroller :options="{ autoSetup: true }">
            <div v-for="(photo, index) in newService.photo" class="thumbnail image">
              <img :src="fileToURL(photo)" alt="Service photo" />
              <button
                @click="newService.photo.splice(index, 1)"
                class="circular icon button text-sm"
                style="position: absolute; top: 0.25rem; right: 0.25rem"
              >
                <Icon name="material-symbols:delete-outline-rounded" />
              </button>
            </div>
          </LimbIScroller>
          <label class="icon button design-takeover">
            <Icon name="material-symbols:add" /> Add
            {{ newService.photo.length ? "another" : "" }} photo
            <input type="file" @change="handleNewPhoto" accept="image/*" />
          </label>
        </div>
        <div class="field">
          <label>Link to youtube or Facebook video</label>
          <input
            v-model="newService.videoLink"
            class="form-item"
            type="text"
            placeholder="e.g. https://youtube.com/..."
          />
        </div>
        <div class="field">
          <label for="prod-description">Description</label>
          <p class="text-sm opacity-65">
            Describe your service to help customers understand what you are offering.
          </p>
          <textarea
            v-model="newService.description"
            id="prod-description"
            class="form-item"
            placeholder="Service description"
            rows="3"
          ></textarea>
        </div>
        <div class="field">
          <label for="prod-duration">Duration</label>
          <div class="text-sm opacity-65">
            Set a duration for your service to let customers know how long it takes to complete.
          </div>
          <input
            v-model="newService.duration"
            id="prod-duration"
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
              You can add as many specifications as you want by clicking on the "Add check spec" or
              "Add custom spec" button below. This specifications can also be modified on service
              options.
            </p>
            <p>
              The "Add check spec" button adds a specification with a checkbox value, while the "Add
              custom spec" button adds a specification with a text value.
            </p>
          </div>
          <table id="spec-table" class="basic table align-middle">
            <thead>
              <tr>
                <th>Specification</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="index in newService.specifications.length">
                <td>
                  <input
                    v-model="newService.specifications[index - 1]!.name"
                    :id="`spec-name${index}`"
                    class="form-item w-full"
                    type="text"
                    placeholder="Specification name"
                  />
                </td>
                <td class="takenover text-center">
                  <label>
                    <input
                      v-if="typeof newService.specifications[index - 1]!.value === 'string'"
                      v-model="newService.specifications[index - 1]!.value"
                      :id="`spec-value${index}`"
                      class="form-item w-full"
                      type="text"
                      placeholder="Specification value"
                    />
                    <input
                      v-else
                      v-model="newService.specifications[index - 1]!.value"
                      :id="`spec-value${index}`"
                      class="form-item text-xl"
                      type="checkbox"
                      placeholder="Specification value"
                    />
                  </label>
                </td>
                <td class="text-center">
                  <button
                    type="button"
                    @click="newService.specifications.splice(index - 1, 1)"
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
                  <div class="flex gap-4">
                    <button
                      type="button"
                      @click="newService.specifications.push({ name: '', value: true })"
                      class="compact button w-full"
                    >
                      <Icon name="material-symbols:add" /> Add check spec
                    </button>
                    <button
                      type="button"
                      @click="newService.specifications.push({ name: '', value: '' })"
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
          <label for="prod-price">Price</label>
          <div class="text-sm opacity-65">
            Set a price for your service to let customers know how much it costs.
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <LimbDropdown v-model="newService.price" type="select">
              <div class="drop menu">
                <div class="active item">On Request</div>
                <div class="item">Fixed</div>
                <div class="item">From</div>
              </div>
            </LimbDropdown>
            <LimbCurrencyInput
              v-model="newService.priceFigure"
              :disabled="newService.price === 'On Request'"
              id="prod-price"
              class="form-item"
              placeholder="Service price"
              required
            />
          </div>
        </div>
        <div class="field">
          <div class="field-label">Service Package Variation</div>
          <p class="text-sm opacity-65">
            You can add variations to your service package to let customers choose from different
            options. For example, you can offer a basic package, a standard package, and a premium
            package. Each package can have different specifications and prices.
          </p>
          <div class="wrappable menu">
            <button type="button" class="button as-app open-modal" data-target="add-package">
              <Icon class="text-xl" name="material-symbols:add-rounded" />
              Add a package
            </button>
          </div>
          <LimbModal id="add-package" title="Add a package">
            <div class="dialog">
              <div class="field">
                <label for="package-name">Package name</label>
                <input
                  id="package-name"
                  class="form-item"
                  type="text"
                  placeholder="Package name"
                  required
                />
              </div>
              <div class="field">
                <label for="package-price">Package price</label>
                <LimbCurrencyInput
                  id="package-price"
                  class="form-item"
                  placeholder="Package price"
                  required
                />
              </div>
              <div class="field">
                <label for="package-specs">Package specifications</label>
                <textarea
                  id="package-specs"
                  class="form-item"
                  placeholder="Package specifications"
                  rows="3"
                ></textarea>
              </div>
              <button type="button" class="primary button w-full">Add package</button>
            </div>
          </LimbModal>
        </div>
        <div class="field">
          <label>Service Availability </label>
          <p class="text-sm opacity-65">
            Service availability depends on business availability. So, this service will appear to
            be available on the days and time your business is available. But you can set days of
            the week this service wont be available regardless of your business availability.
          </p>
          <table class="borderless table">
            <thead>
              <tr>
                <th colspan="2">Service exemption days</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="index in newService.availExemption.length">
                <td class="w-full">
                  <LimbDropdown
                    type="select"
                    class="w-full capitalize"
                    v-model="newService.availExemption[index - 1]"
                    name="exemption-day"
                    placeholder="A day of the week"
                  />
                  <div class="drop menu">
                    <div v-for="day in weekDays" class="item capitalize" :data-value="day">
                      {{ day }}
                    </div>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    @click="newService.availExemption.splice(index - 1, 1)"
                    v-tooltip:aria.unblocking
                    aria-label="Remove coverage area"
                    class="circular outlined icon button text-sm"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" />
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button class="button compact w-full" @click="newService.availExemption.push('')">
                    <Icon name="material-symbols:add-rounded" />
                    Add Exemption
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <LimbDropdown type="select" placeholder="Service availability" />
          <div class="drop menu">
            <div class="item" data-value="available">Available</div>
            <div class="item" data-value="nil">Not available</div>
            <div class="item" data-value="quantity">Booking</div>
          </div>
          <div class="field">
            <label>Bookable days</label>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>
