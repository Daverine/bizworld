<script lang="ts" setup>
definePageMeta({
  name: "search-in-businesses",
  layout: "common",
});
const searchStore = useSearchStore();
const route = useRoute();
const { data: result } = useFetch(`/api/${searchStore.searchIn}` as "/api/:searchIn", {
  query: { q: searchStore.searchBox },
});

onBeforeRouteLeave(() => {
  searchStore.searchBox = "";
});
onMounted(() => {
  if (!searchStore.searchBox) {
    searchStore.searchBox = route.query.q as string;
    searchStore.searchIn = route.params.searchIn as string;
    searchStore.triggerSearch();
  }
});
function updateResult() {
  searchStore.searchIn = searchStore.resultIn;
  searchStore.triggerSearch();
}
</script>

<template>
  <Title>BizWorld | Search: {{ $route.query.q }}</Title>
  <main class="auto-contain max-w-180">
    <div class="pin-top-blend z-level-1 sticky top-16 mt-4">
      <div class="rail menu text-sm">
        <div class="compact item xhover">
          Result in:
          <LimbDropdown
            v-model="searchStore.resultIn"
            @change="updateResult"
            type="selection"
            class="inline-flex"
          >
            <Icon
              name="material-symbols:category-search-outline-rounded"
              class="text-primary mr-2"
            />
          </LimbDropdown>
          <div class="drop menu">
            <div
              v-for="category in searchStore.categories"
              :data-value="category"
              class="item capitalize"
            >
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </div>
          </div>
        </div>
        <div class="xhover item r-aligned">
          View as:
          <Icon name="material-symbols:grid-view-outline-rounded" />
          <Icon name="material-symbols:view-list-outline-rounded" />
        </div>
      </div>
    </div>
    <div v-if="searchStore.resultIn === 'businesses'" class="biz-cards-grid">
      <BusinessCard v-for="item in searchStore.searchResult" :details="item" />
    </div>
    <div v-else-if="searchStore.resultIn === 'products'" class="product-cards-grid">
      <ProductCard v-for="item in searchStore.searchResult" :details="item" />
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
.biz-cards-grid {
  display: grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  gap: 1rem;
  padding-bottom: 3rem;
  width: 100%;
}
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
