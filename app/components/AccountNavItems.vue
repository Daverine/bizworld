<template>
  <NuxtLink
    to="/account/profile"
    class="item exit-sidepanel"
    exact-active-class="active"
  >
    <Icon name="material-symbols:person-outline-rounded" class="lead" /> Your
    profile
  </NuxtLink>
  <NuxtLink
    to="/account/reviews"
    class="item exit-sidepanel"
    exact-active-class="active"
  >
    <Icon name="material-symbols:reviews-outline-rounded" class="lead" /> Your
    reviews
  </NuxtLink>
  <NuxtLink
    to="/account/saved"
    class="item exit-sidepanel"
    exact-active-class="active"
  >
    <Icon name="material-symbols:bookmarks-outline-rounded" class="lead" />
    Saved cards
  </NuxtLink>
  <NuxtLink
    to="/account/followed"
    class="item exit-sidepanel"
    exact-active-class="active"
  >
    <Icon name="material-symbols:groups-outline-rounded" class="lead" />
    Followed providers
  </NuxtLink>
</template>
