<script setup lang="ts">
const props = defineProps<{
  details: product;
  manage?: boolean;
}>();
const emit = defineEmits<{
  update: [value?: { action: "delete" | "toggle-visibility"; productId: string }];
}>();

async function deleteProduct() {
  try {
    await $fetch("/api/product/delete", {
      method: "delete",
      query: {
        id: props.details.id,
      },
    });
    emit("update", { action: "delete", productId: props.details.id });
  } catch (error) {
    console.error(error);
    return;
  }
}
async function toggleVisibility() {
  try {
    await $fetch("/api/product/update", {
      method: "patch",
      query: {
        id: props.details.id,
      },
      body: {
        set: {
          hidden: !props.details.hidden,
        },
      },
    });
    emit("update", { action: "toggle-visibility", productId: props.details.id });
  } catch (error) {
    console.error(error);
    return;
  }
}

async function clickAction(e: Event) {
  await utils.safeClick(e, () =>
    navigateTo({ name: "product-page", params: { slug: props.details.slug } }),
  );
}
</script>
<template>
  <article @click="clickAction" class="page-prod item">
    <div
      class="photo-box aspect-square rounded-[inherit]"
      :style="`--box-photo: url(${details.photos[0]})`"
    >
      <NuxtImg preset="thumbnail" :src="details.photos[0]" alt="Product image" />
    </div>
    <div class="flex flex-col px-4">
      <div class="text-2xl font-semibold">₦{{ Number(details.base_price).toLocaleString() }}</div>
      <NuxtLink
        :to="{
          name: 'product-page',
          params: { slug: details.slug },
        }"
        class="line-clamp-3"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </NuxtLink>
      <div v-if="details.average_rating" class="text-center leading-4">
        <i
          v-tooltip:aria.unblocking
          :aria-label="`Rated ${details.average_rating}`"
          class="icon text-sm"
        >
          <Icon
            name="material-symbols:star-rounded"
            class="text-yellow-500"
            v-for="i in Math.floor(Number(details.average_rating))"
          />
          <Icon
            name="material-symbols:star-half-rounded"
            class="text-yellow-500"
            v-if="
              Number(details.average_rating) - Math.floor(Number(details.average_rating)) >= 0.5
            "
          />
          <Icon
            name="material-symbols:star-rounded"
            class="text-surface-v4"
            v-for="i in 5 - Math.round(Number(details.average_rating))"
          />
        </i>
        <div class="opacity-65">
          {{
            Number(details.review_count)
              ? `${Number(details.review_count).toLocaleString()} review(s)`
              : "No reviews yet"
          }}
        </div>
      </div>
    </div>
    <template v-if="manage">
      <div
        v-if="details.hidden"
        class="absolute inset-0 bg-surface/75 flex items-center justify-center text-center p-4 rounded-[inherit]"
      >
        <div>
          <Icon name="material-symbols:visibility-off-outline-rounded" class="text-4xl mb-2" />
          <div class="font-bold">Hidden</div>
          <p class="opacity-65">This product will be hidden from customers.</p>
        </div>
      </div>
      <LimbDropdown
        :options="{ directionPriority: { x: 'left' } }"
        class="circular icon flat button absolute top-2 right-2"
      >
        <Icon name="material-symbols:more-vert" />
      </LimbDropdown>
      <div class="drop menu">
        <NuxtLink
          :to="{
            name: 'edit-product',
            params: { slug: $route.params.slug, productSlug: details.slug },
          }"
          class="item"
        >
          <Icon name="material-symbols:edit-square-outline-rounded" class="lead" />
          Edit
        </NuxtLink>
        <div class="item" @click="toggleVisibility">
          <template v-if="details.hidden">
            <Icon name="material-symbols:visibility-outline-rounded" class="lead" /> Unhide
          </template>
          <template v-else>
            <Icon name="material-symbols:visibility-off-outline-rounded" class="lead" /> Hide
          </template>
        </div>
        <div class="item" @click="deleteProduct">
          <Icon name="material-symbols:delete-outline-rounded" class="lead" /> Delete
        </div>
      </div>
    </template>
  </article>
</template>

<style scoped>
.page-prod {
  display: flex;
  flex-direction: column;
  width: 16rem;
  max-width: 100%;
  padding-bottom: 1rem;
  position: relative;
  text-align: center;
  border-radius: var(--radius-block);
  border: 1px solid transparent;
  text-decoration: none !important;
  color: var(--on-surface);
  outline: none !important;

  &:hover {
    border-color: var(--outline);
  }
}
</style>
