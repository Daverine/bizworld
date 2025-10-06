<script setup lang="ts">
const props = defineProps<{
  id: string;
  options?: DialogerSettings;
}>();
const sidepanel = useTemplateRef('panel');
const options: DialogerSettings = {
  namespace: 'sidepanel',
  toggler: '.open-sidepanel',
  closeOnEsc: true,
  closeOnWrapperClick: true,
  dismissible: true,
  autoFocusEl: '[sp-autofocus]',
  dismisser: '.exit-sidepanel',
  inDuration: 500,
  outDuration: 500,
  ...props.options,
};
useDialoger(sidepanel, props.id, options);
</script>
<template>
  <div ref="panel" :id="id" role="dialog" aria-modal="true" class="sidepanel">
    <slot></slot>
  </div>
</template>
