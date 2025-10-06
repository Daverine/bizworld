<script lang="ts" setup>
const props = defineProps<{
  details: {
    id: string;
    type: string;
    title: string;
    media: string;
    labels: string[];
    price: number;
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
  <article class="product-card">
    <NuxtLink
      :to="{ name: 'product-page', params: { id: details.id } }"
      class="itm-display"
    >
      <NuxtImg preset="thumbnail" :src="details.media" alt="" />
    </NuxtLink>
    <div class="itm-content">
      <div class="prod-price">₦{{ details.price.toLocaleString() }}</div>
      <NuxtLink
        :to="{ name: 'product-page', params: { id: details.id } }"
        class="truncate semibold"
        style="--line-clamp: 2"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </NuxtLink>
      <LimbIScroller
        v-if="details.labels"
        :options="{ scrollChildren: '.label' }"
      >
        <div
          class="scroll-items align-center"
          style="gap: 0.5em; margin: 0px auto"
        >
          <span v-for="label in details.labels" class="label">{{ label }}</span>
        </div>
        <button class="mini l-scroll">
          <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </button>
        <button class="mini r-scroll">
          <Icon name="material-symbols:arrow-forward-ios-rounded" />
        </button>
      </LimbIScroller>
      <div v-if="details.rating">
        <i
          v-tooltip:aria.unblocking
          :aria-label="`Rated ${details.rating.rate} in ${details.rating.raters} reviews`"
          class="icon of-small yellow-text r-spaced"
        >
          <Icon
            name="material-symbols:star-rounded"
            v-for="i in Math.floor(details.rating.rate)"
          />
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
      <div class="itm-gap">
        <div class="of-small semibold truncate">
          <Icon
            v-if="details.bizDetails.verified"
            name="material-symbols:verified-outline"
            v-tooltip:aria.unblocking
            aria-label="Seller is verified"
            class="r-spaced of-small green-text"
          />
          <span v-tooltip:aria.unblocking :aria-label="details.bizDetails.name">{{
            details.bizDetails.name
          }}</span>
        </div>
        <div
          v-tooltip:aria.unblocking
          :aria-label="details.bizDetails.location.address"
          class="of-small semibold truncate"
        >
          <Icon
            name="material-symbols:location-on-outline-rounded"
            class="of-small r-spaced"
          />
          {{
            `${details.bizDetails.location.city}, ${details.bizDetails.location.state}`
          }}
        </div>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped>
.product-card {
  display: flex;
  flex-direction: column;
  width: 15rem;
  max-width: 100%;
  position: relative;
  border-radius: var(--sm-radius);
  box-shadow: inset 0px 0px 0px 1px var(--outline);

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

  .prod-price {
    font-size: 2em;
    font-weight: bold;
    color: var(--primary);
  }
}
</style>
