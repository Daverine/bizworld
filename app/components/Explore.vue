<template>
  <div class="dialog self-scroll">
    <div class="header flex gap-3">
      <div class="font-bold truncate flex-1">Explore your caterory of interest here.</div>
      <button class="circular flat button as-text exit-modal" style="margin-left: auto">
        <SvgIcon name="close" />
      </button>
    </div>
    <div class="content">
      <div class="text-center">
        <button class="button"><SvgIcon name="trending_up" class="lead" /> Trending</button>
      </div>
      <div class="heading">Business categories</div>
      <div class="flex flex-wrap gap-2">
        <button class="chip"><SvgIcon name="restaurant" class="text-sm lead" /> Restaurants</button>
        <button class="chip"><SvgIcon name="local_bar" class="text-sm lead" /> Bars</button>
        <button class="chip"><SvgIcon name="local_parking" class="text-sm lead" /> Parks</button>
        <button class="chip"><SvgIcon name="hotel" class="text-sm lead" /> Hotels</button>
        <button class="chip">
          <SvgIcon name="shopping_cart" class="text-sm lead" /> Groceries
        </button>
        <button class="chip">
          <SvgIcon name="local_gas_station" class="text-sm lead" /> Filling stations
        </button>
        <button class="chip">
          <SvgIcon name="local_pharmacy" class="text-sm lead" /> Pharmacies
        </button>
        <button class="chip">
          <SvgIcon name="local_hospital" class="text-sm lead" /> Hospitals and clinics
        </button>
        <button class="chip"><SvgIcon name="more_horiz" class="text-sm lead" /> More</button>
      </div>
      <div class="heading">Product categories</div>
      <div class="flex flex-wrap gap-2">
        <button class="chip"><SvgIcon name="restaurant" class="text-sm lead" /> Vehicles</button>
        <button class="chip"><SvgIcon name="local_bar" class="text-sm lead" /> Property</button>
        <button class="chip">
          <SvgIcon name="local_parking" class="text-sm lead" /> Mobile Phones & Tablets
        </button>
        <button class="chip"><SvgIcon name="hotel" class="text-sm lead" /> Electronics</button>
        <button class="chip">
          <SvgIcon name="shopping_cart" class="text-sm lead" /> Home Funiture & Appliances
        </button>
        <button class="chip">
          <SvgIcon name="local_gas_station" class="text-sm lead" /> Health & Beauty
        </button>
        <button class="chip"><SvgIcon name="local_pharmacy" class="text-sm lead" /> Fashion</button>
        <button class="chip"><SvgIcon name="local_hospital" class="text-sm lead" /> Arts</button>
        <button class="chip">
          <SvgIcon name="local_hospital" class="text-sm lead" /> Food & Beverage
        </button>
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
</template>

<style scoped>
.chip {
  margin-bottom: 0.25em;
}
</style>
