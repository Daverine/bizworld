<script setup>
const props = defineProps(['details']);
</script>
<template>
  <article class="project-card">
    <div class="itm-display">
      <NuxtImg preset="thumbnail" :src="details.media" alt="" />
    </div>
    <div class="itm-content">
      <div
        class="truncate semibold"
        style="--line-clamp: 2"
        v-tooltip:aria.unblocking
        :aria-label="details.title"
      >
        {{ details.title }}
      </div>
      <div class="bold">
        <span class="0-margined">From</span>
        <span class="itm-price" style="color: var(--primary)">
          ₦{{ details.price.toLocaleString() }}
        </span>
      </div>
      <div
        class="truncate semibold of-small"
        style="color: var(--on-surface-variant)"
      >
        <Icon
          name="material-symbols:timelapse-outline-rounded"
          class="of-small r-spaced"
        />
        Deliver within
        {{ details.duration > 1 ? details.duration + ' days' : '24 hours' }}
      </div>
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
  </article>
</template>
<style lang="scss" scoped>
.project-card {
  display: flex;
  flex-direction: column;
  width: 15rem;
  max-width: 100%;
  position: relative;
  border-radius: var(--sm-radius);

  &:hover {
    box-shadow: inset 0px 0px 0px 1px var(--outline);
  }

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
    color: var(--primary);
  }
}
</style>
