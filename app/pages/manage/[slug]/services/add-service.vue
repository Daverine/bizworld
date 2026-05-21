<script setup lang="ts">
definePageMeta({
  name: "add-service",
  layout: "details",
  auth: false,
  noCart: true,
});

const newService = reactive<{
  title: string;
  price: string;
  priceFigure?: number;
  description?: string;
  photo: File[];
  videoLink?: string;
}>({
  title: "",
  price: "",
  photo: [],
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
  <div class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 pointer-none-only [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 transition-[font-size] duration-200 flex gap-3 justify-between items-end bg-surface pin-top-blend m-0"
      >
        Add service
        <NuxtLink
          :to="{
            name: 'manage-biz-services',
            params: { slug: $route.params.slug },
          }"
          class="compact text-sm button"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
          <span class="content max-sm:hidden">Back</span>
        </NuxtLink>
      </div>
    </header>
    <div id="add-service" class="max-w-lg auto-contain no-edge" style="min-height: 80vh">
      <div>
        <div class="field">
          <label for="prod-title">Service</label>
          <div class="text-sm opacity-65">Add a specific service you are offering.</div>
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
          <label for="prod-price">Price</label>
          <div class="text-sm opacity-65">
            Set a price for your service to let customers know how much it costs.
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <LimbDropdown v-model="newService.price" type="select">
              <div class="drop menu">
                <div class="active item">No price</div>
                <div class="item">Free</div>
                <div class="item">Fixed</div>
                <div class="item">From</div>
              </div>
            </LimbDropdown>
            <LimbCurrencyInput
              v-model="newService.priceFigure"
              :disabled="['No price', 'Free'].includes(newService.price)"
              id="prod-price"
              class="form-item"
              placeholder="Service price"
              required
            />
          </div>
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
          <label>Add photo</label>
          <div class="text-sm opacity-65">
            Photos help customers to see what the service is all about.
          </div>
          <LimbIScroller :options="{ autoSetup: true }">
            <div v-for="(photo, index) in newService.photo" class="thumbnail image">
              <img :src="fileToURL(photo)" alt="Service photo" />
              <button
                @click="newService.photo.splice(index, 1)"
                class="text-sm circular icon button"
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
      </div>
    </div>
    <footer
      class="sticky bg-surface p-4 pin-bottom-blend z-level-1"
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
