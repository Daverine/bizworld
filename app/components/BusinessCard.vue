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

async function clickAction(e: Event) {
  await utils.safeClick(e, () =>
    navigateTo(
      { name: "biz-home", params: { slug: props.details.slug } },
      { open: { target: "_blank" } },
    ),
  );
}
</script>
<template>
  <article @click="clickAction" class="business-card">
    <header>
      <div class="flex gap-3 items-center">
        <div class="flex-none relative leading-0 w-max">
          <NuxtImg preset="logo" class="logo image" :src="details.logo" alt="Business Logo" />
          <SvgIcon
            v-if="details.verified"
            name="verified_sp"
            v-tooltip:aria.unblocking
            aria-label="Verified"
            class="absolute bottom-0.5 right-0.5"
          />
        </div>
        <div class="flex-auto">
          <NuxtLink
            :to="{ name: 'biz-home', params: { slug: details.id } }"
            target="_blank"
            class="text-h6 font-bold 0-margined line-clamp-2"
          >
            {{ details.bizName }}
          </NuxtLink>
          <span class="opacity-65 font-semibold">{{ details.mainCategory }}</span>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-y-1 text-sm font-semibold">
        <span
          v-tooltip:aria.unblocking
          :aria-label="details.location.address"
          class="text-on-surface-v2"
        >
          <Icon name="material-symbols:location-on-outline-rounded" class="text-sm" />
          {{ `${details.location.city}, ${details.location.state}` }}
        </span>
        <span
          v-tooltip:aria.unblocking
          :aria-label="`(Rated ${details.rating.rate} in ${details.rating.raters} reviews`"
        >
          <Icon class="text-sm text-yellow-300" name="material-symbols:star-rounded" />
          {{ `${details.rating.rate} (${details.rating.raters})` }}
        </span>
        <span>
          <Icon
            name="material-symbols:event-outline-rounded"
            class="text-sm mr-2"
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
              <span class="text-error">Closed. </span>
              Opens
              {{
                avail.willOpenToday
                  ? `${(avail.openTime as processedTime)[0]}:${
                      (avail.openTime as processedTime)[1]
                    }. `
                  : details.hours[avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1]
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
              <span v-if="avail.closesSoon" class="text-warning"> Closes soon. </span>
              <span v-else class="text-success">Open.</span>
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
      <p class="line-clamp-3 text-justify">
        {{ details.description }}
      </p>
      <LimbIScroller :options="{ scrollChildren: '.label' }">
        <div class="scroll-items items-center gap-y-2">
          <span class="label" v-for="service in details.services">
            {{ service }}
          </span>
        </div>
        <button class="text-xs l-scroll">
          <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </button>
        <button class="text-xs r-scroll">
          <Icon name="material-symbols:arrow-forward-ios-rounded" />
        </button>
      </LimbIScroller>
    </div>
    <footer class="flex gap-2">
      <NuxtLink
        :to="{ name: 'biz-home', params: { slug: details.id } }"
        target="_blank"
        class="primary button flex-auto"
      >
        <Icon name="material-symbols:globe" class="lead" />
        Visit page
      </NuxtLink>
      <LimbDropdown class="flat icon button">
        <Icon name="material-symbols:more-vert" />
      </LimbDropdown>
      <div class="drop menu">
        <button class="item">
          <Icon name="material-symbols:add-to-queue-outline-rounded" class="lead" />
          Follow
        </button>
      </div>
    </footer>
  </article>
</template>
<style scoped>
.business-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 20rem;
  max-width: 100%;
  position: relative;
  padding: 1rem;
  cursor: pointer;
  border-radius: var(--radius-block);
  box-shadow: inset 0px 0px 0px 1px var(--outline);

  @media screen and (max-width: 600px) {
    padding: 0.75rem;
  }

  @media screen and (max-width: 350px) {
    padding: 0.5rem;
  }
}
</style>
