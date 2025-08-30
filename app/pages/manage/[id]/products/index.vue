<script setup lang="ts">
definePageMeta({ name: 'manage-biz-products', layout: 'common', auth: false });
const route = useRoute();
const data = useBizStore();
</script>
<template>
  <main class="flexible col" id="feed">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin fluid z-level-1 pin-top-blend"
      style="background-color: var(--surface); margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 0-margined align-end flexbox guttered flex-separate"
      >
        Products
        <NuxtLink :to="{ name: 'add-product', params: { id: route.params.id } }" class="compact button">
          Add product
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
