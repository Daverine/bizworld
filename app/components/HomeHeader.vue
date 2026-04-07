<script lang="ts" setup>
const searchStore = useSearchStore();
const { loggedIn, user } = useAuth();
</script>
<template>
  <div class="menu h-16">
    <div class="container-lg items" style="border-radius: var(--default-radius)">
      <button class="item as-icon open-sidepanel" v-tooltip:aria.unblocking aria-label="Menu" data-target="msidepanel">
        <Icon name="material-symbols:menu-rounded" />
      </button>
      <div class="items max-md:hidden">
        <NuxtLink :to="{ name: 'new-shop' }" class="item">
          Open a shop online
        </NuxtLink>
      </div>
      <div class="items r-aligned">
        <div class="item open-modal" data-target="explore-modal">
          <Icon name="material-symbols:manage-search-rounded" class="lead" />
          Explore
        </div>
        <template v-if="loggedIn">
          <LimbDropdown :options="{ directionPriority: { x: 'center' } }" class="as-icon item ac-viewbox-ref"
            v-tooltip:aria.unblocking aria-label="Notifications">
            <i class="icon ac-viewbox">
              <Icon name="material-symbols:notifications-outline-rounded" />
              <Icon name="material-symbols:notifications-rounded" />
            </i>
          </LimbDropdown>
          <Shareables name="notifications_menu" />
          <LimbDropdown :options="{ directionPriority: { x: 'left' } }" v-tooltip:aria.unblocking
            aria-label="Your profile" class="xhover browse as-icon item">
            <NuxtImg preset="logo" :src="user?.image || '/images/profilepic.jpg'" alt="profile"
              class="rounded-full logo" />
          </LimbDropdown>
          <Shareables name="profile_menu" />
        </template>
        <template v-else>
          <LimbDropdown class="as-icon item sm:hidden">
            <Icon name="material-symbols:person-add-outline-rounded" class="lead" />
            Account
          </LimbDropdown>
          <div class="drop menu">
            <div class="item open-modal" data-target="login-modal">
              Log in
            </div>
            <div class="item open-modal" data-target="register-modal">
              Sign Up
            </div>
          </div>
          <div class="items max-sm:hidden">
            <div class="item open-modal" data-target="login-modal">
              Log in
            </div>
            <div class="xhover item px-0">
              <button class="primary button open-modal" data-target="register-modal">
                Sign Up
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <form class="w-full max-w-150 px-4" @submit.prevent="searchStore.triggerSearch()">
    <div class="mb-4">
      <NuxtImg format="webp" sizes="900px" densities="1x" src="/images/logo_full.png" alt="site logo"
        class="site-logo w-full image mx-auto" style="max-width: 450px; background-color: rgba(128, 128, 128, 0.025)" />
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <div class="flex-none font-bold">Search in:</div>
        <div class="fillable pills menu compact flex-1">
          <label v-for="category in searchStore.categories" class="capitalize item"
            :class="{ active: searchStore.searchIn === category }">
            {{ category }}
            <input v-model="searchStore.searchIn" type="radio" :value="category" class="hidden" /></label>
        </div>
      </div>
      <label class="input big w-full">
        <Icon name="material-symbols:search-rounded" class="xhover" />
        <input v-model="searchStore.searchBox" type="search" autocomplete="off" id="searchinput"
          placeholder="Your search here." class="subject" autofocus />
        <button type="button" v-tooltip:aria.unblocking aria-label="Scan QR" class="icon open-modal"
          data-target="scanqr-modal">
          <Icon name="material-symbols:qr-code-scanner-rounded" />
        </button>
        <button type="button" v-tooltip:aria.unblocking aria-label="Configure search" class="icon open-modal"
          data-target="search-modal">
          <Icon name="material-symbols:settings-applications-outline-rounded" />
        </button>
      </label>
      <div class="flex *:flex-1 gap-4 w-full max-w-[16rem]" style="margin: 1.5rem auto 0px;">
        <button class="button">SEARCH</button>
        <button type="button" class="button open-modal" data-target="explore-modal">
          EXPLORE
        </button>
      </div>
    </div>
  </form>
</template>
<style></style>
