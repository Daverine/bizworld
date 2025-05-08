<script setup>
definePageMeta({ layout: 'biz-pages', name: 'biz-products' });
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
</script>

<template>
  <main v-if="isReady" class="products-main">
    <div class="heading">Products from us</div>
    <div class="products-grid">
      <PageProduct v-for="product in data.products" :details="product" />
    </div>
  </main>
</template>

<style>
.products-main {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.products-grid {
  display: grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 1rem;
  padding-bottom: 3rem;
  width: 100%;
}
</style>
