<script lang="ts" setup>
defineOptions({ name: "rc-shareables" });
defineProps(["name"]);

const searchStore = useSearchStore();
const { loggedIn, user, signOut } = useAuth();
const { store: colorMode } = useColorMode({
  modes: {
    light: "light-mode",
    dark: "dark-mode",
  },
});
</script>

<template>
  <div class="drop menu" v-if="name === 'profile_menu'">
    <div class="header centered xhover item flex-col">
      <NuxtImg
        preset="logo"
        :src="user?.image || '/images/profilepic.jpg'"
        class="rounded-full image"
      />
      <div>
        Welcome, <strong>{{ user?.name }}</strong>
      </div>
    </div>
    <AccountNavItems />
    <div class="item" @click="signOut()">
      <Icon name="material-symbols:logout-rounded" class="lead" /> Log out
    </div>
  </div>
  <template v-else-if="name === 'supports'">
    <div class="item">
      <Icon name="material-symbols:help-outline-rounded" class="lead" /> Help center
    </div>
    <div class="item">
      <Icon name="material-symbols:feedback-outline-rounded" class="lead" />
      Give feedback
    </div>
  </template>
  <div
    v-else-if="name === 'main_menu'"
    class="max-w-340 auto-contain items m-auto"
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
      <label class="input max-w-[65ch] auto-contain transparent bg-surface-v4">
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
        class="open-modal as-icon item md:hidden max-sm:hidden"
        data-target="search-modal"
      >
        <Icon name="material-symbols:search-rounded" />
      </div>
      <div class="item open-modal" data-target="explore-modal">
        <Icon name="material-symbols:manage-search-rounded" class="lead" />
        Explore
      </div>
      <!-- <rc-shareables name="do_more_item" /> -->
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
        <rc-shareables name="notifications_menu" />
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
            class="rounded-full logo"
          />
        </LimbDropdown>
        <rc-shareables name="profile_menu" />
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

  <footer v-else-if="name === 'common_footer'" style="align-self: flex-end">
    <rc-shareables name="copyright" />
  </footer>
  <div v-else-if="name === 'copyright'" class="transparent text wrappable menu justify-center">
    <div class="item">Terms of use</div>
    <div class="item">About us</div>
    <div class="item">Help</div>
    <div class="item">Settings</div>
    <div class="item">@ Copyright 2023</div>
    <div class="item">Emmadave Inc.</div>
  </div>
  <div v-else-if="name === 'color_scheme'" class="field" style="align-self: flex-end">
    <label>Color scheme settings</label>
    <div class="fillable compact pills menu w-full">
      <ClientOnly>
        <label class="as-icon item" :class="{ active: colorMode === 'light' }">
          <input v-model="colorMode" class="hidden" type="radio" value="light" />
          <Icon name="material-symbols:light-mode-outline-rounded" />
        </label>
        <label class="as-icon item" :class="{ active: colorMode === 'auto' }">
          <input v-model="colorMode" class="hidden" type="radio" value="auto" />
          <Icon name="material-symbols:desktop-mac-outline-rounded" />
        </label>
        <label class="as-icon item" :class="{ active: colorMode === 'dark' }">
          <input v-model="colorMode" class="hidden" type="radio" value="dark" />
          <Icon name="material-symbols:dark-mode-outline-rounded" />
        </label>
      </ClientOnly>
    </div>
  </div>
  <div
    v-else-if="name === 'notifications_menu'"
    class="pointing drop menu"
    style="width: 300px; height: calc(100vh - 84px); max-height: 600px"
  >
    <div class="flex flex-col p-4" style="height: 100%">
      <div class="flex-1 flex flex-col items-center justify-center gap-3">
        <Icon
          name="material-symbols-light:notifications-off-outline-rounded"
          style="font-size: 6rem; color: var(--on-surface-v2)"
        />
        <span class="text">You have no new notifications.</span>
      </div>
      <div class="transparent compact divider"></div>
      <div class="item">
        <button class="w-full button">View all</button>
      </div>
    </div>
  </div>
</template>
