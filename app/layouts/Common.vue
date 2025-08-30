<script setup>
const searchStore = useSearchStore();
</script>

<template>
  <div class="as-page">
    <div class="menu sticky z-level-3">
      <Shareables name="main_menu" />
    </div>
    <div
      v-if="!$route.path.split('/').includes('manage')"
      style="border-bottom: 1px solid var(--outline); padding: 0.5rem 0rem"
    >
      <div class="md-and-down-hidden container-lg flexbox" style="gap: 0.5em">
        <button
          class="compact transparent button bold open-modal"
          data-target="explore-modal"
        >
          <Icon name="material-symbols:manage-search-rounded" class="lead" />
          Explore:
        </button>
        <LimbIScroller class="flexible" style="padding: 0.25rem 0rem">
          <div class="scroll-items" style="gap: 0.5rem">
            <button class="chip">
              <Icon name="material-symbols:restaurant-rounded" class="lead" />
              Restaurants
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:local-bar-outline-rounded"
                class="lead"
              />
              Bars
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:local-parking-rounded"
                class="lead"
              />
              Parks
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:hotel-outline-rounded"
                class="lead"
              />
              Hotels
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:shopping-cart-outline-rounded"
                class="lead"
              />
              Groceries
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:local-gas-station-outline-rounded"
                class="lead"
              />
              Filling stations
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:local-pharmacy-outline-rounded"
                class="lead"
              />
              Pharmacies
            </button>
            <button class="chip">
              <Icon
                name="material-symbols:local-hospital-outline-rounded"
                class="lead"
              />
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

    <section class="csection flexbox">
      <PageNav />
      <slot />
      <Shareables
        v-if="!$route.path.split('/').includes('manage')"
        name="ad_menu"
      />
    </section>
  </div>
</template>

<style scoped>
.csection {
  position: relative;
  min-height: 70vh;
  max-width: 1440px;
  margin: 0rem auto;
}
.menu {
  top: 0px;
  border-bottom: 1px solid var(--outline);
  background-color: var(--surface);
}
</style>
