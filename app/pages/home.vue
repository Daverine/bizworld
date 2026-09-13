<script setup>
import Common from "~/layouts/Common.vue";
definePageMeta({ name: "home", auth: { only: "user" } });
const feedStore = useFeedStore();
onMounted(() => feedStore.getUpdate());
</script>
<template>
  <header class="hm-header">
    <HomeHeader />
    <button
      class="mb-8 text-center"
      @click="
        $event.currentTarget.parentElement.nextElementSibling.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      "
    >
      <Icon name="material-symbols:keyboard-double-arrow-down-rounded" class="text-3xl" />
      <div class="text-xl font-bold">FEEDS</div>
    </button>
  </header>
  <Common>
    <main class="auto-contain max-w-180 p-4">
      <div class="rail fillable menu scroll-items pin-top-blend z-level-1 sticky top-16 mb-4">
        <div class="active item">For you</div>
        <div class="item">Following</div>
      </div>
      <section class="flex flex-col items-center">
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
