<script setup>
definePageMeta({ layout: "account", auth: { only: "user" } });
const userStore = useUserStore();
onMounted(() => userStore.getReviews());
</script>

<template>
  <h6 class="text-center">Your reviews</h6>
  <ReviewCard v-for="result in userStore.yourReviews" :details="result" />
</template>
