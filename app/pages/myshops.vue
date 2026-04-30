<script lang="ts" setup>
definePageMeta({ layout: "common", auth: { only: "user" } });
const { user } = useAuth();
const { data: businesses } = await useFetch("/api/user/businesses", {
  method: "post",
  query: {
    id: user.value?.id,
  },
});
</script>
<template>
  <main class="flex-1 col" id="feed">
    <div v-for="business in businesses" class="mybiz-card card flex flex-col w-full gap-3 p-2.5">
      <div class="flex gap-4 items-center">
        <NuxtImg
          preset="logo"
          :src="business.logo || '/images/bizpic.jpg'"
          class="flex-none rounded image w-22.5"
        />
        <div class="flex-1 flex flex-col" style="justify-content: space-evenly">
          <div class="font-bold h6">{{ business.business_name }}</div>
          <div class="flex flex-wrap faint-text gap-x-2">
            <NuxtLink
              :to="{ name: 'biz-home', params: { slug: business.slug } }"
              class="truncate"
              >{{ business.slug }}</NuxtLink
            >
            |
            <span class="truncate">{{ business.category }}</span>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-wrap" style="gap: 0.5em">
        <NuxtLink :to="`/manage/${business.slug}/overview`" class="compact flex-1 button"
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
            <Icon name="material-symbols:campaign-outline-rounded" class="lead" />
            Promote
          </div>
          <div class="item"><Icon name="material-symbols:share-outline" class="lead" /> Share</div>
        </div>
      </div>
    </div>
  </main>
</template>
