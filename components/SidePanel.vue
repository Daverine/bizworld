<script setup lang="ts">

defineOptions({ inheritAttrs: false });

interface PanelOptions {
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
  options?: PanelOptions;
}>();

const sidepanel = useTemplateRef('panel');
const options: PanelOptions = {
  namespace: 'sidepanel',
  toBeConsidered: '.panel, .sp-control',
  toggler: '.open-sidepanel',
  closeOnEsc: true,
  closeOnWrapperClick: true,
  dismissible: true,
  autoFocusEl: '[sp-autofocus]',
  dismisser: '.exit-sidepanel',
  lockScreen: true,
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
