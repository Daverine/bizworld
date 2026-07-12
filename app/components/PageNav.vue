<template>
  <aside class="sidemenu max-[800px]:hidden flex-none border-r">
    <div v-scrollPin="{ top: 84, bottom: 16 }" class="vertical transparent menu">
      <template v-if="$route.path.split('/').includes('manage')">
        <NuxtLink to="/myshops" class="item exit-sidepanel">
          <Icon name="material-symbols:arrow-back-rounded" class="lead" />
          Go back to my shops
        </NuxtLink>
        <NavMenuManagement />
      </template>
      <NavMenu v-else />
    </div>
  </aside>
</template>
