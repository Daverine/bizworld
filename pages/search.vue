<script setup>
definePageMeta({ layout: 'common' });
const searchStore = useSearchStore();
const route = useRoute();

// watch(() => route.query.q, () => document.title = `BizWorld | Search: ${route.query.q}`, { immediate: true });
onMounted(() => {
  if (!searchStore.searchBox) {
    searchStore.searchBox = route.query.q;
    searchStore.triggerSearch();
  }
});
</script>

<template>
  <Title>BizWorld | Search: {{ route.query.q }}</Title>
  <main class="flexible container-md" style="padding: 1rem 1.5rem">
    <IScroller
      v-scrollPin="{ top: 65 }"
      class="pin-top-blend z-level-3"
      style="margin-bottom: 1rem"
    >
      <div class="rail small menu scroll-items">
        <div class="compact item xhover">
          Search in:
          <Dropdown class="selection iflexbox">
            <Icon
              name="material-symbols:category-search-outline-rounded"
              class="primary-text r-spaced"
            />
            <div class="drop menu">
              <div class="active item">All categories</div>
              <div class="item">Businesses</div>
              <div class="item">Products</div>
              <div class="item">Projects</div>
            </div>
          </Dropdown>
          <div>
            <Icon
              name="material-symbols:location-on-outline-rounded"
              class="primary-text r-spaced"
            />
            Ogun, Nigeria
          </div>
        </div>
        <div class="xhover item r-aligned">
          View as:
          <Icon name="material-symbols:grid-view-outline-rounded" />
          <Icon name="material-symbols:view-list-outline-rounded" />
        </div>
      </div>
      <div class="l-scroll">
        <Icon name="material-symbols:keyboard-double-arrow-left" />
      </div>
      <div class="r-scroll">
        <Icon name="material-symbols:keyboard-double-arrow-right" />
      </div>
    </IScroller>
    <ItemCard
      v-for="result in searchStore.searchResults"
      :details="result"
    />

    <div class="divider">
      <button class="button">
        More results
        <Icon name="material-symbols:expand-more-rounded" class="trailing" />
      </button>
    </div>
  </main>
</template>
