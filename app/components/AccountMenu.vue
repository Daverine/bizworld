<script lang="ts" setup>
const { user, signOut } = useAuth();
</script>
<template>
  <div class="dropdown menu">
    <div class="header centered xhover item flex-col">
      <NuxtImg
        preset="logo"
        :src="user?.image || '/images/profilepic.jpg'"
        class="image rounded-full"
      />
      <div>Welcome, <strong>{{ user?.name }}</strong></div>
    </div>
    <AccountNavItems />
    <button class="item" @click="signOut()">
      <Icon name="material-symbols:logout-rounded" class="lead" /> Log out
    </button>
  </div>
</template>
<style></style>
