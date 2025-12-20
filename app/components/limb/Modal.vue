<script setup lang="ts">
const props = defineProps<{
  id: string;
  options?: DialogerSettings;
}>();
const modal = useTemplateRef('modal');
const options: DialogerSettings = {
  namespace: 'modal',
  toggler: '.open-modal',
  toExcuseToggler: '.ex-open-modal',
  closeOnEsc: true,
  closeOnWrapperClick: true,
  dismissible: true,
  autoFocusEl: '[md-autofocus]',
  dismisser: '.exit-modal',
  inDuration: 500,
  outDuration: 500,
  ...props.options,
};
const control = useDialoger(modal, props.id, options);
</script>

<template>
  <div ref="modal" :id="id" role="dialog" aria-modal="true" class="modal">
    <slot :control></slot>
  </div>
</template>
