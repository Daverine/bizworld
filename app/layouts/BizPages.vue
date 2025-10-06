<script setup>
import Details from './Details.vue';
const [DefinePageNav, PageNav] = createReusableTemplate();
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
</script>

<template>
  <DefinePageNav>
    <NuxtLink
      :to="{ name: 'biz-home', params: { id: $route.params.id } }"
      exact-active-class="active"
      class="item exit-sidepanel"
      >Home</NuxtLink
    >
    <NuxtLink
      :to="{ name: 'biz-feeds', params: { id: $route.params.id } }"
      exact-active-class="active"
      class="item exit-sidepanel"
      >Feeds</NuxtLink
    >
    <NuxtLink
      :to="{ name: 'biz-products', params: { id: $route.params.id } }"
      exact-active-class="active"
      class="item exit-sidepanel"
      >Products</NuxtLink
    >
    <NuxtLink
      :to="{ name: 'biz-services', params: { id: $route.params.id } }"
      exact-active-class="active"
      class="item exit-sidepanel"
      >Services</NuxtLink
    >
    <NuxtLink
      :to="{ name: 'biz-about', params: { id: $route.params.id } }"
      exact-active-class="active"
      class="item exit-sidepanel"
      >About Us</NuxtLink
    >
  </DefinePageNav>

  <Details>
    <div v-if="isReady" class="grid-layout">
      <header
        class="flexbox"
        style="padding-top: 0.5rem; align-items: center; gap: 1rem"
      >
        <div
          class="flex-none"
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
            v-tooltip:aria.unblocking
            aria-label="Verified"
            style="position: absolute; bottom: 0.5em; right: 0.5em"
          />
        </div>
        <div class="flexible">
          <h5 class="0-margined">{{ data.details.bizName }}</h5>
          <div class="faint-text">{{ data.details.mainCategory }}</div>
        </div>
        <button
          class="flex-none flat button auto-l-margined md-and-down-hidden"
        >
          <Icon
            name="material-symbols:add-to-queue-outline-rounded"
            class="lead"
          />
          Follow
        </button>
      </header>
      <div
        v-scrollPin="{ top: 63, notifyStuckState: true }"
        class="scrollpin fluid z-level-1 r-aligned basic menu surface-v2-bg"
        style="height: 3.5rem; margin-bottom: 0.5rem"
      >
        <div class="container items">
          <NuxtLink
            :to="{ name: 'biz-home', params: { id: $route.params.id } }"
            class="xhover item as-icon visible-on-stuck"
          >
            <NuxtImg
              preset="logo"
              :src="data.details.logo"
              alt="site logo"
              class="logo-lg site-logo"
            />
          </NuxtLink>
          <div class="r-aligned items">
            <div class="items md-and-down-hidden">
              <PageNav />
            </div>
            <div
              class="item open-sidepanel md-and-up-hidden"
              data-target="bizsidepanel"
            >
              <SvgIcon name="menu" class="lead" />
              Menu
              <LimbSidePanel class="right" id="bizsidepanel">
                <div class="padded panel">
                  <div class="vertical menu">
                    <div class="centered item exit-sidepanel">
                      <SvgIcon name="arrow_back" />
                    </div>
                    <NuxtLink
                      :to="{
                        name: 'biz-home',
                        params: { id: $route.params.id },
                      }"
                      class="xhover centered item exit-sidepanel"
                    >
                      <NuxtImg
                        preset="logo"
                        :src="data.details.logo"
                        alt="site logo"
                        class="logo-lg site-logo"
                      />
                    </NuxtLink>
                    <PageNav />
                  </div>
                  <hr />
                  <footer style="margin-top: auto">
                    <Shareables name="color_scheme" />
                    <Shareables name="copyright" />
                  </footer>
                </div>
              </LimbSidePanel>
            </div>
            <div class="xhover 0-l-padding item">
              <LimbDropdown
                :options="{ directionPriority: { x: 'left' } }"
                v-tooltip:aria.unblocking
                aria-label="More options"
                class="transparent button"
              >
                <SvgIcon name="more_horiz" />
                <div class="drop menu">
                  <div class="item">
                    <SvgIcon name="follow" class="lead" /> Follow page
                  </div>
                  <div class="item">
                    <SvgIcon name="bookmark_add" class="lead" /> Save card
                  </div>
                  <div class="item">
                    <SvgIcon name="share" class="lead" /> Share
                  </div>
                  <div class="item">
                    <SvgIcon name="report" class="lead" /> Report page
                  </div>
                </div>
              </LimbDropdown>
            </div>
          </div>
        </div>
      </div>
      <slot />
      <footer
        class="fluid grid-layout surface-v3-bg"
        style="padding: 4rem 0rem 0rem"
      >
        <div class="footer-main">
          <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
            <div
              class="flex-none"
              style="position: relative; width: max-content; line-height: 0"
            >
              <NuxtImg
                preset="logo"
                class="logo image"
                style="width: 4rem; height: 4rem; object-fit: contain"
                :src="data.details.logo"
                alt="Business Logo"
              />
              <SvgIcon
                v-if="data.details.verified"
                name="verified_sp"
                v-tooltip:aria.unblocking
                aria-label="Verified"
                class="mini"
                style="position: absolute; bottom: 0.5em; right: 0.5em"
              />
            </div>
            <h6 class="dm-title">{{ data.details.bizName }}</h6>
            <!-- <div class="faint-text">{{ data.details.mainCategory }}</div> -->
            <div class="flexible">
              {{ data.details.description }}
              <a :href="`${data.details.bizUrl}/about_us`" target="_blank"
                >Learn more.</a
              >
            </div>
            <div>
              <div class="bold" style="margin-bottom: 0.75rem">
                Earned barges on Bizword
              </div>
              <div class="flexbox guttered flex-wrap">
                <div class="flex-none ft-badge">
                  <Badges name="verified" style="font-size: 3rem" />
                  <div class="mini semibold">Verified</div>
                </div>
                <div class="flex-none ft-badge">
                  <Badges name="escrow" style="font-size: 3rem" />
                  <div class="mini semibold">Trade Assurance</div>
                </div>
                <div class="flex-none ft-badge">
                  <Badges name="5years" style="font-size: 3rem" />
                  <div class="mini semibold">Sustainable</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
            <div class="bold">Menus</div>
            <div class="text vertical menu">
              <PageNav />
            </div>
          </div>
          <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
            <div class="bold">Contact Us</div>
            <div>
              <p>Start chat with us directly from here.</p>
              <button class="secondary button">Start Chat</button>
            </div>
            <div>
              <div class="bold">Telephone</div>
              <p>{{ data.details.contacts.tel }}</p>
            </div>
            <div>
              <div class="bold">Our physical location</div>
              <p>
                {{
                  `${data.details.location.address}, ${data.details.location.city}, ${data.details.location.state}.`
                }}
              </p>
            </div>
          </div>
          <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
            <div class="bold nowrap-text">Social media</div>
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
          <div class="items container">
            <div class="item xhover">Powered by Bizworld</div>
          </div>
        </div>
      </footer>
    </div>
  </Details>
</template>

<style></style>
