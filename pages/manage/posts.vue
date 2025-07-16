<script setup>
definePageMeta({layout: 'manage', auth: true, });
const feedStore = useFeedStore();
onMounted(() => feedStore.getUpdate());
</script>
<template>
    <main class="flexible col" id="feed">
        <header class="sp-wrapper fluid z-level-3 p-h" style="margin-bottom: 1rem;">
            <div v-scrollPin="{ top: 64, independent: true }" style="background-color: var(--surface);">
                <div class="fluid l-aligned">
                    <div class="p-h3 h3">Posts</div>
                    <hr class="0-b-margined" />
                </div>
            </div>
        </header>
        <section style="display: flex; flex-direction: column; align-items: center;">
            <FeedCard v-for="feed in feedStore.feeds" :details="feed" />
        </section>
    </main>

</template>