<script setup>
import Common from "~/layouts/Common.vue";
definePageMeta({ name: "home", auth: { only: "user" } });
const feedStore = useFeedStore();
onMounted(() => feedStore.getUpdate());
</script>
<template>
  <header class="hm-header">
    <HomeHeader />
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
      <Icon name="material-symbols:keyboard-double-arrow-down-rounded" style="font-size: 2em" />
      <div style="font-size: 1.2em; line-height: 1; font-weight: 500">FEEDS</div>
    </div>
  </header>
  <Common>
    <main class="max-w-180 auto-contain" style="padding: 1rem 1rem">
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
      <section style="display: flex; flex-direction: column; align-items: center">
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
  background-color: var(--color-surface);
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
