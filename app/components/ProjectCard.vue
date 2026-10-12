<script lang="ts" setup>
const props = defineProps<{
  details: {
    id: string;
    type: string;
    title: string;
    media: string;
    price: number;
    duration: number;
    rating: {
      rate: number;
      raters: number;
    };
    bizDetails: {
      name: string;
      id: string;
      verified: boolean;
      location: {
        address: string;
        city: string;
        state: string;
        map: string;
      };
    };
  };
}>();
</script>
<template>
  <article class="project-card">
    <NuxtImg class="itm-display" preset="thumbnail" :src="details.media" alt="" />
    <div class="itm-content">
      <NuxtLink
        :to="{ name: 'project-page', params: { slug: details.id } }"
        class="line-clamp-2 font-semibold"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </NuxtLink>
      <div class="itm-price">₦{{ details.price.toLocaleString() }}</div>
      <div class="truncate text-sm font-semibold" style="color: var(--on-surface-variant)">
        <Icon name="material-symbols:timelapse-outline-rounded" class="mr-2 text-sm" />
        Deliver within
        {{ details.duration > 1 ? details.duration + " days" : "24 hours" }}
      </div>
      <div v-if="details.rating">
        <i
          v-tooltip:aria.unblocking
          :aria-label="`Rated ${details.rating.rate} in ${details.rating.raters} reviews`"
          class="icon mr-2 text-sm text-yellow-500"
        >
          <Icon name="material-symbols:star-rounded" v-for="i in Math.floor(details.rating.rate)" />
          <Icon
            name="material-symbols:star-half-rounded"
            v-if="details.rating.rate - Math.floor(details.rating.rate) >= 0.5"
          />
          <Icon
            name="material-symbols:star-outline-rounded"
            v-for="i in 5 - Math.round(details.rating.rate)"
          />
        </i>
      </div>
      <div class="truncate text-sm font-semibold">
        <Icon
          v-if="details.bizDetails.verified"
          name="material-symbols:verified-outline"
          v-tooltip:aria.unblocking
          aria-label="Seller is verified"
          class="green-text mr-2 text-sm"
        />
        <span v-tooltip:aria.unblocking :aria-label="details.bizDetails.name">{{
          details.bizDetails.name
        }}</span>
      </div>
      <div
        v-tooltip:aria.unblocking
        :aria-label="details.bizDetails.location.address"
        class="truncate text-sm font-semibold"
      >
        <Icon name="material-symbols:location-on-outline-rounded" class="mr-2 text-sm" />
        {{ `${details.bizDetails.location.city}, ${details.bizDetails.location.state}` }}
      </div>
    </div>
  </article>
</template>
<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  width: 15rem;
  max-width: 100%;
  position: relative;
  border-radius: var(--radius-block);
  box-shadow: inset 0px 0px 0px 1px var(--color-outline);

  .itm-display {
    width: 100%;
    border-radius: inherit;

    & > img {
      width: 100%;
      height: auto;
      border-radius: inherit;
    }
  }

  .itm-content {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    padding: 0em 1em 1em;
    text-align: center;
  }

  .itm-price {
    font-size: 2em;
    font-weight: bold;
  }
}
</style>
