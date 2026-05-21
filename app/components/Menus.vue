<script setup>
const mainStore = useMainStore();
const { items: cartItems } = storeToRefs(useCartStore());
const { loggedIn } = useAuth();
const userStore = useUserStore();
function toTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <LimbSidePanel class="left" id="msidepanel">
    <div class="panel p-4">
      <div class="vertical transparent menu">
        <div class="items" style="border-radius: var(--default-radius)">
          <button class="centered item exit-sidepanel">
            <Icon name="material-symbols:arrow-back-rounded" />
          </button>
          <NuxtLink to="/" class="xhover centered item exit-sidepanel">
            <NuxtImg
              preset="logo"
              src="/images/logo.png"
              alt="site logo"
              class="logo-sm site-logo"
            />
          </NuxtLink>
        </div>
        <NavMenuManagement v-if="$route.path.split('/').includes('manage')" />
        <NavMenu v-else />
      </div>
      <hr />
      <footer style="margin-top: auto">
        <Shareables name="color_scheme" />
        <Shareables name="copyright" />
      </footer>
    </div>
  </LimbSidePanel>
  <div v-if="!$route.meta.noFab" class="fab-group respect-lock">
    <NuxtLink v-if="!$route.meta.noCart" to="/cart" class="fab radius-lg secondary button">
      <Icon name="material-symbols:shopping-cart-outline" />
      <div v-if="cartItems.length" class="floating badge">
        {{ cartItems.length }}
      </div>
    </NuxtLink>
    <LimbDropdown
      :options="{ directionPriority: { x: 'left', y: 'center' }, view: 'horizontal' }"
      v-tooltip:aria.unblocking
      aria-label="Do more"
      class="icon outlined fab secondary button"
    >
      <Icon name="material-symbols:apps" />
    </LimbDropdown>
    <div class="pointing drop menu">
      <div class="compact grid menu grid-cols-2 app-items">
        <div class="bar-item item open-modal exit-dd" data-target="explore-modal">
          <Icon name="material-symbols:manage-search-rounded" />
          <span class="text label">Explore</span>
        </div>
        <div class="bar-item item open-modal exit-dd" data-target="scanqr-modal">
          <Icon name="material-symbols:qr-code-scanner-rounded" />
          <span class="text label">Scan QR</span>
        </div>
        <div
          v-if="loggedIn && userStore.userData.manageBisiness"
          class="bar-item item open-modal exit-dd"
          data-target="create-post"
        >
          <Icon name="material-symbols:edit-square-outline-rounded" />
          <span class="text label">Post</span>
        </div>
      </div>
    </div>
    <button
      id="qaction"
      @click="toTop"
      class="outlined fab compact radius-lg secondary button"
      :class="{ 'now-visible': mainStore.showFixedMenu }"
    >
      <Icon name="material-symbols:vertical-align-top-rounded" />
    </button>
  </div>
</template>

<style>
#qaction {
  box-shadow: var(--z-depth-3);

  &:not(.now-visible) {
    pointer-events: none;
    opacity: 0;
  }
}

#msidepanel > .panel {
  display: flex;
  flex-flow: column nowrap;
}

#msidepanel > .panel > footer {
  margin-top: auto;
}
</style>
