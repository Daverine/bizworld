<script lang="ts" setup>
definePageMeta({ layout: "details" });
const [DefinePageNav, PageNav] = createReusableTemplate();
const route = useRoute();
const { data: bizData } = await useFetch("/api/business/query", {
  query: { slug: route.params.slug },
});
</script>

<template>
  <div class="layout-grid">
    <template v-if="bizData">
      <DefinePageNav>
        <NuxtLink
          :to="{ name: 'biz-home', params: { slug: $route.params.slug } }"
          exact-active-class="active"
          class="item exit-sidepanel"
          >Home</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'biz-feeds', params: { slug: $route.params.slug } }"
          exact-active-class="active"
          class="item exit-sidepanel"
          >Feeds</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'biz-products', params: { slug: $route.params.slug } }"
          exact-active-class="active"
          class="item exit-sidepanel"
          >Products</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'biz-services', params: { slug: $route.params.slug } }"
          exact-active-class="active"
          class="item exit-sidepanel"
          >Services</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'biz-about', params: { slug: $route.params.slug } }"
          exact-active-class="active"
          class="item exit-sidepanel"
          >About Us</NuxtLink
        >
      </DefinePageNav>

      <header class="flex" style="padding-top: 0.5rem; align-items: center; gap: 1rem">
        <div class="flex-none" style="position: relative; width: max-content; line-height: 0">
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
            class="absolute right-2 bottom-2"
          />
        </div>
        <div class="flex-1">
          <h5 class="m-0">{{ bizData.business_name }}</h5>
          <div class="opacity-65">{{ bizData.category }}</div>
        </div>
        <button class="flat button ml-auto flex-none max-md:hidden">
          <Icon name="material-symbols:add-to-queue-outline-rounded" class="lead" />
          Follow
        </button>
      </header>
      <div
        v-scrollPin="{ top: 63, notifyStuckState: true }"
        class="scrollpin fluid z-level-1 r-aligned basic menu bg-surface-v2 mb-2 h-14 [&:not(.is-stuck)_.visible-on-stuck]:hidden"
      >
        <div class="auto-contain items max-w-6xl">
          <NuxtLink
            :to="{ name: 'biz-home', params: { slug: $route.params.slug } }"
            class="xhover item as-icon visible-on-stuck"
          >
            <NuxtImg
              preset="logo"
              :src="bizData.logo || '/images/bizpic.jpg'"
              alt="site logo"
              class="logo-lg site-logo"
            />
          </NuxtLink>
          <div class="r-aligned items">
            <div class="items max-md:hidden">
              <PageNav />
            </div>
            <div class="item open-sidepanel md:hidden" data-target="bizsidepanel">
              <SvgIcon name="menu" class="lead" />
              Menu
              <LimbSidePanel class="right" id="bizsidepanel">
                <div class="panel p-4">
                  <div class="vertical menu">
                    <div class="centered item exit-sidepanel">
                      <SvgIcon name="arrow_back" />
                    </div>
                    <NuxtLink
                      :to="{
                        name: 'biz-home',
                        params: { slug: $route.params.slug },
                      }"
                      class="xhover centered item exit-sidepanel"
                    >
                      <NuxtImg
                        preset="logo"
                        :src="bizData.logo || '/images/bizpic.jpg'"
                        alt="site logo"
                        class="logo-lg site-logo"
                      />
                    </NuxtLink>
                    <PageNav />
                  </div>
                  <hr />
                  <footer class="mt-auto">
                    <Shareables name="color_scheme" />
                    <Shareables name="copyright" />
                  </footer>
                </div>
              </LimbSidePanel>
            </div>
            <div class="xhover item pl-0">
              <LimbDropdown
                :options="{ directionPriority: { x: 'left' } }"
                v-tooltip:aria.unblocking
                aria-label="More options"
                class="transparent button"
              >
                <SvgIcon name="more_horiz" />
              </LimbDropdown>
              <div class="drop menu">
                <div class="item"><SvgIcon name="follow" class="lead" /> Follow page</div>
                <div class="item"><SvgIcon name="bookmark_add" class="lead" /> Save card</div>
                <div class="item"><SvgIcon name="share" class="lead" /> Share</div>
                <div class="item"><SvgIcon name="report" class="lead" /> Report page</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NuxtPage :bizData />
      <footer class="fluid layout-grid bg-surface-v3 pt-16">
        <div class="footer-main mb-4">
          <div class="flex flex-col gap-2">
            <div class="relative w-max flex-none leading-0">
              <NuxtImg
                preset="logo"
                class="size-16 object-contain"
                :src="bizData.logo || '/images/bizpic.jpg'"
                alt="Business logo"
              />
              <SvgIcon
                v-if="bizData.badges?.includes('verified')"
                name="verified_sp"
                v-tooltip:aria.unblocking
                aria-label="Verified"
                class="absolute right-2 bottom-2 text-xs"
              />
            </div>
            <div>
              <h6 class="mb-0">{{ bizData.business_name }}</h6>
              <div class="opacity-65">{{ bizData.category }}</div>
            </div>
            <p>
              {{ bizData.description }}
              <NuxtLink
                :to="{ name: 'biz-about', params: { slug: $route.params.slug } }"
                exact-active-class="active"
                class="item exit-sidepanel"
                target="_blank"
                >Learn more.</NuxtLink
              >
            </p>
            <div v-if="bizData.badges?.length">
              <div class="mb-3 font-bold">Earned barges on Bizword</div>
              <div class="flex flex-wrap gap-3">
                <div class="ft-badge flex-none">
                  <Badges name="verified" class="text-[3rem]" />
                  <div class="text-xs font-semibold">Verified</div>
                </div>
                <div class="ft-badge flex-none">
                  <Badges name="escrow" class="text-[3rem]" />
                  <div class="text-xs font-semibold">Trade Assurance</div>
                </div>
                <div class="ft-badge flex-none">
                  <Badges name="5years" class="text-[3rem]" />
                  <div class="text-xs font-semibold">Sustainable</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="font-bold">Menus</div>
            <div class="text vertical menu">
              <PageNav />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="font-bold">Contact Us</div>
            <div>
              <p>Start chat with us directly from here.</p>
              <button class="secondary button">Start Chat</button>
            </div>
            <div>
              <div class="font-bold">Telephone</div>
              <p>{{ bizData.telephone }}</p>
            </div>
            <div v-if="bizData.physical_location">
              <div class="font-bold">Our physical location</div>
              <p>
                {{ `${bizData.address}, ${bizData.city}, ${bizData.state}.` }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="font-bold whitespace-nowrap">Social media</div>
            <div class="vertical text menu">
              <a class="item" href="#">Facebook</a>
              <a class="item" href="#">Instagram</a>
              <a class="item" href="#">Twitter</a>
              <a class="item" href="#">LinkedIn</a>
              <a class="item" href="#">Youtube</a>
            </div>
          </div>
        </div>
        <div class="fluid menu">
          <div class="items auto-contain max-w-6xl">
            <div class="item xhover">Powered by Bizworld</div>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>

<style>
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

.ft-badge {
  filter: saturate(0.1);
  text-align: center;
  color: transparent;

  &:hover {
    filter: saturate(1);
    color: inherit;
  }
}
</style>
