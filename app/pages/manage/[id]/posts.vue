<script setup>
definePageMeta({name: 'manage-biz-posts', layout: 'common', auth: true, });
const feedStore = useFeedStore();
onMounted(() => feedStore.getUpdate());
</script>
<template>
    <main class="flex-1 col" id="feed">
        <header class="sp-wrapper w-full z-level-1 p-h" style="margin-bottom: 1rem;">
            <div v-scrollPin="{ top: 63, independent: true }" class="surface-bg">
                <div class="w-full l-aligned">
                    <div class="p-h3 h3">Posts</div>
                    <hr class="mb-0" />
                </div>
            </div>
        </header>
        <section style="display: flex; flex-direction: column; align-items: center;">
            <FeedCard v-for="feed in feedStore.feeds" :details="feed" />
        </section>
    </main>

</template>