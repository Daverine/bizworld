<script lang="ts" setup>
const searchStore = useSearchStore();
</script>
<template>
  <form class="w-full max-w-[600px] px-4" @submit.prevent="searchStore.triggerSearch()">
    <div class="mb-4">
      <NuxtImg
        format="webp"
        sizes="900px"
        densities="1x"
        src="/images/logo_full.png"
        alt="site logo"
        class="site-logo w-full image mx-auto"
        style="max-width: 450px; background-color: rgba(128, 128, 128, 0.025)"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <div class="flex-none font-bold">Search in:</div>
        <div class="fillable pills menu compact flex-1">
          <label
            v-for="category in searchStore.categories"
            class="capitalize item"
            :class="{ active: searchStore.searchIn === category }"
          >
            {{ category }}
            <input
              v-model="searchStore.searchIn"
              type="radio"
              :value="category"
              class="hidden"
          /></label>
        </div>
      </div>
      <label class="input big w-full">
        <Icon name="material-symbols:search-rounded" class="xhover" />
        <input
          v-model="searchStore.searchBox"
          type="search"
          autocomplete="off"
          id="searchinput"
          placeholder="Your search here."
          class="subject"
          autofocus
        />
        <button
          type="button"
          v-tooltip:aria.unblocking
          aria-label="Scan QR"
          class="icon open-modal"
          data-target="scanqr-modal"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" />
        </button>
        <button
          type="button"
          v-tooltip:aria.unblocking
          aria-label="Configure search"
          class="icon open-modal"
          data-target="search-modal"
        >
          <Icon name="material-symbols:settings-applications-outline-rounded" />
        </button>
      </label>
      <div
        class="flex *:flex-1 gap-4 w-full max-w-[16rem]"
        style="margin: 1.5rem auto 0px;"
      >
        <button class="button">SEARCH</button>
        <button
          type="button"
          class="button open-modal"
          data-target="explore-modal"
        >
          EXPLORE
        </button>
      </div>
    </div>
  </form>
</template>
<style></style>
