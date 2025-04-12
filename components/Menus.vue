<script setup>
const mainStore = useMainStore(),
  searchStore = useSearchStore(),
  userStore = useUserStore(),
  route = useRoute();
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <SidePanel class="left" id="msidepanel">
    <div class="panel padded">
      <div class="vertical transparent menu">
        <div class="items" style="border-radius: var(--default-radius)">
          <div class="centered item exit-sidepanel">
            <Icon name="material-symbols:arrow-back-rounded" />
          </div>
          <router-link to="/" class="xhover centered item exit-sidepanel">
            <img
              src="/images/logo.png"
              alt="site logo"
              class="logo-sm site-logo"
            />
          </router-link>
        </div>
        <ManageShareables
          v-if="route.matched.some((el) => el.path === '/manage')"
          name="nav_menu"
        />
        <Shareables v-else name="nav_menu" />
      </div>
      <hr />
      <footer style="margin-top: auto">
        <Shareables name="color_scheme" />
        <Shareables name="copyright" />
      </footer>
    </div>
  </SidePanel>
  <div v-if="!route.meta.noFab" class="fab-group respect-lock">
    <button
      class="open-modal fab radius-lg secondary button"
      data-target="cart-modal"
    >
      <Icon name="material-symbols:shopping-cart-outline" />
    </button>
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

<style lang="scss">
#qaction {
  pointer-events: none;
  opacity: 0;
  box-shadow: var(--z-depth-3);

  &.now-visible {
    pointer-events: all;
    opacity: 1;
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
