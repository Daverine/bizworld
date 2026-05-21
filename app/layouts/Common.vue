<script setup>
import Details from "./Details.vue";
</script>

<template>
  <Details>
    <div v-if="!$route.path.split('/').includes('manage')" class="border-b py-2">
      <div class="maxo-md:hidden max-w-340 auto-contain flex gap-2">
        <button class="compact transparent button font-bold open-modal" data-target="explore-modal">
          <Icon name="material-symbols:manage-search-rounded" class="lead" />
          Explore:
        </button>
        <LimbIScroller :options="{ scrollChildren: '.chip' }" class="flex-1 py-1">
          <div class="scroll-items gap-2">
            <button class="chip">
              <Icon name="material-symbols:restaurant-rounded" class="lead" />
              Restaurants
            </button>
            <button class="chip">
              <Icon name="material-symbols:local-bar-outline-rounded" class="lead" />
              Bars
            </button>
            <button class="chip">
              <Icon name="material-symbols:local-parking-rounded" class="lead" />
              Parks
            </button>
            <button class="chip">
              <Icon name="material-symbols:hotel-outline-rounded" class="lead" />
              Hotels
            </button>
            <button class="chip">
              <Icon name="material-symbols:shopping-cart-outline-rounded" class="lead" />
              Groceries
            </button>
            <button class="chip">
              <Icon name="material-symbols:local-gas-station-outline-rounded" class="lead" />
              Filling stations
            </button>
            <button class="chip">
              <Icon name="material-symbols:local-pharmacy-outline-rounded" class="lead" />
              Pharmacies
            </button>
            <button class="chip">
              <Icon name="material-symbols:local-hospital-outline-rounded" class="lead" />
              Hospitals and clinics
            </button>
            <button class="chip">
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
    <div class="flex flex-1 max-w-360 auto-contain gap-6">
      <PageNav />
      <slot />
      <SidePanelAds />
    </div>
  </Details>
</template>
