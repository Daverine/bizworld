<script lang="ts" setup>
const props = defineProps<{
  details: service;
  manage?: boolean;
}>();
const img = useImage();
async function clickAction(e: Event) {
  await utils.safeClick(e, () =>
    navigateTo({ name: "service-page", params: { slug: props.details.slug } }),
  );
}
</script>
<template>
  <article @click="clickAction" class="page-serv item">
    <div
      class="photo-box aspect-square rounded-[inherit]"
      :style="`--box-photo: url(${img(details.pictures[0]!, {}, { preset: 'thumbnail' })})`"
    >
      <NuxtImg preset="thumbnail" :src="details.pictures[0]" alt="Service picture" />
      <button
        v-if="!manage"
        class="text-on-surface-v3 bg-overlay absolute right-2 bottom-2 text-lg"
      >
        <Icon name="material-symbols:favorite-outline-rounded" />
      </button>
    </div>
    <div class="serv-content">
      <NuxtLink
        :to="{
          name: 'service-page',
          params: { slug: details.slug },
        }"
        class="serv-title line-clamp-2 font-semibold"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </NuxtLink>
      <div v-if="details.price_avail !== 'on_request'">
        <span class="label mr-2">From</span>
        <span class="serv-price">₦{{ Number(details.price).toLocaleString() }}</span>
      </div>
    </div>
  </article>
</template>

<style>
.page-serv {
  display: flex;
  width: 32.5rem;
  max-width: 100%;
  position: relative;
  border-radius: var(--radius-block);
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
    border-color: var(--color-outline);
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
