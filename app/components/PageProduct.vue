<script setup>
const props = defineProps(['details']);
</script>
<template>
  <NuxtLink :to="`/${details.type}/${details.id}`" class="page-prod item">
    <NuxtImg class="prod-pic" preset="thumbnail" :src="details.media" alt="" />
    <div class="prod-content">
      <div class="prod-price">₦{{ details.price.toLocaleString() }}</div>
      <div
        class="font-semibold line-clamp-3"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </div>
      <div v-if="details.labels" class="flex gap-2 justify-center">
        <span v-for="label in details.labels" class="label">{{ label }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.page-prod {
  display: flex;
  flex-direction: column;
  width: 12.5rem;
  max-width: 100%;
  position: relative;
  text-align: center;
  border-radius: var(--sm-radius);
  border: 1px solid transparent;
  line-height: 1.375;
  text-decoration: none !important;
  color: var(--on-surface);
  outline: none !important;

  &:hover {
    border-color: var(--outline);
  }
}
.prod-content {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0rem 1rem 1rem;
}
.prod-pic {
  position: relative;
  border-radius: inherit;
  width: 100%;
}
.prod-price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
}
</style>
