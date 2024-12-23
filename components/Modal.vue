<script>
	import panel from './panel';

	export default {
		mixins: [panel],
		inheritAttrs: false,
		data() {
			return {
				default: {
					namespace: 'modal',
					toBeConsidered: '.dialog, .md-control',
					toggler: '.open-modal',
					toExcuseToggler: '.ex-open-modal',
					setHighlightRange: true,
					setTabRange: true,
					closeOnEsc: true,
					closeOnWrapperClick: true,
					dismissible: true,
					autoFocusEl: '[md-autofocus]',
					dismisser: '.exit-modal',
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
		<div ref="panel" :id="id" v-bind="$attrs" class="modal" tabindex="-1">
			<slot></slot>
		</div>
	</Teleport>
</template>