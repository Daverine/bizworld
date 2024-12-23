<script setup>
definePageMeta({layout: 'common'});
const searchStore = useSearchStore();
const route = useRoute();

// watch(() => route.query.q, () => document.title = `BizWorld | Search: ${route.query.q}`, { immediate: true });
onMounted(() => {
	if (!searchStore.searchBox) {
		searchStore.searchBox = route.query.q;
		searchStore.triggerSearch();
	}
});
</script>

<template>
	<Title>BizWorld | Search: {{ route.query.q }}</Title>
	<main class="flexible col" id="feed">
		<div class="sp-wrapper fluid z-level-3 p-h" style="margin-bottom: 1rem;">
			<IScroller v-scrollPin="{ topSpacing: 64, ancestorGuarded: true }">
				<div class="l-scroll">
					<SvgIcon name="double_arrow_left" class="mini" />
				</div>
				<div class="r-scroll">
					<SvgIcon name="double_arrow_right" class="mini" />
				</div>
				<div class="rail small menu scroll-items">
					<div class="compact item xhover">
						Search in:
						<Dropdown class="selection iflexbox">
							<SvgIcon name="category_search" class="primary-text r-spaced" />
							<div class="drop menu">
								<div class="active item">All categories</div>
								<div class="item">Businesses</div>
								<div class="item">Products</div>
								<div class="item">Services</div>
							</div>
						</Dropdown>
						<div>
							<SvgIcon name="location_on" class="primary-text r-spaced" />
							Ogun, Nigeria
						</div>
					</div>
					<div class="xhover item r-aligned">
						View as:
						<SvgIcon name="grid_view" />
						<SvgIcon name="list_view" />
					</div>
				</div>
			</IScroller>
		</div>
		<ItemCard v-for="(result, i) in searchStore.searchResults" :key="i" :details="result" />

		<div class="divider"><button class="button">More results
				<SvgIcon class="trailing" name="expand_more" />
			</button></div>
	</main>
</template>