<script setup>
import AuthModals from './components/AuthModals.vue';

const mainStore = useMainStore();

function handleScroll() {
  if (window.scrollY >= window.innerHeight / 2) mainStore.mutateSFM(true);
  else mainStore.mutateSFM(false);
}

onMounted(() => {
  window.dispatchEvent(new Event('scroll'));
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>
<template>
  <Title>BizWorld | The Web World of Business</Title>
  <Menus />
  <AuthModals />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Modals />
</template>
