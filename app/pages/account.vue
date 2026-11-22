<script lang="ts" setup>
definePageMeta({ layout: "common", auth: { only: "user" } });
const { user } = useAuth();
</script>
<template>
  <div class="auto-contain mb-8 max-w-180">
    <header class="mt-2 flex gap-3">
      <div class="flex-none">
        <NuxtImg
          preset="logo"
          :src="user?.image || '/images/profilepic.jpg'"
          class="profile-pic image rounded-full"
          style="width: 5rem; height: 5rem"
          alt="Your profile Picture"
        />
      </div>
      <div class="flex-1">
        <h5>
          {{ `${user?.first_name} ${user?.last_name}` }}
        </h5>
        <div class="font-semibold">
          <span> 0 Following </span>
          |
          <span>0 Bookmarks </span>
        </div>
      </div>
    </header>
    <LimbIScroller v-scrollPin="{ top: 63 }" class="z-level-1 mt-4">
      <div class="l-scroll">
        <SvgIcon name="double_arrow_left" class="text-xs" />
      </div>
      <div class="r-scroll">
        <SvgIcon name="double_arrow_right" class="text-xs" />
      </div>
      <div class="rail menu scroll-items w-full">
        <div class="items" style="margin: 0px auto">
          <NuxtLink to="/account/profile" class="item" exact-active-class="active"
            >Profile</NuxtLink
          >
          <NuxtLink to="/account/reviews" class="item" exact-active-class="active"
            >Reviews</NuxtLink
          >
          <NuxtLink to="/account/saved" class="item" exact-active-class="active"
            >Saved cards</NuxtLink
          >
          <NuxtLink to="/account/followed" class="item" exact-active-class="active"
            >Followed providers</NuxtLink
          >
          <NuxtLink to="/account/settings" class="item" exact-active-class="active"
            >Settings</NuxtLink
          >
        </div>
      </div>
    </LimbIScroller>
    <NuxtPage />
  </div>
</template>
