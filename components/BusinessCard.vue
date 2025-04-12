<script setup>
const props = defineProps(['details']);
const avail = useAvailability(props.details.hours);
</script>
<template>
  <div class="itm-tag">
    <Icon name="material-symbols:store-outline-rounded" />
  </div>
  <div class="itm-display">
    <div class="image">
      <img :src="details.logo" :alt="`Business Logo for ${details.name}`" />
      <SvgIcon
        v-if="details.verified"
        name="verified_sp"
        title="Business verified"
        class="small green-text"
        style="position: absolute; bottom: 0px; right: 0px"
      />
    </div>
  </div>
  <div class="itm-content">
    <div class="link itm-title truncate">{{ details.name }}</div>
    <div class="itm-gap">
      <span class="of-small semibold">{{ details.category }}</span>
      <span
        :title="details.location.address"
        class="truncate of-small semibold"
        style="color: var(--on-surface-variant)"
      >
        <Icon
          name="material-symbols:location-on-outline-rounded"
          class="of-small r-spaced"
        />
        {{
          `${details.location.city}, ${details.location.state}`
        }}
      </span>
    </div>
    <div class="semibold itm-gap">
      <i
        v-tooltip.unblocking
        :data-tooltip="`(Rated ${details.rating.rate} in ${details.rating.raters} reviews`"
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
      <span
        v-tooltip.unblocking
        :data-tooltip="
          avail.openTime[0] < 0
            ? 'Did not open today at all.'
            : `Open today by ${avail.openTime[0]}:${avail.openTime[1]} and closes by ${avail.closeTime[0]}:${avail.closeTime[1]}.`
        "
        class="of-small"
      >
        <Icon
          name="material-symbols:calendar-today-outline-rounded"
          class="r-spaced of-small"
        />
        <template v-if="avail.isClosed">
          <span class="error-text">Closed.</span>
          Opens
          {{
            avail.willOpenToday
              ? `${avail.openTime[0]}:${avail.openTime[1]}`
              : details.hours[
                  avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                ][0] !== -1
              ? `${
                  details.hours[
                    avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                  ][0]
                } Tomorrow`
              : `${
                  details.hours[avail.nextOpenDay(details.hours)][0]
                } on ${avail.whatDay(avail.nextOpenDay(details.hours))}`
          }}
        </template>
        <template v-else>
          <span v-if="avail.closesSoon" class="warning-text">
            Closes soon.
          </span>
          <span v-else class="success-text">Open.</span>
          Closes
          {{ `${avail.closeTime[0]}:${avail.closeTime[1]}` }}
        </template>
      </span>
    </div>
    <!-- <div class="itm-gap">
            <span class="compact mini label">Business</span>
        </div> -->
  </div>
</template>
