<script setup>
import AuthModals from "./components/AuthModals.vue";

const mainStore = useMainStore();
const { isLoading } = useLoadingIndicator();

function handleScroll() {
  if (window.scrollY >= window.innerHeight / 2) mainStore.mutateSFM(true);
  else mainStore.mutateSFM(false);
}

onMounted(() => {
  window.dispatchEvent(new Event("scroll"));
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
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
  <div class="fixed inset-0 z-level-5 grid place-items-center" v-if="isLoading">
    <div class="m3-progress indeterminate"></div>
  </div>
</template>
