<script lang="ts" setup>
defineOptions({ name: "rc-shareables" });
defineProps(["name"]);

const { user, signOut } = useAuth();
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
        class="image rounded-full"
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
        <label
          v-for="mode in [
            { name: 'light', icon: 'material-symbols:light-mode-outline-rounded' },
            { name: 'auto', icon: 'material-symbols:desktop-mac-outline-rounded' },
            { name: 'dark', icon: 'material-symbols:dark-mode-outline-rounded' },
          ]"
          class="as-icon item design-takeover"
          :class="{ active: colorMode === mode.name }"
        >
          <input v-model="colorMode" type="radio" :value="mode.name" />
          <Icon :name="mode.icon" />
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
      <div class="flex flex-1 flex-col items-center justify-center gap-3">
        <Icon
          name="material-symbols:notifications-off-outline-rounded"
          style="font-size: 6rem; color: var(--on-surface-v2)"
        />
        <span class="text">You have no new notifications.</span>
      </div>
      <div class="transparent compact divider"></div>
      <div class="item">
        <button class="button w-full">View all</button>
      </div>
    </div>
  </div>
</template>
