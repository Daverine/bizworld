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
  <template v-if="name === 'supports'">
    <div class="item">
      <Icon name="material-symbols:help-outline-rounded" class="lead" /> Help center
    </div>
    <div class="item">
      <Icon name="material-symbols:feedback-outline-rounded" class="lead" />
      Give feedback
    </div>
  </template>
  <div v-else-if="name === 'copyright'" class="transparent text wrappable menu justify-center">
    <div class="item">Terms of use</div>
    <div class="item">About us</div>
    <div class="item">Help</div>
    <div class="item">Settings</div>
    <div class="item">@ Copyright 2023</div>
    <div class="item">Emmadave Inc.</div>
  </div>
  <div v-else-if="name === 'color_scheme'" class="field self-end">
    <div class="field-label">Color scheme settings</div>
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
</template>
