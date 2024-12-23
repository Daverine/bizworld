<script>
import panel from './panel';

export default {
	mixins: [panel],
	inheritAttrs: false,
	data() {
		return {
			default: {
				namespace: 'sidepanel',
				toBeConsidered: '.panel, .sp-control',
				toggler: '.open-sidepanel',
				setHighlightRange: true,
				setTabRange: true,
				closeOnEsc: true,
				closeOnWrapperClick: true,
				dismissible: true,
				dismisser: '.exit-sidepanel',
				lockScreen: true,
				inDuration: 500,
				outDuration: 500
			}
		}
	}
}
</script>
<template>
	<Teleport to="body" :disabled="!uniqueId">
		<div ref="panel" class="sidepanel" v-bind="$attrs" :id="id" tabindex="-1">
			<slot></slot>
		</div>
	</Teleport>
</template>