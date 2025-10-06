<script setup lang="ts">
definePageMeta({ name: 'manage-biz-products', layout: 'common', auth: false });
const data = useBizStore();
</script>
<template>
  <main class="container-md">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1"
      style="min-height: 5.75rem; margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 flexbox guttered flex-separate align-end surface-bg pin-top-blend 0-margined"
      >
        Products
        <NuxtLink
          :to="{ name: 'add-product', params: { id: $route.params.id } }"
          class="compact button"
        >
          Add a product
        </NuxtLink>
      </div>
    </header>
    <section class="body-sec">
      <p>
        Let customers discover your business by adding products to your Business
        Page on Bizworld.
      </p>
      <div class="products-grid">
        <PageProduct v-for="product in data.products" :details="product" />
      </div>
    </section>
  </main>
</template>
