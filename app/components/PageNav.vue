<template>
  <aside class="sidemenu max-[800px]:hidden flex-none border-r">
    <div v-scrollPin="{ top: 84, bottom: 16 }" class="vertical transparent menu">
      <NavMenuManagement v-if="$route.path.split('/').includes('manage')" />
      <NavMenu v-else />
    </div>
  </aside>
</template>
