<script setup>
defineOptions({
  name: 'rc-manage-shareables',
});
const searchStore = useSearchStore();
const props = defineProps(['name']);
</script>
<template>
  
  <template v-if="name === 'page_nav'">
    <aside id="navmenu" class="flex-none col sidemenu md-and-down-hidden">
      <div
        v-scrollPin="{ top: 84, bottom: 16 }"
        class="vertical transparent menu"
      >
        <NavMenuManagement />
      </div>
    </aside>
  </template>
  <header
    v-else-if="name === 'common_header'"
    id="main-header"
    style="
      border-bottom: 1px solid var(--outline);
      background-color: var(--surface);
    "
  >
    <div class="menu" style="height: 64px">
      <Shareables name="main_menu" />
    </div>
    <div
      class="container md-and-up-hidden"
      style="padding-top: 0.5rem; padding-bottom: 0.5rem"
    >
      <form class="fluid" @submit.prevent="searchStore.triggerSearch()">
        <label
          class="input fluid transparent"
          style="background-color: var(--surface-v4) !important"
        >
          <Icon name="material-symbols:search" class="xhover" />
          <input
            v-model="searchStore.searchBox"
            type="search"
            autocomplete="off"
            id="searchinput"
            placeholder="Your search here."
            class="subject"
            ref="inputbox"
            autofocus
          />
          <button
            type="button"
            v-tooltip.unblocking
            data-tooltip="Scan Business QR"
            class="icon open-modal"
            data-target="scanqr-modal"
          >
            <Icon name="material-symbols:qr-code-scanner-rounded" />
          </button>
          <button
            type="button"
            v-tooltip.unblocking
            data-tooltip="Search location is set to Nigeria. Click to change it."
            class="icon open-modal"
            data-target=""
          >
            <Icon name="material-symbols:location-on-outline-rounded" />
          </button>
        </label>
      </form>
    </div>
  </header>
</template>
