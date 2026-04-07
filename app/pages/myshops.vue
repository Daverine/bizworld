<script lang="ts" setup>
definePageMeta({ layout: 'common', auth: { only: 'user' } });
const businesses = ref<{
  id: string;
  slug: string;
  business_name: string;
  category: string;
  followers: number;
  unread_messages: number;
}[]>([
  {
    id: '3900dkke',
    slug: '@emmadavetechservices',
    business_name: 'Emmadave Computer Technology Services',
    category: 'Computer repair services',
    followers: 3,
    unread_messages: 3,
  }
]);
</script>
<template>
  <main class="flex-1 col" id="feed">
    <div
      v-for="business in businesses"
      class="mybiz-card card"
      style="
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
        padding: 10px;
      "
    >
      <div style="display: flex; gap: 0.5em">
        <div
          class="rounded"
          style="width: 90px; height: 90px; background-color: pink"
        ></div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            width: calc(100% - 90px - 0.5em);
          "
        >
          <div class="font-bold h6">{{ business.business_name }}</div>
          <div class="faint-text">
            <span>{{ business.slug }}</span> |
            <span>{{ business.category }}</span>
          </div>
          <div class="flex flex-wrap font-semibold" style="gap: 1em">
            <span
              ><Icon
                name="material-symbols:comment-outline-rounded"
                class="small"
              />
              {{ business.unread_messages }} Messages</span
            >
            <span
              ><Icon
                name="material-symbols:groups-outline-rounded"
                class="small"
              />
              {{ business.followers }} Followers</span
            >
          </div>
        </div>
      </div>
      <div class="w-full flex flex-wrap" style="gap: 0.5em">
        <NuxtLink :to="`/manage/${business.id}/overview`" class="compact flex-1 button"
          >Manage page</NuxtLink
        >
        <button class="compact flex-1 button">Create post</button>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
          class="as-icon flex-1 compact button"
        >
          <Icon name="material-symbols:more-horiz" />
        </LimbDropdown>
        <div class="drop menu">
          <div class="item">
            <Icon
              name="material-symbols:campaign-outline-rounded"
              class="lead"
            />
            Promote
          </div>
          <div class="item">
            <Icon name="material-symbols:share-outline" class="lead" /> Share
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
