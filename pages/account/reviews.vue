<script setup>
definePageMeta({ layout: 'account', auth: true, });
const userStore = useUserStore();
onMounted(() => userStore.getReviews());
</script>

<template>
    <h6 class="centered">Your reviews</h6>
    <ReviewCard v-for="(result, i) in userStore.yourReviews" :key="i" :details="result" />
</template>