<script setup lang="ts">
definePageMeta({ name: "manage-biz-products", layout: "common", auth: { only: "user" } });
const route = useRoute();
const { data: products, refresh } = await useFetch("/api/business/products", {
  method: "post",
  query: {
    slug: route.params.slug,
  },
});
const productListVersion = ref(0);
const configData = reactive<{
  product?: product;
  availability: string; // "available" | "nil" | "quantity"
  quantity: string;
  delivery_options: string[];
  promo?: boolean;
  state: string;
}>({
  availability: "available",
  quantity: "0",
  delivery_options: [],
  state: "",
});

function configController({ target, settings, exit }: Dialoger) {
  const productId = settings.caller?.dataset.ref;
  if (!productId) {
    exit();
    return;
  }
  const product = products.value?.find((prod) => prod.id === productId);
  if (!product) {
    exit();
    return;
  }

  configData.product = product;
  configData.promo = product.promo;
  configData.availability = product.availability;
  configData.quantity = product.quantity || "0";
  configData.delivery_options = product.delivery_options || [];

  useEventListener(target, "isComplete", () => {
    configData.state = "";
    configData.product = undefined;
    configData.promo = undefined;
    configData.availability = "available";
    configData.quantity = "0";
    configData.delivery_options = [];
  });
}
async function saveConfig({ settings }: Dialoger) {
  try {
    settings.dismissible = false;
    configData.state = "loading";
    const updatedProduct = await $fetch("/api/product/update", {
      method: "patch",
      query: {
        id: configData.product?.id,
        action: "config",
      },
      body: {
        promo: configData.promo,
        availability: configData.availability,
        quantity: configData.quantity,
        delivery_options: configData.delivery_options,
      },
    });

    settings.dismissible = true;
    configData.state = "done";

    if (updatedProduct === undefined) return;

    const index = products.value?.findIndex((el) => el.id === updatedProduct.id);

    if (index !== undefined && index > -1) products.value?.splice(index, 1, updatedProduct);
    triggerRef(products);
  } catch (error) {
    settings.dismissible = true;
    configData.state = "error";
    console.error("Product failed to update.", error);
  }
}
function productsUpdate(config?: { action: "delete" | "toggle-visibility"; productId: string }) {
  if (!config) refresh();
  else {
    const index = products.value?.findIndex((prod) => prod.id === config.productId);

    if (index !== undefined && index > -1) {
      if (config.action === "delete") products.value?.splice(index, 1);
      else products.value![index]!.hidden = !products.value![index]!.hidden;

      productListVersion.value++;
    }
  }
}
</script>
<template>
  <main class="auto-contain max-w-180">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 self-pointer-none mb-4 min-h-23 [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 bg-surface pin-top-blend m-0 flex items-end justify-between gap-3 transition-[font-size] duration-200"
      >
        Products
        <NuxtLink
          :to="{ name: 'add-product', params: { slug: $route.params.slug } }"
          class="compact button"
        >
          Add a product
        </NuxtLink>
      </div>
    </header>
    <section>
      <p>
        Let customers discover your business by adding products to your Business Page on Bizworld.
      </p>
      <div v-if="products?.length" :key="productListVersion" class="products-grid">
        <PageProduct
          v-for="product in products"
          :details="product"
          :key="product.id"
          manage
          @update="productsUpdate"
        />
      </div>
      <div v-else class="my-auto flex flex-col items-center gap-4 p-8">
        <Icon name="material-symbols:package-outline-rounded" class="text-6xl opacity-65" />
        <div class="text-center">
          <div class="font-bold">You don't have any products yet</div>
          <p class="opacity-65">Add your first product to get started.</p>
        </div>
        <NuxtLink :to="{ name: 'add-product', params: { slug: $route.params.slug } }" class="button"
          >Add a product</NuxtLink
        >
      </div>
    </section>
  </main>

  <LimbModal id="prod-config" :options="{ controller: configController }" v-slot="{ control }">
    <div class="dialog">
      <header class="flex gap-3 px-6 py-4">
        <div class="truncate font-bold">Configure: {{ configData.product?.title }}</div>
        <button
          type="button"
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </header>
      <div class="px-6 py-4">
        <div v-if="configData.state === 'loading'" class="flex flex-col items-center gap-4 p-8">
          <div class="m3-progress indeterminate" />
          <div class="text-center">
            <div class="font-bold">Saving changes...</div>
            <p class="opacity-65">Please wait while we save your changes.</p>
          </div>
        </div>
        <div v-else-if="configData.state === 'done'" class="flex flex-col items-center gap-4 p-8">
          <Icon
            name="material-symbols:check-circle-outline-rounded"
            class="text-success text-6xl"
          />
          <div class="text-center">
            <div class="font-bold">Changes saved</div>
            <p class="opacity-65">Your changes have been saved successfully.</p>
          </div>
        </div>
        <div v-else-if="configData.state === 'error'" class="flex flex-col items-center gap-4 p-8">
          <Icon name="material-symbols:error-outline-rounded" class="text-error text-6xl" />
          <div class="text-center">
            <div class="font-bold">Error saving changes</div>
            <p class="opacity-65">There was an error saving your changes. Please try again.</p>
          </div>
          <div class="flex w-full max-w-3xs gap-4">
            <button type="button" class="button flat exit-modal flex-1">Close</button>
            <button
              type="submit"
              @click.prevent="saveConfig(control)"
              class="button primary flex-1"
            >
              Try again
            </button>
          </div>
        </div>
        <form v-else>
          <div class="field">
            <label class="flex items-center justify-between gap-4"
              >Promotion sales
              <input type="checkbox" v-model="configData.promo" class="form-switch" />
            </label>

            <p class="text-sm opacity-65">
              Toggling the switch above on will offer customers the ability to purchase the product
              at it set promotional price. If not yet set, you can edit the product to se the
              promotion price.
            </p>
          </div>
          <div class="field">
            <label>Product availabilty</label>
            <p class="text-sm opacity-65">
              Choose from the select box below what define your product availability.
            </p>
            <LimbDropdown
              v-model="configData.availability"
              type="select"
              placeholder="Product availability"
            />
            <div class="drop menu">
              <div class="item" data-value="available">Available</div>
              <div class="item" data-value="nil">Not available</div>
              <div class="item" data-value="quantity">Set quantity</div>
            </div>
            <div v-if="configData.availability === 'quantity'" class="field">
              <label>Product quantity</label>
              <p class="text-sm opacity-65">
                Enter the quantity of this product that is available for sale.
              </p>
              <input
                type="number"
                placeholder="Enter product quantity"
                class="form-item"
                min="0"
                v-model="configData.quantity"
              />
            </div>
          </div>
          <div class="field">
            <label>Delivery options</label>
            <p class="text-sm opacity-65">
              Choose from the select box below the available form of delivery for this product.
            </p>
            <LimbDropdown
              v-model="configData.delivery_options"
              type="multiple select"
              placeholder="Delivery options"
            />
            <div class="indicating drop menu">
              <div class="item" data-value="bizworld delivery">Bizworld delivery</div>
              <div class="item" data-value="free delivery">Free delivery</div>
              <div class="item" data-value="self-pickup">Self Pickup</div>
            </div>
          </div>
          <div class="field">
            <button type="submit" @click.prevent="saveConfig(control)" class="primary button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </LimbModal>
</template>
