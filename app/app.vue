<script setup>
const { isLoading } = useLoadingIndicator();
</script>
<template>
  <Html lang="en" />
  <Title>BizWorld | The Web World of Business</Title>
  <Menus />
  <AuthModals />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Modals />
  <PreCart />
  <div
    class="z-level-5 bg-overlay fixed inset-0 grid place-items-center backdrop-blur-xs"
    :class="{ hidden: !isLoading }"
  >
    <div class="m3-progress indeterminate"></div>
  </div>
</template>
