<script setup lang="ts">
definePageMeta({ name: "manage-biz-products", layout: "common", auth: { only: "user" } });
const route = useRoute();
const { data: products } = await useFetch("/api/business/products", {
  method: "post",
  query: {
    slug: route.params.slug,
  },
});
</script>
<template>
  <main class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 pointer-none-only [&.is-stuck_.text-h3]:text-2xl"
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
    <section class="body-sec">
      <p>
        Let customers discover your business by adding products to your Business Page on Bizworld.
      </p>
      <div class="products-grid">
        <PageProduct v-for="product in products" :details="product" />
      </div>
    </section>
  </main>
</template>
