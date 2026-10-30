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
  <main class="auto-contain max-w-180">
    <div
      v-if="businesses?.length"
      v-for="business in businesses"
      class="mybiz-card card flex w-full flex-col gap-3 p-2.5"
    >
      <div class="flex items-center gap-4">
        <NuxtImg
          preset="logo"
          :src="business.logo || '/images/bizpic.jpg'"
          class="image w-22.5 flex-none rounded"
        />
        <div class="flex flex-1 flex-col" style="justify-content: space-evenly">
          <div class="text-h6 font-bold">{{ business.business_name }}</div>
          <div class="flex flex-wrap gap-x-2 opacity-65">
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
      <div class="flex w-full flex-wrap" style="gap: 0.5em">
        <NuxtLink :to="`/manage/${business.slug}/overview`" class="compact button flex-1"
          >Manage page</NuxtLink
        >
        <button class="compact button flex-1">Create post</button>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
          class="as-icon compact button flex-1"
        >
          <Icon name="material-symbols:more-horiz" />
        </LimbDropdown>
        <div class="dropdown menu">
          <div class="item">
            <Icon name="material-symbols:campaign-outline-rounded" class="lead" />
            Promote
          </div>
          <div class="item"><Icon name="material-symbols:share-outline" class="lead" /> Share</div>
        </div>
      </div>
    </div>
    <div v-else class="my-auto flex flex-col items-center gap-4 p-8">
      <Icon name="material-symbols:storefront-outline-rounded" class="text-6xl opacity-65" />
      <div class="text-center">
        <div class="font-bold">You don't have any shops yet</div>
        <p class="opacity-65">Create your first shop to get started.</p>
      </div>
      <NuxtLink to="/new-shop" class="button">Create your shop</NuxtLink>
    </div>
  </main>
</template>
