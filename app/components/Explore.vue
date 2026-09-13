<script setup lang="ts">
const { data: productCategories } = await useFetch("/api/product-categories", {
  key: "product-categories",
});
</script>
<template>
  <LimbModal id="explore-modal">
    <div class="dialog flex flex-col">
      <header class="flex gap-3 px-6 py-4">
        <div class="flex-1 truncate font-bold">Explore your caterory of interest here.</div>
        <button class="circular flat button as-text exit-modal" style="margin-left: auto">
          <SvgIcon name="close" />
        </button>
      </header>
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div class="text-center">
          <button class="button"><SvgIcon name="trending_up" class="lead" /> Trending</button>
        </div>
        <div class="heading">Business categories</div>
        <div class="flex flex-wrap gap-2">
          <button class="compact button text-sm">
            <SvgIcon name="restaurant" class="lead text-sm" /> Restaurants
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="local_bar" class="lead text-sm" /> Bars
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="local_parking" class="lead text-sm" /> Parks
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="hotel" class="lead text-sm" /> Hotels
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="shopping_cart" class="lead text-sm" /> Groceries
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="local_gas_station" class="lead text-sm" /> Filling stations
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="local_pharmacy" class="lead text-sm" /> Pharmacies
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="local_hospital" class="lead text-sm" /> Hospitals and clinics
          </button>
          <button class="compact button text-sm">
            <SvgIcon name="more_horiz" class="lead text-sm" /> More
          </button>
        </div>
        <div class="heading">Product categories</div>
        <div class="vertical menu">
          <LimbToggler v-slot="{ expanded, toggle }">
            <template
              v-for="cat in productCategories?.filter((category) => category.parent_id === null)"
              :key="cat.id"
            >
              <button
                @click="toggle(cat.id)"
                class="item ac-viewbox-ref"
                :class="{ active: expanded === cat.id }"
              >
                <SvgIcon name="shopping_cart" class="lead text-sm" /> {{ cat.name }}
                <i
                  v-if="productCategories?.find((sub_cat) => sub_cat.parent_id === cat.id)"
                  class="trailing icon ac-viewbox"
                >
                  <Icon name="material-symbols:chevron-left-rounded" />
                  <Icon name="material-symbols:keyboard-arrow-down-rounded" />
                </i>
              </button>
              <div
                v-if="productCategories?.find((sub_cat) => sub_cat.parent_id === cat.id)"
                class="can-collapse flex flex-wrap justify-center gap-2"
                :class="{ active: expanded === cat.id }"
              >
                <button
                  v-for="sub_cat in productCategories.filter(
                    (sub_cat) => sub_cat.parent_id === cat.id,
                  )"
                  class="compact button"
                >
                  <SvgIcon name="shopping_cart" class="lead text-sm" /> {{ sub_cat.name }}
                </button>
              </div>
            </template>
          </LimbToggler>
        </div>
        <div class="heading">Can't find what you're looking for here?</div>
        <div>
          <p class="text-center">
            Search instead. Click on the search button below to enter your search query.
          </p>
          <div class="text-center">
            <button class="button open-modal exit-modal" data-target="search-modal">
              <SvgIcon name="search" class="lead" /> Search
            </button>
          </div>
        </div>
      </div>
    </div>
  </LimbModal>
</template>
