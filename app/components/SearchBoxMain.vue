<script lang="ts" setup>
const searchStore = useSearchStore();
</script>
<template>
  <form class="hm-searchbox" @submit.prevent="searchStore.triggerSearch()">
    <div style="margin-bottom: 1rem">
      <NuxtImg
        format="webp"
        sizes="900px"
        densities="1x"
        src="/images/logo_full.png"
        alt="site logo"
        class="site-logo fluid image"
        style="max-width: 450px; background-color: rgba(128, 128, 128, 0.025)"
      />
    </div>
    <div class="flexbox flex-column sm-guttered">
      <div class="flexbox align-center guttered">
        <div class="flex-none bold">Search in:</div>
        <div class="fillable pills menu compact flexible">
          <label
            v-for="category in searchStore.categories"
            class="capitalized item"
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
      <label class="input big fluid">
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
        class="flexbox flexible-items lg-guttered"
        style="margin: 1.5rem auto 0px; max-width: 19rem"
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
