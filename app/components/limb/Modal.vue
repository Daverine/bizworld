<script setup lang="ts">

defineOptions({ inheritAttrs: false });

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

const { teleporter } = useDialoger(modal, props.id, options);
</script>

<template>
  <Teleport to="body" :disabled="!teleporter">
    <div ref="modal" :id="props.id" v-bind="$attrs" class="modal" tabindex="-1">
      <slot></slot>
    </div>
  </Teleport>
</template>
