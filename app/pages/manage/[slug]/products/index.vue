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
  <main class="container-md">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1"
      style="min-height: 5.75rem; margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 flex gap-3 justify-between items-end surface-bg pin-top-blend m-0"
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
