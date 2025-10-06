<script setup>
const props = defineProps(['details']);
</script>
<template>
  <NuxtLink :to="`/${details.type}/${details.id}`" class="page-serv item">
    <NuxtImg class="serv-pic" preset="thumbnail" :src="details.media" alt="" />
    <div class="serv-content">
      <div
        class="semibold truncate big serv-title"
        style="--line-clamp: 2"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </div>
      <div class="truncate semibold" style="color: var(--on-surface-variant)">
        <Icon
          name="material-symbols:timelapse-outline-rounded"
          class="of-small r-spaced"
        />
        {{ details.duration }} delivery.
      </div>
      <div class="serv-price">
        <span class="of-mini">From </span>
        <span class="primary-text">₦{{ details.price.toLocaleString() }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss">
.page-serv {
  display: flex;
  width: 32.5rem;
  max-width: 100%;
  position: relative;
  border-radius: var(--sm-radius);
  border: 1px solid transparent;
  line-height: 1.375;
  display: grid;
  grid-template-columns: 12.5rem 1fr;
  grid-template-rows: auto;
  align-content: center;
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
  font-size: 2rem;
  font-weight: bold;
}
.serv-details {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: calc(var(--sm-size) * 1rem);
}
</style>
