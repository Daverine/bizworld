<script lang="ts" setup>
definePageMeta({ layout: "biz-pages", name: "biz-home" });
const route = useRoute();
const bizData = inject("bizData") as Ref<bizData>;
const { data: products } = useFetch("/api/business/products", {
  query: { slug: route.params.slug },
});
const { today, isClosed, willOpenToday, closesSoon, nextOpenDay } = useAvailability(
  bizData.value.hours,
);
const data = useBizStore();
</script>

<template>
  <main class="fluid layout-grid">
    <NuxtImg
      format="webp"
      sizes="1280px"
      class="open-lightbox aspect-6/2 object-cover"
      data-target="lightbox1"
      :data-lightbox="bizData.cover_photo"
      :src="bizData.cover_photo || '/images/ads.jpg'"
      alt="Business page cover picture"
    />
    <div class="flex gap-3 flex-wrap items-center p-4">
      <Icon name="material-symbols:domain-rounded" class="flex-none" />
      <div class="flex-1 min-w-[65%]">
        {{ bizData.description }}
      </div>
      <button class="flex-none ml-auto primary compact button">Contact Us</button>
    </div>
    <div class="fluid layout-grid bg-surface-v2 p-4">
      <div class="flex gap-3 flex-wrap items-center px-4">
        <Icon name="material-symbols:today-outline-rounded" class="flex-none" />
        <div class="flex-1 min-w-[65%]">
          <span v-if="today?.avail === 'always'">Available throughout today.</span>
          <span v-else-if="today?.avail === 'appointment'"
            >Available by appointment only today.</span
          >
          <span v-else-if="today?.avail === 'nil'">Not available at all today.</span>
          <span v-else>
            <template v-if="isClosed">
              <template v-if="willOpenToday"
                ><span class="error-text">Currently closed.</span> Opens today by
                {{ today?.hours.opening }}
              </template>
              <template v-else>
                <span class="error-text">Have closed for today.</span>
                <template v-if="nextOpenDay">
                  Available next on {{ nextOpenDay?.day }}
                  <template v-if="nextOpenDay.avail === 'appointment'"
                    >by appointment only</template
                  >
                  <template v-else-if="nextOpenDay.avail === 'always'">throughout the day</template>
                  <template v-else
                    >at {{ nextOpenDay?.hours.opening }} -
                    {{ nextOpenDay?.hours.closing }}</template
                  >.
                </template>
              </template>
            </template>
            <template v-else>
              <span v-if="closesSoon" class="warning-text"> Closes soon. </span>
              <span v-else class="success-text">Available.</span>
              Closes {{ today?.hours.closing }}.
            </template>
            <Icon
              name="material-symbols:info-outline-rounded"
              class="text-xs ml-2 opacity-65"
              v-tooltip:aria.unblocking
              aria-label="Note that the given detail is generated using your device time relative to the Business location timezone."
            /> </span
          >&nbsp;
          <NuxtLink
            :to="{
              name: 'biz-about',
              params: { slug: $route.params.slug },
              hash: '#biz-hours',
            }"
            >Check our business hours.</NuxtLink
          >
        </div>
        <NuxtLink
          :to="{
            name: 'biz-about',
            params: { slug: $route.params.slug },
            hash: '#biz-hours',
          }"
          class="flex-none ml-auto compact button"
        >
          Schedule Visit
        </NuxtLink>
      </div>
    </div>
    <section v-if="products">
      <div class="heading p-4">New and Trending products</div>
      <LimbIScroller class="flex justify-center">
        <div class="scroll-items gap-3">
          <template v-for="i in Math.min(6, products.length)" :key="i">
            <PageProduct :details="products[i - 1]!" class="flex-none" />
          </template>
          <NuxtLink
            :to="{ name: 'biz-products', params: { slug: $route.params.slug } }"
            v-if="products.length > 6"
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
    <section v-if="data.projects">
      <div class="heading p-4">Our projects listing</div>
      <LimbIScroller class="flex justify-center">
        <div class="scroll-items gap-3">
          <template v-for="i in Math.min(6, data.projects.length)" :key="i">
            <PageService :details="data.projects[i - 1]!" class="flex-none" />
          </template>
          <NuxtLink
            :to="{ name: 'biz-services', params: { slug: $route.params.slug } }"
            v-if="data.projects.length > 6"
            class="button flat as-app self-stretch w-50"
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
        class="page-aside text-center"
      >
        <div class="flex-none relative w-max leading-0">
          <NuxtImg
            preset="logo"
            class="size-20 object-contain"
            :src="bizData.logo || '/images/bizpic.jpg'"
            alt="Business Logo"
          />
          <SvgIcon
            v-if="bizData.badges?.includes('verified')"
            name="verified_sp"
            v-tooltip:aria.unblocking
            aria-label="Verified"
            class="absolute bottom-2 right-2"
          />
        </div>
        <div>
          <h6 class="mb-0">{{ bizData.business_name }}</h6>
          <div class="opacity-65">{{ bizData.category }}</div>
        </div>
        <div>
          <span v-if="today?.avail === 'always'">Available throughout today.</span>
          <span v-else-if="today?.avail === 'appointment'"
            >Available by appointment only today.</span
          >
          <span v-else-if="today?.avail === 'nil'">Not available at all today.</span>
          <span v-else>
            <template v-if="isClosed">
              <template v-if="willOpenToday"
                ><span class="error-text">Currently closed.</span> Opens today by
                {{ today?.hours.opening }}
              </template>
              <template v-else>
                <span class="error-text">Have closed for today.</span>
                <template v-if="nextOpenDay">
                  Available next on {{ nextOpenDay?.day }}
                  <template v-if="nextOpenDay.avail === 'appointment'"
                    >by appointment only</template
                  >
                  <template v-else-if="nextOpenDay.avail === 'always'">throughout the day</template>
                  <template v-else
                    >at {{ nextOpenDay?.hours.opening }} -
                    {{ nextOpenDay?.hours.closing }}</template
                  >.
                </template>
              </template>
            </template>
            <template v-else>
              <span v-if="closesSoon" class="warning-text"> Closes soon. </span>
              <span v-else class="success-text">Available.</span>
              Closes {{ today?.hours.closing }}.
            </template>
            <Icon
              name="material-symbols:info-outline-rounded"
              class="text-xs ml-2 opacity-65"
              v-tooltip:aria.unblocking
              aria-label="Note that the given detail is generated using your device time relative to the Business location timezone."
            /> </span
          >&nbsp;
          <NuxtLink
            :to="{
              name: 'biz-about',
              params: { slug: $route.params.slug },
              hash: '#biz-hours',
            }"
            >Check our business hours.</NuxtLink
          >
        </div>
        <div class="flex gap-3">
          <button class="primary button">Contact Us</button>
          <button class="button">View Location</button>
        </div>
      </div>
      <div class="posts-main">
        <div class="heading">Updates from us</div>
        <template v-for="i in Math.min(6, data.feeds.length)" :key="i">
          <FeedCard :details="data.feeds[i - 1]" />
        </template>
        <NuxtLink
          :to="{ name: 'biz-feeds', params: { slug: $route.params.slug } }"
          class="w-full button max-w-125"
        >
          View more posts
        </NuxtLink>
      </div>
    </section>
    <section class="auto-contain text-center p-25">
      <h3>Thanks for visiting our website.</h3>
      <p class="max-w-[65ch] auto-contain text-xl font-semibold">
        We hope you got what you’re looking for. You can make inquiries if not. We hope to see you
        soon.
      </p>
      <button class="secondary button mt-4">Start Chat</button>
    </section>
  </main>
</template>

<style scoped>
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
  flex-direction: column;
  gap: 0.5rem;
  border-radius: var(--radius-block);
  border: 1px solid var(--outline);
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  max-width: 100%;
  padding: 1rem;
  align-items: center;
}
</style>
