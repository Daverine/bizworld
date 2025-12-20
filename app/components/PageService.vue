<script lang="ts" setup>
const props = defineProps<{
  details: {
    id: string;
    type: string;
    title: string;
    photo: string;
    price: string;
    priceFigure?: number;
    description?: string;
  }
}>();
</script>
<template>
  <NuxtLink :to="`/${details.type}/${details.id}`" class="page-serv item">
    <NuxtImg class="serv-pic" preset="thumbnail" :src="details.photo" alt="" />
    <div class="serv-content">
      <div
        class="font-semibold line-clamp-2 serv-title"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </div>
      <div v-if="details.price !== 'No price'">
        <span v-if="details.price === 'From'" class="label mr-2">From</span>
        <span class="serv-price">{{ ['From', 'Fixed'].includes(details.price) ? `₦${details.priceFigure!.toLocaleString()}` : details.price  }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style>
.page-serv {
  display: flex;
  width: 32.5rem;
  max-width: 100%;
  position: relative;
  border-radius: var(--sm-radius);
  border: 1px solid transparent;
  line-height: 1.375;
  display: grid;
  grid-template-columns: 8rem 1fr;
  grid-template-rows: auto;
  align-content: center;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none !important;
  color: var(--on-surface);
  outline: none !important;

  &:hover {
    border-color: var(--outline);
  }
}
.serv-content {
  padding: 0.5rem;
}
.serv-pic {
  position: relative;
  border-radius: inherit;
  width: 100%;
}
.serv-price {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
