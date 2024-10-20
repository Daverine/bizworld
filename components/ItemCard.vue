<script setup>
defineProps(['details', 'isSaved']);
</script>
<template>
	<div class="fluid item-card card open-modal" :class="isSaved ? 'sav' : ''" :data-type="details.cardType"
		data-target="sc-details">
		<businessCard v-if="details.cardType === 'business'" :details="details" />
		<productCard v-else-if="details.cardType === 'product'" :details="details" />
		<serviceCard v-else-if="details.cardType === 'service'" :details="details" />
		<postCard v-else-if="details.cardType === 'post'" :details="details" />

		<div v-if="isSaved" class="itm-opt ex-open-modal">
			<Dropdown :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
				class="icon circular transparent compact button">
				<SvgIcon name="more_vert" />
				<div class="drop menu">
					<div class="item">
						<SvgIcon name="share" class="lead" /> Share
					</div>
					<div class="item">
						<SvgIcon name="bookmark_remove" class="lead" /> Unsave
					</div>
				</div>
			</Dropdown>
		</div>
	</div>
</template>

<style lang="scss">
.item-card {
	--display-width: 11rem;
	--logo-width: 4.25rem;
	--itm-gap: 0.5rem;

	display: flex;
	flex-flow: row wrap;
	align-items: center;
	width: 100%;
	column-gap: var(--itm-gap);
	padding: 0.5rem;
	cursor: pointer;
	position: relative;
	border-radius: 0px;

	&.sav {
		padding-right: 2.5em;
	}

	.itm-opt {
		position: absolute;
		right: 0em;
		top: 1em;
	}

	.itm-display {
		position: relative;
		width: 100%;
		max-width: var(--display-width);
		flex: 0 0 auto;
		border-radius: inherit !important;

		.itm-media {
			position: relative;
			width: 100%;
			height: 0rem;
			padding-top: 75%;

			canvas {
				position: absolute;
				height: 100%;
				width: 100%;
				top: 0px;
				left: 0px;
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
			}
		}
	}

	.itm-content {
		flex: 1 1 0;
		min-width: 55%;
		align-self: stretch;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: inherit;
	}

	.itm-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		font-size: 1.125em;
		font-weight: var(--semibold-weight);
		color: var(--on-surface);
		line-height: 1.25 !important;
		max-width: calc(100% - 2rem);
		padding-bottom: 0.125em;
		margin: 0 0 0.125em !important;
	}

	.itm-gap {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
		column-gap: 0.5em;
	}

	&[data-type=business] {
		.itm-display {
			width: var(--logo-width);
			height: var(--logo-width);
		}

		.itm-content {
			width: calc(100% - var(--logo-width) - var(--itm-gap));
			/* 100% - itm-display width - gap width */
		}
	}

	&[data-type=post] {
		.itm-title {
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}
	}

	@media only screen and (max-width : 500px) {
		.item-card {
			--display-width: 8rem;
		}
	}

	&:not(:last-child) {
		border-bottom: 1px solid var(--outline);
	}

	.itm-tag {
		position: absolute;
		padding: 0.25em;
		border-radius: 0px 0px 0.5rem 0.5rem !important;
		z-index: 100;
		top: 0px;
		right: 1rem;
		background: rgb(255, 188, 0);
		background: linear-gradient(45deg, rgba(255, 188, 0, 1) 0%, rgba(255, 243, 0, 1) 35%, rgba(255, 231, 0, 1) 55%, rgba(255, 252, 0, 1) 75%, rgba(255, 218, 0, 1) 100%);
		// background-color: #e53427;
		color: #000;
		font-size: 0.65rem;
	}
}
</style>