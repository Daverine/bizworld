<script>
	import panel from './panel';

	export default {
		mixins: [panel],
		data() {
			return {
				default: {
					namespace: 'modal',
					toBeConsidered: ':scope .dialog, :scope .md-control',
					toggler: '.open-modal',
					toExcuseToggler: '.ex-open-modal',
					setHighlightRange: true,
					setTabRange: true,
					closeOnEsc: true,
					closeOnWrapperClick: true,
					dismissible: true,
					autoFocusEl: ':scope [md-autofocus]',
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
	<div ref="panel" :id="id" class="modal" tabindex="-1">
		<slot></slot>
	</div>
</template>