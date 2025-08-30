<script setup lang="ts">

defineOptions({ inheritAttrs: false });

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

const { teleporter } = useDialoger(sidepanel, props.id, options);
</script>
<template>
  <Teleport to="body" :disabled="!teleporter">
    <div ref="panel" class="sidepanel" v-bind="$attrs" :id="id" tabindex="-1">
      <slot></slot>
    </div>
  </Teleport>
</template>
