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

function productsUpdate(config?: { action: "delete" | "toggle-visibility"; productId: string }) {
  console.log(config);
  if (!config) refresh();
  else if (config.action === "delete") {
    const index = products.value?.findIndex((p) => p.id === config.productId);
    if (index !== undefined && index > -1) {
      products.value?.splice(index, 1);
      triggerRef(products);
    }
  } else if (config.action === "toggle-visibility") {
    const productIndex = products.value?.findIndex((p) => p.id === config.productId);
    if (productIndex !== undefined && productIndex > -1) {
      products.value![productIndex]!.hidden = !products.value![productIndex]!.hidden;
      productListVersion.value++;
    }
  }
}
</script>
<template>
  <main class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 self-pointer-none [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 transition-[font-size] duration-200 flex gap-3 justify-between items-end bg-surface pin-top-blend m-0"
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
      <div v-else class="flex flex-col items-center gap-4 my-auto p-8">
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
</template>
