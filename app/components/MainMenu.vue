<script lang="ts" setup>
const searchStore = useSearchStore();
const { loggedIn, user } = useAuth();
</script>
<template>
  <div
    class="auto-contain items max-w-breakout m-auto"
    style="border-radius: var(--default-radius)"
  >
    <button
      class="item as-icon open-sidepanel"
      v-tooltip:aria.unblocking
      aria-label="Menu"
      data-target="msidepanel"
    >
      <Icon name="material-symbols:menu-rounded" />
    </button>
    <NuxtLink :to="loggedIn ? '/home' : '/'" class="xhover item as-icon">
      <NuxtImg preset="logo" src="/images/logo_sqr.png" alt="site logo" class="logo-lg site-logo" />
    </NuxtLink>
    <form class="xhover adaptable item max-md:hidden" @submit.prevent="searchStore.triggerSearch()">
      <label class="input auto-contain transparent bg-surface-v4 max-w-[65ch]">
        <Icon name="material-symbols:search-rounded" class="xhover" />
        <input
          v-model="searchStore.searchBox"
          type="search"
          autocomplete="off"
          placeholder="Your search here."
          class="subject"
        />
        <button
          type="button"
          v-tooltip:aria.unblocking
          aria-label="Scan Business QR"
          class="icon open-modal"
          data-target="scanqr-modal"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" />
        </button>
        <button
          type="button"
          v-tooltip:aria.unblocking
          aria-label="Configure search"
          class="icon open-modal"
          data-target="search-modal"
        >
          <Icon name="material-symbols:settings-applications-outline-rounded" />
        </button>
      </label>
    </form>
    <div class="items r-aligned">
      <div
        v-tooltip:aria.unblocking
        aria-label="Search"
        class="open-modal as-icon item md:hidden"
        data-target="search-modal"
      >
        <Icon name="material-symbols:search-rounded" />
      </div>
      <!-- <Shareables name="do_more_item" /> -->
      <template v-if="loggedIn">
        <LimbDropdown
          :options="{ directionPriority: { x: 'center' } }"
          class="as-icon item ac-viewbox-ref"
          v-tooltip:aria.unblocking
          aria-label="Notifications"
        >
          <i class="icon ac-viewbox">
            <Icon name="material-symbols:notifications-outline-rounded" />
            <Icon name="material-symbols:notifications-rounded" />
          </i>
        </LimbDropdown>
        <Shareables name="notifications_menu" />
        <LimbDropdown
          :options="{ directionPriority: { x: 'left' } }"
          v-tooltip:aria.unblocking
          aria-label="Your profile"
          class="xhover as-icon item"
        >
          <NuxtImg
            preset="logo"
            :src="user?.image || '/images/profilepic.jpg'"
            alt="profile"
            class="logo rounded-full"
          />
        </LimbDropdown>
        <Shareables name="profile_menu" />
      </template>
      <template v-else>
        <div class="items max-lg:hidden">
          <div class="item open-modal" data-target="login-modal">Log in</div>
          <div class="xhover item as-icon pl-0">
            <button class="primary button open-modal" data-target="register-modal">Sign Up</button>
          </div>
        </div>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left' } }"
          v-tooltip:aria.unblocking
          aria-label="Account"
          class="item as-icon lg:hidden"
        >
          <Icon name="material-symbols:person-add-outline-rounded" />
          <span class="max-lg:hidden">Account</span>
        </LimbDropdown>
        <div class="drop menu">
          <div class="item open-modal" data-target="login-modal">Log in</div>
          <div class="item open-modal" data-target="register-modal">Sign Up</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style></style>
