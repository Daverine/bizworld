<script setup lang="ts">
const props = defineProps<{
  details: {
    id: string;
    type: string;
    bizName: string;
    mainCategory: string;
    services: string[];
    logo: string;
    description: string;
    verified: boolean;
    location: { address: string; city: string; state: string; map: string };
    hours: weeklySchedule;
    rating: { rate: number; raters: number };
  };
}>();
const avail = useAvailability(props.details.hours);
const router = useRouter();

function clickAction(e: Event) {
  const target = e.target as HTMLElement;
  if (target.closest(utils.focusableElementsSelector)) return;
  window.open(
    router.resolve({ name: 'biz-home', params: { id: props.details.id } }).href,
    '_blank'
  );
}
</script>
<template>
  <article @click="clickAction" class="business-card">
    <header>
      <div class="flexbox guttered align-center">
        <div
          class="flex-none"
          style="position: relative; width: max-content; line-height: 0"
        >
          <NuxtImg
            preset="logo"
            class="logo image"
            :src="details.logo"
            alt="Business Logo"
          />
          <SvgIcon
            v-if="details.verified"
            name="verified_sp"
            v-tooltip:aria.unblocking
            aria-label="Verified"
            style="position: absolute; bottom: 0.125em; right: 0.125em"
          />
        </div>
        <div class="flexible">
          <NuxtLink
            :to="{ name: 'biz-home', params: { id: details.id } }"
            target="_blank"
            class="h6 bold 0-margined truncate"
            style="--line-clamp: 2"
          >
            {{ details.bizName }}
          </NuxtLink>
          <span class="faint-text semibold">{{ details.mainCategory }}</span>
        </div>
      </div>
      <div
        class="flexbox flex-wrap align-center justify-center of-small semibold"
        style="column-gap: 0.7em"
      >
        <span
          v-tooltip:aria.unblocking
          :aria-label="details.location.address"
          style="color: var(--on-surface-variant)"
        >
          <Icon
            name="material-symbols:location-on-outline-rounded"
            class="of-small"
          />
          {{ `${details.location.city}, ${details.location.state}` }}
        </span>
        <span
          v-tooltip:aria.unblocking
          :aria-label="`(Rated ${details.rating.rate} in ${details.rating.raters} reviews`"
        >
          <Icon
            class="of-small yellow-text"
            name="material-symbols:star-rounded"
          />
          {{ `${details.rating.rate} (${details.rating.raters})` }}
        </span>
        <span>
          <Icon
            name="material-symbols:event-outline-rounded"
            class="of-small r-spaced"
            v-tooltip:aria.unblocking
            aria-label="Note that the given detail is generated using your device time relative to the Business location timezone."
          />
          <span
            v-tooltip:aria.unblocking
            :aria-label="
              !avail.openTime
                ? 'Did not open today at all.'
                : `Open today by ${avail.openTime[0]}:${avail.openTime[1]} and closes by ${(avail.closeTime as processedTime)[0]}:${(avail.closeTime as processedTime)[1]}.`
            "
          >
            <template v-if="avail.isClosed">
              <span class="error-text">Closed. </span>
              Opens
              {{
                avail.willOpenToday
                  ? `${(avail.openTime as processedTime)[0]}:${
                      (avail.openTime as processedTime)[1]
                    }. `
                  : details.hours[
                      avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                    ]
                  ? `${
                      (
                        details.hours[
                          avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                        ] as unprocessedTime
                      )[0]
                    } Tomorrow. `
                  : avail.nextOpenDay
                  ? `${
                      (details.hours[avail.nextOpenDay] as unprocessedTime)[0]
                    } on ${avail.whatDay(avail.nextOpenDay)}. `
                  : `NILL.`
              }}
            </template>
            <template v-else>
              <span v-if="avail.closesSoon" class="warning-text">
                Closes soon.
              </span>
              <span v-else class="success-text">Open.</span>
              Closes
              {{
                `${(avail.closeTime as processedTime)[0]}:${
                  (avail.closeTime as processedTime)[1]
                }. `
              }}
            </template>
          </span>
        </span>
      </div>
    </header>
    <div>
      <p class="truncate text-justify" style="--line-clamp: 3">
        {{ details.description }}
      </p>
      <LimbIScroller :options="{ scrollChildren: '.label' }">
        <div class="scroll-items align-center" style="column-gap: 0.5em">
          <span class="label" v-for="service in details.services">
            {{ service }}
          </span>
        </div>
        <button class="mini l-scroll">
          <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </button>
        <button class="mini r-scroll">
          <Icon name="material-symbols:arrow-forward-ios-rounded" />
        </button>
      </LimbIScroller>
    </div>
    <footer class="flexbox sm-guttered">
      <NuxtLink
        :to="{ name: 'biz-home', params: { id: details.id } }"
        target="_blank"
        class="primary button flexible"
      >
        <Icon name="material-symbols:globe" class="lead" />
        Visit page
      </NuxtLink>
      <LimbDropdown class="flat circular button">
        <Icon name="material-symbols:more-vert" />
        <div class="drop menu">
          <button class="item">
            <Icon
              name="material-symbols:add-to-queue-outline-rounded"
              class="lead"
            />
            Follow
          </button>
        </div>
      </LimbDropdown>
    </footer>
  </article>
</template>
<style lang="scss" scoped>
.business-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 20rem;
  max-width: 100%;
  position: relative;
  padding: 1rem;
  cursor: pointer;
  border-radius: var(--sm-radius);
  box-shadow: inset 0px 0px 0px 1px var(--outline);

  @media screen and (max-width: 600px) {
    padding: 0.75rem;
  }

  @media screen and (max-width: 350px) {
    padding: 0.5rem;
  }
}
</style>
