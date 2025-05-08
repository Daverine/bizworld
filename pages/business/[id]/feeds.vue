<script setup>
definePageMeta({ layout: 'biz-pages', name: 'biz-feeds' });
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
</script>

<template>
  <main v-if="isReady" class="posts-main">
    <div class="heading">Updates from us</div>
    <FeedCard v-for="feed in data.feeds" :details="feed" />
  </main>
</template>

<style>
.posts-main {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 3rem;
}
</style>
