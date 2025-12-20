<script setup>
import Common from '~/layouts/Common.vue';
definePageMeta({ auth: true });
const userStore = useUserStore();
const feedStore = useFeedStore();

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
          v-tooltip:aria.unblocking
          aria-label="Menu"
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
          <div class="items max-md:hidden">
            <NuxtLink :to="{ name: 'new-shop' }" class="item exit-modal">
              Have a shop online
            </NuxtLink>
            <LimbDropdown class="item">
              Support
              <Icon
                name="material-symbols:expand-more-rounded"
                class="trailing"
              />
              <div class="drop menu">
                <Shareables name="supports" />
              </div>
            </LimbDropdown>
          </div>
          <Shareables name="do_more_item" />
          <div
            class="as-icon item"
            v-tooltip:aria.unblocking
            aria-label="Notifications"
          >
            <Icon name="material-symbols:notifications-outline-rounded" />
          </div>
          <LimbDropdown
            data-browse-dm="dm1_profile"
            :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
            v-tooltip:aria.unblocking
            aria-label="Your profile"
            class="xhover browse as-icon item"
          >
            <NuxtImg
              preset="logo"
              :src="userStore.userData.profileImg"
              alt="profile"
              class="rounded-full logo"
            />
          </LimbDropdown>
          <Shareables id="dm1_profile" name="profile_menu" />
        </div>
      </div>
    </div>
    <SearchBoxMain />
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
  <Common>
    <main class="flex-1 container-md" style="padding: 1rem 1rem">
      <LimbIScroller
        v-scrollPin="{ top: 63 }"
        class="pin-top-blend z-level-1"
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
      </LimbIScroller>
      <section
        style="display: flex; flex-direction: column; align-items: center"
      >
        <FeedCard v-for="feed in feedStore.feeds" :details="feed" />
        <div class="divider">
          <button class="button">
            Load more
            <Icon name="material-symbols:expand-more-rounded" />
          </button>
        </div>
      </section>
    </main>
  </Common>
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
