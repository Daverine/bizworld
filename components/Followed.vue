<script setup>
defineOptions({ title: 'Following | BizWorld' });
const userStore = useUserStore();
onMounted(() => userStore.getFollowedCards());
</script>
<template>
	<h6 class="text-center">Following</h6>
	<div class="fluid" style="display: flex; flex-flow: row wrap; justify-content: center; gap: 1em; padding: 1rem;">
		<BizCard v-for="result in userStore.followedCards" :details="result" />
	</div>
	<div class="divider"><button class="button">More results
			<SvgIcon class="trailing" name="expand_more" />
		</button></div>
</template>