<script setup lang="ts">

defineOptions({ inheritAttrs: false });

interface ModalOptions {
  namespace?: string;
  toBeConsidered?: string;
  toggler?: string;
  toExcuseToggler?: string;
  setHighlightRange?: boolean;
  setTabRange?: boolean;
  closeOnEsc?: boolean;
  closeOnWrapperClick?: boolean;
  dismissible?: boolean;
  autoFocusEl?: string;
  dismisser?: string;
  lockScreen?: boolean;
  inDuration?: number;
  outDuration?: number;
}

const props = defineProps<{
  id: string;
  options?: ModalOptions;
}>();

const modal = useTemplateRef('modal');
const options: ModalOptions = {
  namespace: 'modal',
  toBeConsidered: '.dialog, .md-control',
  toggler: '.open-modal',
  toExcuseToggler: '.ex-open-modal',
  closeOnEsc: true,
  closeOnWrapperClick: true,
  dismissible: true,
  autoFocusEl: '[md-autofocus]',
  dismisser: '.exit-modal',
  lockScreen: true,
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
