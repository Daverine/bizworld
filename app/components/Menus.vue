<script setup>
const mainStore = useMainStore();
const { items: cartItems } = storeToRefs(useCartStore());
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <NuxtLink
      v-if="!$route.meta.noCart"
      to="/cart"
      class="fab radius-lg secondary button"
    >
      <Icon name="material-symbols:shopping-cart-outline" />
      <div v-if="cartItems.length" class="floating badge">
        {{ cartItems.length }}
      </div>
    </NuxtLink>
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
