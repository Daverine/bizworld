<script setup lang="ts">
const userStore = useUserStore();
</script>
<template>
  <div class="items" style="border-radius: var(--default-radius)">
    <template v-if="userStore.auth">
      <NuxtLink
        to="/home"
        exact-active-class="active"
        class="item exit-sidepanel ac-viewbox-ref"
      >
        <i class="lead icon ac-viewbox">
          <Icon name="material-symbols:home-outline-rounded" />
          <Icon name="material-symbols:home-rounded" />
        </i>
        Home
      </NuxtLink>
      <NuxtLink
        to="/messaging"
        exact-active-class="active"
        class="item exit-sidepanel ac-viewbox-ref"
      >
        <i class="lead icon ac-viewbox">
          <Icon name="material-symbols:chat-outline-rounded" />
          <Icon name="material-symbols:chat-rounded" />
        </i>
        Messaging
      </NuxtLink>
      <NuxtLink
        to="/myshops"
        exact-active-class="active"
        class="item exit-sidepanel ac-viewbox-ref"
      >
        <i class="lead icon ac-viewbox">
          <Icon name="material-symbols:store-outline-rounded" />
          <Icon name="material-symbols:store-rounded" />
        </i>
        My Shops
      </NuxtLink>
      <div
        v-collapser
        class="item xactive ac-viewbox-ref"
        :class="{ active: $route.path.includes('/account') }"
      >
        <i class="lead icon ac-viewbox">
          <Icon name="material-symbols:person-outline-rounded" />
          <Icon name="material-symbols:person-rounded" />
        </i>
        Account
        <i class="trailing icon ac-viewbox">
          <Icon name="material-symbols:chevron-left-rounded" />
          <Icon name="material-symbols:keyboard-arrow-down-rounded" />
        </i>
      </div>
      <div class="collapsible sub items">
        <Shareables name="account" />
      </div>
      <div v-collapser class="item xactive ac-viewbox-ref">
        <i class="lead icon ac-viewbox">
          <Icon name="material-symbols:contact-support-outline-rounded" />
          <Icon name="material-symbols:contact-support-rounded" />
        </i>
        Support
        <i class="trailing icon ac-viewbox">
          <Icon name="material-symbols:chevron-left-rounded" />
          <Icon name="material-symbols:keyboard-arrow-down-rounded" />
        </i>
      </div>
      <div class="collapsible sub items">
        <Shareables name="supports" />
      </div>
      <div class="item" @click="userStore.logout()">
        <Icon name="material-symbols:logout-rounded" class="lead" /> Log out
      </div>
      <div class="transparent compact divider"></div>
      <div class="xhover item 0-padding">
        <button
          class="fluid button exit-modal open-modal"
          data-target="create-biz"
        >
          Have a shop online
        </button>
      </div>
    </template>
    <template v-else>
      <div v-collapser class="item xactive ac-viewbox-ref">
        <i class="lead icon ac-viewbox">
          <Icon name="material-symbols:contact-support-outline-rounded" />
          <Icon name="material-symbols:contact-support-rounded" />
        </i>
        Support
        <i class="trailing icon ac-viewbox">
          <Icon name="material-symbols:chevron-left-rounded" />
          <Icon name="material-symbols:keyboard-arrow-down-rounded" />
        </i>
      </div>
      <div class="collapsible sub items">
        <Shareables name="supports" />
      </div>
      <div class="item open-modal" data-target="create-biz">
        <Icon
          name="material-symbols:add-business-outline-rounded"
          class="lead"
        />
        Have a shop online
      </div>
      <div class="item open-modal exit-sidepanel" data-target="login-modal">
        <Icon name="material-symbols:login-rounded" class="lead" />
        Log in
      </div>
      <div class="transparent compact divider"></div>
      <div class="xhover item 0-padding">
        <button
          class="fluid primary button open-modal exit-sidepanel"
          data-target="register-modal"
        >
          Sign Up
        </button>
      </div>
    </template>
  </div>
</template>
