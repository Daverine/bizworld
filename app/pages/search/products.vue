<script lang="ts" setup>
definePageMeta({
  name: "search-in-products",
  layout: "details",
});
const route = useRoute();
const searchStore = useSearchStore();
const { data: result } = useFetch("/api/search/products", {
  query: { q: computed(() => route.query.q) },
});
searchStore.searchIn = "products";
searchStore.searchBox = route.query.q as string;
</script>

<template>
  <Title>BizWorld | Search: {{ $route.query.q }}</Title>
  <main>
    <div
      v-scrollPin="{ top: 64, bottom: 114, followScroll: true }"
      class="pin-top-blend z-level-1 bg-surface"
    >
      <div class="border-b py-2">
        <div class="auto-contain max-w-breakout flex gap-2">
          <button
            class="compact transparent button open-modal font-bold"
            data-target="explore-modal"
          >
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
      <div class="rail menu mt-2 text-sm">
        <div class="items auto-contain max-w-breakout">
          <div class="compact item xhover">
            Result in:
            <LimbDropdown v-model="searchStore.searchIn" type="selection" class="inline-flex">
              <Icon
                name="material-symbols:category-search-outline-rounded"
                class="text-primary mr-2"
              />
            </LimbDropdown>
            <div class="drop menu">
              <NuxtLink
                v-for="category in searchStore.categories"
                :data-value="category"
                :to="{ name: `search-in-${category}`, query: { q: $route.query.q } }"
                class="item capitalize"
              >
                {{ category }}
              </NuxtLink>
            </div>
          </div>
          <div class="xhover item r-aligned">
            View as:
            <Icon name="material-symbols:grid-view-outline-rounded" />
            <Icon name="material-symbols:view-list-outline-rounded" />
          </div>
        </div>
      </div>
    </div>
    <div class="product-cards-grid auto-contain max-w-breakout pt-8">
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
      <PageProduct v-for="item in result" :details="item" />
    </div>
    <div class="divider">
      <button class="button">
        More results
        <Icon name="material-symbols:expand-more-rounded" class="trailing" />
      </button>
    </div>
  </main>
</template>
<style>
.product-cards-grid {
  display: grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr));
  gap: 1rem;
  padding-bottom: 3rem;
  width: 100%;
}
</style>
