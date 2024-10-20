<script setup>
	const mainStore = useMainStore();

	function handleScroll() {
		const firstSection = document.getElementById('firstSec');
		if (firstSection && firstSection.getBoundingClientRect().top <= 0) mainStore.mutateSFM(true);
		else mainStore.mutateSFM(false);
	}

	onMounted(() => {
		window.dispatchEvent(new Event("scroll"));
		window.addEventListener('scroll', handleScroll);
		watch(() => mainStore.colorScheme, value => {
			document.documentElement.classList.remove('dark-mode');
			document.documentElement.classList.remove('light-mode');
			if (value !== 'auto-mode') document.documentElement.classList.add(value);
		}, { immediate: true });
	});
	onUnmounted(() => window.removeEventListener('scroll', this.handleScroll));
	onUpdated(() => window.dispatchEvent(new Event('scroll')));
</script>
<template>
    <Menus/>
	  <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Modals/>
</template>
