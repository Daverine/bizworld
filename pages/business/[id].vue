<script setup>
definePageMeta({ layout: 'details' });
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
const feedStore = useFeedStore();

onMounted(() => feedStore.getUpdate());
</script>

<template>
  <main v-if="isReady" class="grid-layout">
    <header
      class="flexbox dm-gap"
      style="padding-top: 0.5rem; align-items: center; gap: 1rem"
    >
      <div
        class="dm-logo flex-none"
        style="position: relative; width: max-content; line-height: 0"
      >
        <img
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
      <div class="dm-heading flexible">
        <h5 class="0-margined">{{ data.details.bizName }}</h5>
        <div class="faint-text">{{ data.details.mainCategory }}</div>
      </div>
      <button class="flex-none flat button auto-l-margined md-and-down-hidden">
        <SvgIcon name="follow" class="lead" /> Follow
      </button>
    </header>
    <div
      v-scrollPin="{ top: 64 }"
      class="fluid z-level-2 r-aligned menu surface-v2-bg"
      style="height: 3.5rem; margin-bottom: 0.5rem"
    >
      <div class="container items">
        <div class="xhover l-aligned item as-icon">
          <img
            :src="data.details.logo"
            alt="site logo"
            class="logo-lg site-logo"
          />
        </div>
        <div class="items md-and-down-hidden">
          <div class="item">Home</div>
          <div class="item">Feeds</div>
          <div class="item">Products</div>
          <div class="item">Services</div>
          <div class="item">About Us</div>
        </div>
        <div
          class="item open-sidepanel md-and-up-hidden"
          data-target="bizsidepanel"
        >
          <SvgIcon name="menu" class="lead" />
          Menu
          <SidePanel class="right" id="bizsidepanel">
            <div class="padded panel">
              <div class="vertical menu">
                <div class="centered item exit-sidepanel">
                  <SvgIcon name="arrow_back" />
                </div>
                <router-link to="/" class="xhover centered item exit-sidepanel">
                  <img
                    :src="data.details.logo"
                    alt="site logo"
                    class="logo-lg site-logo"
                  />
                </router-link>
                <div class="item">Home</div>
                <div class="item">Feeds</div>
                <div class="item">Products</div>
                <div class="item">Services</div>
                <div class="item">About Us</div>
              </div>
              <hr />
              <footer style="margin-top: auto">
                <Shareables name="color_scheme" />
                <Shareables name="copyright" />
              </footer>
            </div>
          </SidePanel>
        </div>
        <Dropdown
          :options="{ directionPriority: { x: 'left' } }"
          v-tooltip.unblocking
          data-tooltip="More options"
          class="item"
        >
          <SvgIcon name="more_horiz" />
          <div class="drop menu">
            <div class="item">
              <SvgIcon name="follow" class="lead" /> Follow page
            </div>
            <div class="item">
              <SvgIcon name="bookmark_add" class="lead" /> Save card
            </div>
            <div class="item"><SvgIcon name="share" class="lead" /> Share</div>
            <div class="item">
              <SvgIcon name="report" class="lead" /> Report page
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
    <div
      class="dm-display"
      style="position: relative; padding-top: calc(100% / 6 * 2)"
    >
      <img
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
                    ][0] !== -1
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
        <button class="flex-none auto-l-margined compact button">
          Shedule Visit
        </button>
      </div>
    </div>
    <section>
      <div class="heading" style="padding: 1rem">New and Trending products</div>
      <IScroller class="flexbox justify-center">
        <div class="scroll-items guttered">
          <PageProduct
            v-for="i in Math.min(6, data.products.length)"
            :set="(product = data.products[i - 1])"
            :details="product"
            class="flex-none"
          />
          <button
            v-if="data.products.length > 6"
            class="button flat as-app"
            style="
              width: 12.5rem;
              align-self: stretch;
            "
          >
            <Icon name="material-symbols:arrow-forward-rounded" />
            Show All
          </button>
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
      </IScroller>
    </section>
    <section>
      <div class="heading" style="padding: 1rem">Our projects listing</div>
      <IScroller class="flexbox justify-center">
        <div class="scroll-items guttered">
          <PageService
            v-for="i in Math.min(6, data.projects.length)"
            :set="(project = data.projects[i - 1])"
            :details="project"
            class="flex-none"
          />
          <button
            v-if="data.projects.length > 6"
            class="button flat as-app"
            style="
              width: 12.5rem;
              align-self: stretch;
            "
          >
            <Icon name="material-symbols:arrow-forward-rounded" />
            Show All
          </button>
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
      </IScroller>
    </section>
    <!-- <section>
      <div class="heading" style="padding: 1rem">Our services</div>
      <IScroller>
        <div class="scroll-items guttered">
          <PageService
            v-for="i in Math.min(5, data.services.length)"
            :set="(service = data.services[i - 1])"
            class="flex-none"
          />
        </div>
        <div class="l-scroll">
          <Icon name="material-symbols:keyboard-double-arrow-left" />
        </div>
        <div class="r-scroll">
          <Icon name="material-symbols:keyboard-double-arrow-right" />
        </div>
      </IScroller>
    </section> -->
    <section class="posts-sec">
      <div
        v-scrollPin="{
          top: 136,
          bottom: 16,
          sticky: true,
        }"
        class="page-aside biz-pin text-center"
      >
        <div
          class="dm-logo flex-none"
          style="position: relative; width: max-content; line-height: 0"
        >
          <img
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
                    ][0] !== -1
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
          v-for="(feed, i) in feedStore.feeds"
          :key="i"
          :details="feed"
        />
        <button class="fluid button" style="max-width: 500px">
          View more posts
        </button>
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
    <footer
      class="fluid grid-layout surface-v3-bg"
      style="padding: 4rem 0rem 0rem"
    >
      <div class="footer-main">
        <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
          <div
            class="dm-logo flex-none"
            style="position: relative; width: max-content; line-height: 0"
          >
            <img
              class="logo image"
              style="width: 4rem; height: 4rem; object-fit: contain"
              :src="data.details.logo"
              alt="Business Logo"
            />
            <SvgIcon
              v-if="data.details.verified"
              name="verified_sp"
              v-tooltip.unblocking
              data-tooltip="Verified"
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
            <NuxtLink class="item">Home</NuxtLink>
            <NuxtLink class="item">Feeds</NuxtLink>
            <NuxtLink class="item">Products</NuxtLink>
            <NuxtLink class="item">Services</NuxtLink>
            <NuxtLink class="item">About us</NuxtLink>
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
