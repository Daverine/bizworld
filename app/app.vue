<script setup>
const mainStore = useMainStore();

function handleScroll() {
  if (window.scrollY >= window.innerHeight / 2) mainStore.mutateSFM(true);
  else mainStore.mutateSFM(false);
}

onMounted(() => {
  window.dispatchEvent(new Event('scroll'));
  window.addEventListener('scroll', handleScroll);
  watch(
    () => mainStore.colorScheme,
    (value) => {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.remove('light-mode');
      if (value !== 'auto-mode') document.documentElement.classList.add(value);
    },
    { immediate: true }
  );
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
onUpdated(() => window.dispatchEvent(new Event('scroll')));
</script>
<template>
  <Title>BizWorld | The Web World of Business</Title>
  <Menus />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Modals />
</template>
