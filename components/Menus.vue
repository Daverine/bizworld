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
            <SvgIcon name="arrow_back" />
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
  <div
    id="fmenu"
    class="menu z-level-3"
	:class="{ 'b-bordered': mainStore.showFixedMenu }"
  >
    <Shareables name="main_menu" :class="{'hidden': ['index','home'].includes(route.name) && !mainStore.showFixedMenu }" />
    <!-- Index menu -->
    <div
      class="container-lg items"
	  :class="{'hidden': route.name !== 'index' || mainStore.showFixedMenu }"
      style="border-radius: var(--default-radius)"
    >
      <div
        class="item as-icon open-sidepanel"
        v-tooltip.unblocking
        data-tooltip="Menu"
        data-target="msidepanel"
      >
        <SvgIcon name="menu" />
      </div>
      <div class="items md-and-down-hidden">
        <router-link to="/help#shop-online" class="item"
          >Have a shop online</router-link
        >
        <Dropdown class="item">
          Support
          <SvgIcon name="expand_more" class="trailing" />
          <div class="drop menu">
            <Shareables name="supports" />
          </div>
        </Dropdown>
      </div>
      <div class="items r-aligned">
        <Shareables name="do_more_item" />
        <template v-if="userStore.auth">
          <div
            class="as-icon item"
            v-tooltip.unblocking
            data-tooltip="Notifications"
          >
            <SvgIcon name="notifications" />
          </div>
          <Dropdown
            data-browse-dm="dm1_profile"
            :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
            v-tooltip.unblocking
            data-tooltip="Your profile"
            class="xhover browse as-icon item"
          >
            <img
              :src="userStore.userData.profileImg"
              alt="profile"
              class="fully-rounded logo"
            />
          </Dropdown>
          <Shareables id="dm1_profile" name="profile_menu" />
        </template>
        <template v-else>
          <div class="items sm-and-down-hidden">
            <div class="item open-modal" data-target="login-modal">Log in</div>
            <div class="xhover item 0-h-padding">
              <button
                class="primary button open-modal"
                data-target="register-modal"
              >
                Sign Up
              </button>
            </div>
          </div>
          <Dropdown class="as-icon item sm-and-up-hidden">
            <SvgIcon name="person_add" class="lead" /> Account
            <div class="drop menu">
              <div class="item open-modal" data-target="login-modal">
                Log in
              </div>
              <div class="xhover item">
                <button
                  class="primary button open-modal"
                  data-target="register-modal"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </Dropdown>
        </template>
      </div>
    </div>
    <!-- Homepage menu -->
    <div
      class="container-lg items auto-margined"
	  :class="{'hidden': route.name !== 'home' || mainStore.showFixedMenu }"
      style="border-radius: var(--default-radius)"
    >
      <div
        class="item as-icon open-sidepanel"
        v-tooltip.unblocking
        data-tooltip="Menu"
        data-target="msidepanel"
      >
        <SvgIcon name="menu" />
      </div>
      <div class="xhover item as-icon">
        <img
          src="/images/logo_sqr.png"
          alt="site logo"
          class="logo-lg site-logo"
        />
      </div>
      <div class="items r-aligned">
        <div class="items md-and-down-hidden">
          <router-link to="/help#shop-online" class="item"
            >Have a shop online</router-link
          >
          <Dropdown class="item">
            Support
            <SvgIcon name="expand_more" class="trailing" />
            <div class="drop menu">
              <Shareables name="supports" />
            </div>
          </Dropdown>
        </div>
        <Shareables name="do_more_item" />
        <div
          class="as-icon item"
          v-tooltip.unblocking
          data-tooltip="Notifications"
        >
          <SvgIcon name="notifications" />
        </div>
        <Dropdown
          data-browse-dm="dm1_profile"
          :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
          v-tooltip.unblocking
          data-tooltip="Your profile"
          class="xhover browse as-icon item"
        >
          <img
            :src="userStore.userData.profileImg"
            alt="profile"
            class="fully-rounded logo"
          />
        </Dropdown>
        <Shareables id="dm1_profile" name="profile_menu" />
      </div>
    </div>
  </div>
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
      <SvgIcon name="vertical_align_top" />
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
