<template>
  <aside id="navmenu" class="flex-none col sidemenu">
    <div
      v-scrollPin="{ top: 84, bottom: 16 }"
      class="vertical transparent menu"
    >
      <NavMenuManagement
        v-if="$route.path.split('/').includes('manage')"
      />
      <NavMenu v-else />
    </div>
  </aside>
</template>
