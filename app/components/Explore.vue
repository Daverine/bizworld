<template>
  <div class="dialog">
    <header class="flex gap-3 px-6 py-4">
      <div class="flex-1 truncate font-bold">Explore your caterory of interest here.</div>
      <button class="circular flat button as-text exit-modal" style="margin-left: auto">
        <SvgIcon name="close" />
      </button>
    </header>
    <div class="px-6 py-4">
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
      <div class="flex flex-wrap gap-2">
        <button class="compact button text-sm">
          <SvgIcon name="restaurant" class="lead text-sm" /> Vehicles
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="local_bar" class="lead text-sm" /> Property
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="local_parking" class="lead text-sm" /> Mobile Phones & Tablets
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="hotel" class="lead text-sm" /> Electronics
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="shopping_cart" class="lead text-sm" /> Home Funiture & Appliances
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="local_gas_station" class="lead text-sm" /> Health & Beauty
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="local_pharmacy" class="lead text-sm" /> Fashion
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="local_hospital" class="lead text-sm" /> Arts
        </button>
        <button class="compact button text-sm">
          <SvgIcon name="local_hospital" class="lead text-sm" /> Food & Beverage
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
