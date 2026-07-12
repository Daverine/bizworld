<script setup>
import Details from "./Details.vue";
</script>

<template>
  <Details>
    <div v-if="!$route.path.split('/').includes('manage')" class="border-b py-2">
      <div class="maxo-md:hidden auto-contain flex max-w-340 gap-2">
        <button class="compact transparent button open-modal font-bold" data-target="explore-modal">
          <Icon name="material-symbols:manage-search-rounded" class="lead" />
          Explore:
        </button>
        <LimbIScroller :options="{ scrollChildren: '.button' }" class="flex-1 py-1">
          <div class="scroll-items gap-2">
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:restaurant-rounded" class="lead" />
              Restaurants
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:local-bar-outline-rounded" class="lead" />
              Bars
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:local-parking-rounded" class="lead" />
              Parks
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:hotel-outline-rounded" class="lead" />
              Hotels
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:shopping-cart-outline-rounded" class="lead" />
              Groceries
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:local-gas-station-outline-rounded" class="lead" />
              Filling stations
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:local-pharmacy-outline-rounded" class="lead" />
              Pharmacies
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:local-hospital-outline-rounded" class="lead" />
              Hospitals and clinics
            </button>
            <button class="compact button rounded-full text-sm">
              <Icon name="material-symbols:more-horiz" class="lead" /> More
            </button>
          </div>
          <div class="l-scroll">
            <Icon name="material-symbols:keyboard-double-arrow-left" />
          </div>
          <div class="r-scroll">
            <Icon name="material-symbols:keyboard-double-arrow-right" />
          </div>
        </LimbIScroller>
      </div>
    </div>
    <div class="auto-contain flex max-w-360 flex-1 gap-6">
      <PageNav />
      <slot />
      <SidePanelAds />
    </div>
  </Details>
</template>
