<script setup>
definePageMeta({ layout: 'biz-pages', name: 'biz-home' });
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
</script>

<template>
  <main v-if="isReady">
    <div
      class="dm-display"
      style="position: relative; padding-top: calc(100% / 6 * 2)"
    >
      <NuxtImg
        format="webp"
        sizes="1280px"
        class="image open-lightbox"
        data-target="lightbox1"
        :data-lightbox="data.details.coverPic"
        style="
          position: absolute;
          height: 100%;
          width: 100%;
          object-fit: cover;
          top: 0px;
          left: 0px;
        "
        :src="data.details.coverPic"
        alt="Business page cover picture"
      />
    </div>
    <div class="flexbox guttered flex-wrap align-center" style="padding: 1rem">
      <Icon name="material-symbols:domain-rounded" class="flex-none" />
      <div class="flexible" style="min-width: 65%">
        {{ data.details.description }}
        <a :href="`${data.details.bizUrl}/about_us`">Learn more.</a>
      </div>
      <button class="flex-none auto-l-margined primary compact button">
        Contact Us
      </button>
    </div>
    <div class="fluid grid-layout surface-v2-bg" style="padding: 1rem">
      <div class="flexbox guttered flex-wrap align-center">
        <Icon name="material-symbols:today-outline-rounded" class="flex-none" />
        <div class="flexible" style="min-width: 65%">
          <span
            v-tooltip.unblocking
            :data-tooltip="
              !avail.openTime
                ? 'Did not open today at all.'
                : `Open today by ${avail.openTime[0]}:${avail.openTime[1]} and closes by ${avail.closeTime[0]}:${avail.closeTime[1]}.`
            "
          >
            We are currently
            <template v-if="avail.isClosed">
              <span class="error-text">closed. </span>
              Opens
              {{
                avail.willOpenToday
                  ? `${avail.openTime[0]}:${avail.openTime[1]}. `
                  : data.details.hours[
                      avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                    ]
                  ? `${
                      data.details.hours[
                        avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                      ][0]
                    } Tomorrow. `
                  : `${
                      data.details.hours[avail.nextOpenDay][0]
                    } on ${avail.whatDay(avail.nextOpenDay)}. `
              }}
            </template>
            <template v-else>
              <span v-if="avail.closesSoon" class="warning-text">
                Closes soon.
              </span>
              <span v-else class="success-text">Open.</span>
              Closes
              {{ `${avail.closeTime[0]}:${avail.closeTime[1]}. ` }}
            </template>
            <a href="#">Check our business hours</a>
          </span>
          <Icon
            name="material-symbols:info-outline-rounded"
            class="mini l-spaced faint-text-more"
            v-tooltip.unblocking
            data-tooltip="Note that the given detail is generated using your device time relative to the Business location timezone."
          />
        </div>
        <NuxtLink
          :to="{ name: 'biz-about', params: { id: $route.params.id }, hash: '#biz-hours' }"
           class="flex-none auto-l-margined compact button">
          Schedule Visit
        </NuxtLink>
      </div>
    </div>
    <section>
      <div class="heading" style="padding: 1rem">New and Trending products</div>
      <LimbIScroller class="flexbox justify-center">
        <div class="scroll-items guttered">
          <PageProduct
            v-for="i in Math.min(6, data.products.length)"
            :set="(product = data.products[i - 1])"
            :details="product"
            class="flex-none"
          />
          <NuxtLink
            :to="{ name: 'biz-products', params: { id: $route.params.id } }"
            v-if="data.products.length > 6"
            class="button flat as-app"
            style="width: 12.5rem; align-self: stretch"
          >
            <Icon name="material-symbols:arrow-forward-rounded" />
            Show All
          </NuxtLink>
        </div>
        <div class="l-scroll">
          <div class="circular button">
            <Icon name="material-symbols:arrow-back-ios-new-rounded" />
          </div>
        </div>
        <div class="r-scroll">
          <div class="circular button">
            <Icon name="material-symbols:arrow-forward-ios-rounded" />
          </div>
        </div>
      </LimbIScroller>
    </section>
    <section>
      <div class="heading" style="padding: 1rem">Our projects listing</div>
      <LimbIScroller class="flexbox justify-center">
        <div class="scroll-items guttered">
          <PageService
            v-for="i in Math.min(6, data.projects.length)"
            :set="(project = data.projects[i - 1])"
            :details="project"
            class="flex-none"
          />
          <NuxtLink
            :to="{ name: 'biz-services', params: { id: $route.params.id } }"
            v-if="data.projects.length > 6"
            class="button flat as-app"
            style="width: 12.5rem; align-self: stretch"
          >
            <Icon name="material-symbols:arrow-forward-rounded" />
            Show All
          </NuxtLink>
        </div>
        <div class="l-scroll">
          <div class="circular button">
            <Icon name="material-symbols:arrow-back-ios-new-rounded" />
          </div>
        </div>
        <div class="r-scroll">
          <div class="circular button">
            <Icon name="material-symbols:arrow-forward-ios-rounded" />
          </div>
        </div>
      </LimbIScroller>
    </section>
    <section class="posts-sec">
      <div
        v-scrollPin="{
          top: 136,
          bottom: 64,
          sticky: true,
        }"
        class="page-aside biz-pin text-center"
      >
        <div
          class="dm-logo flex-none"
          style="position: relative; width: max-content; line-height: 0"
        >
          <NuxtImg
            preset="logo"
            class="logo image"
            style="width: 5rem; height: 5rem; object-fit: contain"
            :src="data.details.logo"
            alt="Business Logo"
          />
          <SvgIcon
            v-if="data.details.verified"
            name="verified_sp"
            v-tooltip.unblocking
            data-tooltip="Verified"
            style="position: absolute; bottom: 0.5em; right: 0.5em"
          />
        </div>
        <h6 class="dm-title text-center">{{ data.details.bizName }}</h6>
        <div class="faint-text">{{ data.details.mainCategory }}</div>
        <p>
          <span
            v-tooltip.unblocking
            :data-tooltip="
              !avail.openTime
                ? 'Did not open today at all.'
                : `Open today by ${avail.openTime[0]}:${avail.openTime[1]} and closes by ${avail.closeTime[0]}:${avail.closeTime[1]}.`
            "
          >
            We are currently
            <template v-if="avail.isClosed">
              <span class="error-text">closed. </span>
              Opens
              {{
                avail.willOpenToday
                  ? `${avail.openTime[0]}:${avail.openTime[1]}. `
                  : data.details.hours[
                      avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                    ]
                  ? `${
                      data.details.hours[
                        avail.now.getDay() === 6 ? 0 : avail.now.getDay() + 1
                      ][0]
                    } Tomorrow. `
                  : `${
                      data.details.hours[avail.nextOpenDay][0]
                    } on ${avail.whatDay(avail.nextOpenDay)}. `
              }}
            </template>
            <template v-else>
              <span v-if="avail.closesSoon" class="warning-text">
                Closes soon.
              </span>
              <span v-else class="success-text">Open.</span>
              Closes
              {{ `${avail.closeTime[0]}:${avail.closeTime[1]}. ` }}
            </template>
            <a href="#">Check our business hours</a>
          </span>
          <SvgIcon
            name="info"
            class="mini l-spaced faint-text-more"
            v-tooltip.unblocking
            data-tooltip="Note that the given detail is generated using your device time relative to the Business location timezone."
          />
        </p>
        <div class="flexbox guttered">
          <button class="primary button">Contact Us</button>
          <button class="button">View Location</button>
        </div>
      </div>
      <div class="posts-main">
        <div class="heading">Updates from us</div>
        <FeedCard
          v-for="i in Math.min(6, data.feeds.length)"
          :set="(feed = data.feeds[i - 1])"
          :details="feed"
        />
        <NuxtLink
          :to="{ name: 'biz-feeds', params: { id: $route.params.id } }"
          class="fluid button"
          style="max-width: 500px"
        >
          View more posts
        </NuxtLink>
      </div>
    </section>
    <section class="text-center" style="padding: 6.25rem">
      <h3>Thanks for visiting our website.</h3>
      <p class="container-text huge semibold">
        We hope you got what you’re looking for. You can make inquiries if not.
        We hope to see you soon.
      </p>
      <button class="secondary button" style="margin-top: 1rem">
        Start Chat
      </button>
    </section>
  </main>
</template>

<style lang="scss">
.show-onpinned {
  opacity: 0;
  transition: all 100ms ease;
}

.pinned .show-onpinned {
  opacity: 1;
}

.posts-sec {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto;
  gap: 1rem;
  margin-top: 5rem;

  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr;

    & > .page-aside {
      display: none;
    }
  }
}

.posts-main {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.page-aside {
  align-self: start;
  display: flex;
  border-radius: var(--sm-radius);
  border: 1px solid var(--outline);
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  max-width: 100%;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
}

.ft-badge {
  filter: saturate(0.1);
  text-align: center;
  color: transparent;

  &:hover {
    filter: saturate(1);
    color: inherit;
  }
}

.footer-main {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(4, 1fr);

  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 550px) {
    grid-template-columns: 1fr;
  }
}
</style>
