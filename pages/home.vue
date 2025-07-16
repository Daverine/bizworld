<script setup>
definePageMeta({ auth: true });
const props = defineProps(['name']);
const userStore = useUserStore();
const searchStore = useSearchStore();
const feedStore = useFeedStore();
const main = useTemplateRef('main');

function scrollToView() {
  main.value.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  });
}

onMounted(() => feedStore.getUpdate());
</script>
<template>
  <header class="hm-header">
    <!-- Homepage unique menu -->
    <div class="menu">
      <div
        class="container-lg items"
        style="border-radius: var(--default-radius)"
      >
        <div
          class="item as-icon open-sidepanel"
          v-tooltip.unblocking
          data-tooltip="Menu"
          data-target="msidepanel"
        >
          <Icon name="material-symbols:menu-rounded" />
        </div>
        <div class="xhover item as-icon">
          <NuxtImg
            preset="logo"
            src="/images/logo_sqr.png"
            alt="site logo"
            class="logo-lg site-logo"
          />
        </div>
        <div class="items r-aligned">
          <div class="items md-and-down-hidden">
            <div class="item exit-modal open-modal" data-target="create-biz">Have a shop online</div>
            <Dropdown class="item">
              Support
              <Icon
                name="material-symbols:expand-more-rounded"
                class="trailing"
              />
              <div class="drop menu">
                <Shareables name="supports" />
              </div>
            </Dropdown>
          </div>
          <Shareables name="do_more_item" />
          <div
            class="as-icon item"
            v-tooltip.unblocking
            data-tooltip="Notifications"
          >
            <Icon name="material-symbols:notifications-outline-rounded" />
          </div>
          <Dropdown
            data-browse-dm="dm1_profile"
            :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
            v-tooltip.unblocking
            data-tooltip="Your profile"
            class="xhover browse as-icon item"
          >
            <NuxtImg
              preset="logo"
              :src="userStore.userData.profileImg"
              alt="profile"
              class="fully-rounded logo"
            />
          </Dropdown>
          <Shareables id="dm1_profile" name="profile_menu" />
        </div>
      </div>
    </div>
    <form class="hm-searchbox" @submit.prevent="searchStore.triggerSearch()">
      <div style="margin-bottom: 2rem">
        <h2 class="call-text">Let us do business</h2>
        <p class="huge">Search for business names, products, and services.</p>
      </div>
      <div>
        <label class="input big fluid">
          <Icon name="material-symbols:search-rounded" class="xhover" />
          <input
            v-model="searchStore.searchBox"
            type="search"
            autocomplete="off"
            id="searchinput"
            ref="inputbox"
            placeholder="Your search here."
            class="subject"
            autofocus
          />
          <button
            type="button"
            v-tooltip.unblocking
            data-tooltip="Scan QR"
            class="icon open-modal"
            data-target="scanqr-modal"
          >
            <Icon name="material-symbols:qr-code-scanner-rounded" />
          </button>
        </label>
        <div style="margin-top: 0.5rem">
          Search in: <span class="bold">Nigeria</span>.
          <div class="compact small icon button">
            <Icon name="material-symbols:more-outline-rounded" />
          </div>
        </div>
        <div
          class="flexbox flexible-items lg-guttered"
          style="margin: 2rem auto 0px; max-width: 19rem"
        >
          <button class="button">SEARCH</button>
          <button
            type="button"
            class="button open-modal"
            data-target="explore-modal"
          >
            EXPLORE
          </button>
        </div>
      </div>
    </form>
    <div
      role="button"
      class="text-center"
      style="margin-bottom: 2rem"
      @click="
        $event.currentTarget.parentElement.nextElementSibling.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      "
    >
      <Icon
        name="material-symbols:keyboard-double-arrow-down-rounded"
        style="font-size: 2em"
      />
      <div style="font-size: 1.2em; line-height: 1; font-weight: 500">
        FEEDS
      </div>
    </div>
  </header>
  <div class="menu sticky z-level-2 mp-menu">
    <Shareables name="main_menu" />
  </div>
  <section id="firstSec" class="csection flexbox">
    <Shareables name="page_nav" />
    <main class="flexible container-md" style="padding: 1rem 1rem">
      <IScroller
        v-scrollPin="{ top: 65 }"
        class="pin-top-blend z-level-3"
        style="margin-bottom: 1rem"
      >
        <div class="rail fillable menu scroll-items">
          <div class="items" style="margin: 0px auto">
            <div class="active item">For you</div>
            <div class="item">Following</div>
          </div>
        </div>
        <div class="l-scroll">
          <Icon name="material-symbols:keyboard-double-arrow-left" />
        </div>
        <div class="r-scroll">
          <Icon name="material-symbols:keyboard-double-arrow-right" />
        </div>
      </IScroller>
      <section
        style="display: flex; flex-direction: column; align-items: center"
      >
        <h6 class="text-center" style="margin-bottom: 2rem">
          Update from page you're following (Feeds)
        </h6>
        <FeedCard
          v-for="feed in feedStore.feeds"
          :details="feed"
        />
        <div class="divider">
          <button class="button">
            Load more
            <Icon name="material-symbols:expand-more-rounded" />
          </button>
        </div>
      </section>
    </main>
    <Shareables name="ad_menu" />
  </section>
</template>
<style scoped>
.mp-menu {
  top: 0px;
  border-bottom: 1px solid var(--outline);
  background-color: var(--surface);
}
.call-text {
  margin-top: 0px;
  margin-bottom: 10px;
  font-family: cursive;
  font-size: 3.25rem;
  line-height: 1.125em;
}

.hm-header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.hm-searchbox {
  width: 100%;
  text-align: center;
  max-width: 600px;
  padding: 0px 1rem;
}
</style>
