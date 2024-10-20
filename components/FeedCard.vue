<script setup>
defineProps(['details']);
</script>
<template>
	<div class="feed-card card">
		<div class="fcd-head">
			<div style="position: relative; height: max-content; line-height: 1;">
				<img class="fcd-logo" :src="details.logoUrl" />
				<svg v-if="details.verified" style="position: absolute; bottom: 0px; right: 0px;" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17.3838 9.62047L17.6513 9.30005L17.3838 8.97962L15.8525 7.14529L16.0663 4.71528L16.1041 4.28504L15.6839 4.18506L13.4351 3.64992L12.2537 1.5545L12.0295 1.15673L11.6131 1.34406L9.5 2.29464L7.38695 1.34406L6.97108 1.15698L6.7466 1.55391L5.56571 3.64197L3.31741 4.17046L2.8959 4.26954L2.93373 4.70088L3.14756 7.13861L1.6156 8.9803L1.34915 9.30062L1.61617 9.62047L3.14751 11.4549L2.93373 13.8921L2.896 14.3222L3.31607 14.4222L5.5653 14.9574L6.7466 17.0462L6.97166 17.4441L7.38811 17.2555L9.5007 16.2986L11.6131 17.2489L12.0289 17.436L12.2534 17.039L13.4347 14.9503L15.6839 14.415L16.1041 14.3151L16.0663 13.8848L15.8525 11.4548L17.3838 9.62047Z" fill="#1FAD40" stroke="white"/>
					<path d="M8.20175 12.6895L5.61084 9.9681L6.61993 8.91096L8.20175 10.5752L12.1904 6.38239L13.1995 7.43953L8.20175 12.6895Z" fill="white"/>
				</svg>
			</div>
			<div style="flex: 1 1 auto;">
				<div class="fcd-displayname">{{ details.displayName }}</div>
				<div class="faint-text-v1 small semibold" style="display: flex; gap: 10px; flex: 1 1 auto;">
					<div><SvgIcon name="schedule" class="mini" /> {{ details.date }}</div>
				</div>
			</div>
			<div>
				<Dropdown :options="{directionPriority: {x: 'left', y: 'bottom'}}">
					<SvgIcon name="more_horiz" />
					<div class="drop menu">
						<div class="item"><SvgIcon name="bookmark_add" class="lead" /> Save post</div>
						<div class="items">
							<div class="aview item"><SvgIcon name="notifications_active" class="lead" /> Turn on notificaions for this post</div>
							<div class="nview item"><SvgIcon name="notifications_off" class="lead" /> Turn off notificaions for this post</div>
						</div>
						<div class="item"><SvgIcon name="unfollow" class="lead" /> Unfollow</div>
						<div class="item"><SvgIcon name="report" class="lead" /> Report post</div>
					</div>
				</Dropdown>
			</div>
		</div>
		<div class="fcd-post">
			<div v-if="details.postMediaUrls" class="fcd-media">
				<img v-for="postMedia in details.postMediaUrls" class="image" :src="postMedia.url" :alt="postMedia.alt" />
			</div>
			{{ details.postText }}
		</div>
		<div class="icon-bar transparent small compact menu">
			<div class="items adaptable fillable" style="padding: 0em 0.5em; border-radius: var(--default-radius);">
				<div class="as-icon item" v-tooltip.unblocking data-tooltip="Thumb up"><SvgIcon name="thumb_up" /> ({{ details.thumbsUp }})</div>
				<div class="as-icon item" v-tooltip.unblocking data-tooltip="Private reply"><SvgIcon name="reply" /></div>
				<div class="as-icon item" v-tooltip.unblocking data-tooltip="Share"><SvgIcon name="share" /></div>
			</div>
		</div>
	</div>
</template>
<style>
	.feed-card {
		width: 100%;
		max-width: 500px;
		padding-bottom: 0.5em;
		margin-bottom: 1em;
		border: 1px solid var(--outline);
	}

	.fcd-head {
		display: flex;
		padding: 0.5em;
		gap: 1em;
	}

	.fcd-logo {
		width: 2.5em;
		height: 2.5em;
		border-radius: 50%;
		border: 2px solid rgba(128,128,128,.5);
	}
	.fcd-displayname {
		font-weight: bold;
		line-height: 1.1;
	}
	.fcd-bizcategory {
		white-space: nowrap;
		overflow: hidden;
		overflow-wrap: break-word;
		text-overflow: ellipsis;
	}
	.fcd-post {
		padding: 0.5em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
</style>