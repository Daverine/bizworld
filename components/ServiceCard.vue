<script setup>
const props = defineProps(['details']);
</script>
<template>
  <div class="itm-tag">
    <Icon name="material-symbols:home-repair-service-outline-rounded" />
  </div>
  <div class="itm-display">
    <img :src="details.media" alt="" />
  </div>
  <div class="itm-content">
    <div
      class="link itm-title truncate"
      v-tooltip.unblocking
      :data-tooltip="details.title"
    >
      {{ details.title }}
    </div>
    <div class="itm-gap">
      <div class="bold">
        <span class="0-margined h6">From</span>
        <span class="h5 0-margined" style="color: var(--primary)">
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
        Deliver in {{ details.duration }} time.
      </div>
    </div>
    <div v-if="details.rating">
      <i
        v-tooltip.unblocking
        :data-tooltip="`Rated ${details.rating.rate} in ${details.rating.raters} reviews`"
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
          v-tooltip.unblocking
          data-tooltip="Seller is verified"
          class="r-spaced of-small green-text"
        />
        <span v-tooltip.unblocking :data-tooltip="details.bizDetails.name">{{
          details.bizDetails.name
        }}</span>
      </div>
      <div
        v-tooltip.unblocking
        :data-tooltip="details.bizDetails.location.address"
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
</template>
