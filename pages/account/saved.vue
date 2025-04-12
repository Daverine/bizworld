<script setup>
definePageMeta({ layout: 'account', auth: true, });
defineOptions({ title: 'Saved cards | BizWorld' });
const userStore = useUserStore();
onMounted(() => userStore.getSavedCards());
</script>

<template>
	<h6 class="text-center">Saved Cards</h6>

	<ItemCard v-for="(result, i) in userStore.savedCards" :key="i" :details="result" :isSaved="true" />

	<div class="divider"><button class="button">More results
			<SvgIcon class="trailing" name="expand_more" />
		</button></div>
</template>