<script setup>
defineOptions({ name: 'rc-shareables' });
defineProps(['name']);

const mainStore = useMainStore();
const userStore = useUserStore();
const searchStore = useSearchStore();
</script>

<template>
  <template v-if="name === 'account'">
    <NuxtLink
      to="/account/profile"
      class="item exit-sidepanel"
      exact-active-class="active"
    >
      <Icon name="material-symbols:person-outline-rounded" class="lead" /> Your profile
    </NuxtLink>
    <NuxtLink
      to="/account/reviews"
      class="item exit-sidepanel"
      exact-active-class="active"
    >
      <Icon name="material-symbols:reviews-outline-rounded" class="lead" /> Your reviews
    </NuxtLink>
    <NuxtLink
      to="/account/saved"
      class="item exit-sidepanel"
      exact-active-class="active"
    >
      <Icon name="material-symbols:bookmarks-outline-rounded" class="lead" /> Saved cards
    </NuxtLink>
    <NuxtLink
      to="/account/followed"
      class="item exit-sidepanel"
      exact-active-class="active"
    >
      <Icon name="material-symbols:groups-outline-rounded" class="lead" /> Followed providers
    </NuxtLink>
  </template>
  <LimbDropdown
    v-else-if="name === 'do_more_item'"
    :options="{ directionPriority: { x: 'center', y: 'bottom' } }"
    v-tooltip.unblocking
    data-tooltip="Do more"
    class="as-icon item"
  >
    <Icon name="material-symbols:apps" />
    <div class="drop menu">
      <div class="compact grid menu 3-cols app-items">
        <div
          class="bar-item item open-modal exit-dd"
          data-target="search-modal"
        >
          <Icon name="material-symbols:search-rounded" />
          <span class="text label">Search</span>
        </div>
        <div
          class="bar-item item open-modal exit-dd"
          data-target="explore-modal"
        >
          <Icon name="material-symbols:manage-search-rounded" />
          <span class="text label">Explore</span>
        </div>
        <div
          class="bar-item item open-modal exit-dd"
          data-target="scanqr-modal"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" />
          <span class="text label">Scan QR</span>
        </div>
        <div
          v-if="userStore.auth && userStore.userData.manageBisiness"
          class="bar-item item open-modal exit-dd"
          data-target="create-post"
        >
          <Icon name="material-symbols:edit-square-outline-rounded" />
          <span class="text label">Post</span>
        </div>
      </div>
    </div>
  </LimbDropdown>
  <div class="drop menu" v-else-if="name === 'profile_menu'">
    <div class="header centered xhover item">
      <NuxtImg
        preset="logo"
        :src="userStore.userData.profileImg"
        class="free-img circular image"
      />{{ `${userStore.userData.firstName} ${userStore.userData.lastName}` }}
    </div>
    <rc-shareables name="account" />
    <div class="item" @click="userStore.logout()">
      <Icon name="material-symbols:logout-rounded" class="lead" /> Log out
    </div>
  </div>
  <template v-else-if="name === 'supports'">
    <div class="item"><Icon name="material-symbols:help-outline-rounded" class="lead" /> Help center</div>
    <div class="item">
      <Icon name="material-symbols:feedback-outline-rounded" class="lead" /> Give feedback
    </div>
  </template>
  <div
    v-else-if="name === 'main_menu'"
    class="container-lg items auto-margined"
    style="border-radius: var(--default-radius)"
  >
    <div
      class="item as-icon open-sidepanel"
      v-tooltip.unblocking
      data-tooltip="Menu"
      data-target="msidepanel"
    >
      <Icon name="material-symbols:menu-rounded" />
    </div>
    <NuxtLink
      :to="userStore.auth ? '/home' : '/'"
      class="xhover item as-icon"
    >
      <NuxtImg
        preset="logo"
        src="/images/logo_sqr.png"
        alt="site logo"
        class="logo-lg site-logo"
      />
    </NuxtLink>
    <form
      class="xhover adaptable item md-and-down-hidden"
      @submit.prevent="searchStore.triggerSearch()"
    >
      <label
        class="input container-text transparent"
        style="background-color: var(--surface-v4) !important"
      >
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
          v-tooltip.unblocking
          data-tooltip="Scan Business QR"
          class="icon open-modal"
          data-target="scanqr-modal"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" />
        </button>
        <button
          type="button"
          v-tooltip.unblocking
          data-tooltip="Search location is set to Nigeria. Click to change it."
          class="icon open-modal"
          data-target=""
        >
          <Icon name="material-symbols:location-on-outline-rounded" />
        </button>
      </label>
    </form>
    <div class="items r-aligned">
      <div
        v-tooltip.unblocking
        data-tooltip="Search"
        class="open-modal as-icon item md-and-up-hidden sm-and-down-hidden"
        data-target="search-modal"
      >
        <Icon name="material-symbols:search-rounded" />
      </div>
      <rc-shareables name="do_more_item" />
      <template v-if="userStore.auth">
        <LimbDropdown
          :options="{ directionPriority: { x: 'center', y: 'bottom' } }"
          class="as-icon item ac-viewbox-ref"
          v-tooltip.unblocking
          data-tooltip="Notifications"
        >
          <i class="icon ac-viewbox">
            <Icon name="material-symbols:notifications-outline-rounded" />
            <Icon name="material-symbols:notifications-rounded" />
          </i>
          <div
            class="pointing drop menu"
            style="width: 300px; height: calc(100vh - 84px); max-height: 600px"
          >
            <div class="flexbox flex-column padded" style="height: 100%">
              <div
                class="flexible flexbox flex-column align-center justify-center guttered"
              >
                <Icon
                  name="material-symbols-light:notifications-off-outline-rounded"
                  style="font-size: 6rem; color: var(--on-surface-v2)"
                />
                <span class="text">You have no new notifications.</span>
              </div>
              <div class="transparent compact divider"></div>
              <div class="item">
                <button class="fluid button">View all</button>
              </div>
            </div>
          </div>
        </LimbDropdown>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
          v-tooltip.unblocking
          data-tooltip="Your profile"
          class="xhover as-icon item"
        >
          <NuxtImg
            preset="logo"
            :src="userStore.userData.profileImg"
            alt="profile"
            class="fully-rounded logo"
          />
          <rc-shareables name="profile_menu" />
        </LimbDropdown>
      </template>
      <template v-else>
        <div class="items lg-and-down-hidden">
          <div class="item open-modal" data-target="login-modal">Log in</div>
          <div class="xhover item as-icon 0-l-padding">
            <button
              class="primary button open-modal"
              data-target="register-modal"
            >
              Sign Up
            </button>
          </div>
        </div>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
          v-tooltip.unblocking
          data-tooltip="Account"
          class="item as-icon lg-and-up-hidden"
        >
          <Icon name="material-symbols:person-add-outline-rounded" />
          <span class="sm-and-down-hidden">Account</span>
          <div class="drop menu">
            <div class="item open-modal" data-target="login-modal">Log in</div>
            <div class="item open-modal" data-target="register-modal">
              Sign Up
            </div>
          </div>
        </LimbDropdown>
      </template>
    </div>
  </div>

  <footer v-else-if="name === 'common_footer'" style="align-self: flex-end">
    <rc-shareables name="copyright" />
  </footer>
  <div
    v-else-if="name === 'copyright'"
    class="transparent text wrappable menu justify-center"
  >
    <div class="item">Terms of use</div>
    <div class="item">About us</div>
    <div class="item">Help</div>
    <div class="item">Settings</div>
    <div class="item">@ Copyright 2023</div>
    <div class="item">Emmadave Inc.</div>
  </div>
  <template v-else-if="name === 'ad_menu'">
    <aside class="flex-none col sidemenu lg-and-down-hidden">
      <div id="admenu" v-scrollPin="{ top: 84, bottom: 16 }">
        <div style="width: 100%">
          <h6 class="text-center" style="margin-bottom: 16px">
            Sponsored (Ads)
          </h6>
          <div class="ads">
            <div class="text-center ad">
              <NuxtImg
                format="webp"
                src="/images/ads.jpg"
                alt="ad"
                class="image"
              />
              <div>
                Fix your laptops and desktops (Hardware and Software).
                <button class="primary button">contact us</button>
              </div>
            </div>
          </div>
        </div>
        <!-- <rc-shareables name="common_footer" /> -->
      </div>
    </aside>
  </template>
  <div
    v-else-if="name === 'color_scheme'"
    class="field"
    style="align-self: flex-end"
  >
    <label>Color scheme settings</label>
    <div class="icon fluid option-group">
      <label>
        <input
          v-model="mainStore.colorScheme"
          type="radio"
          value="light-mode"
        />
        <Icon name="material-symbols:light-mode-outline-rounded" />
      </label>
      <label>
        <input v-model="mainStore.colorScheme" type="radio" value="auto-mode" />
        <Icon name="material-symbols:desktop-windows-outline-rounded" />
      </label>
      <label>
        <input v-model="mainStore.colorScheme" type="radio" value="dark-mode" />
        <Icon name="material-symbols:dark-mode-outline-rounded" />
      </label>
    </div>
  </div>
</template>
