<script setup>
const searchStore = useSearchStore();
</script>
<template>
  <div class="as-page">
    <header id="main-header"
      style="border-bottom: 1px solid var(--outline); background-color: var(--surface);">
      <div class="menu" style="height: 64px;">
        <Shareables name="main_menu" />
      </div>
      <div class="container md-and-up-hidden" style="padding-top: 0.5rem; padding-bottom: 0.5rem;">
        <form class="fluid" @submit.prevent="searchStore.triggerSearch()">
          <label class="input fluid transparent" style="background-color: var(--surface-v4) !important;">
            <SvgIcon name="search" class="xhover" />
            <input v-model="searchStore.searchBox" type="search" id="searchinput" placeholder="Your search here."
              class="subject" ref="inputbox" autofocus />
            <button type="button" v-tooltip.unblocking data-tooltip="Scan Business QR" class="icon open-modal"
              data-target="scanqr-modal">
              <SvgIcon name="qr_code_scanner" />
            </button>
            <button type="button" v-tooltip.unblocking
              data-tooltip="Search location is set to Nigeria. Click to change it." class="icon open-modal"
              data-target="">
              <SvgIcon name="location_on" />
            </button>
          </label>
        </form>
      </div>
    </header>
    <section id="firstSec" ref="main" class="csection">
      <slot />
    </section>
  </div>
</template>