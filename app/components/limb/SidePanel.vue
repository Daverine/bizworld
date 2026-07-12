<script setup lang="ts">
const props = defineProps<{
  id: string;
  options?: DialogerSettings;
}>();
const sidepanel = useTemplateRef("panel");
const options: DialogerSettings = {
  namespace: "sidepanel",
  toggler: ".open-sidepanel",
  closeOnEsc: true,
  closeOnWrapperClick: true,
  dismissible: true,
  autoFocusEl: "[sp-autofocus]",
  dismisser: ".exit-sidepanel",
  inDuration: 500,
  outDuration: 500,
  ...props.options,
};
const control = useDialoger(sidepanel, props.id, options);
</script>
<template>
  <div ref="panel" :id="id" role="dialog" aria-modal="true" class="sidepanel">
    <slot :control></slot>
  </div>
</template>
<style>
:root {
  --sidepanel-width: 16.25rem;
  --sidepanel-thin-width: 9.375rem;
  --sidepanel-wide-width: 21.875rem;
}

.sidepanel {
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  margin: 0px;
  padding: 0px;
  border: 0px none;
  outline: 0px none;
  pointer-events: none;
  overflow: hidden;
  visibility: hidden;
  z-index: var(--z-level-4);
  position: fixed;
  background-color: transparent;
  opacity: 0;
  transition:
    opacity 0ms linear 500ms,
    background-color 350ms ease;

  &::before {
    content: "";
    position: fixed;
    inset: 0px;
    background-color: var(--color-on-surface-v2);
    border: 0px none;
    border-radius: inherit;
    user-select: none;
    pointer-events: none;
    -webkit-tap-highlight-color: transparent;
    opacity: 0;
    transition: opacity 300ms;
  }

  & > .panel {
    display: flex;
    flex-flow: column nowrap;
    gap: 1em;
    position: absolute;
    overflow-y: auto;
    border-radius: 0em;
    margin: 0;
    width: var(--sidepanel-width);
    height: 100%;
    max-height: 100%;
    max-width: calc(100vw - 1.25rem);
    top: 0;
    color: var(--color-on-surface);
    background-color: var(--color-surface);
    box-shadow: var(--z-depth-5);
    z-index: 100;
    backface-visibility: hidden;
    transition: transform 500ms ease;
  }

  &.left > .panel {
    right: auto;
    left: 0px;
    transform: translate3d(-100%, 0, 0);
  }

  &.right > .panel {
    left: auto;
    right: 0px;
    transform: translate3d(100%, 0, 0);
  }

  &.thin > .panel {
    width: var(--sidepanel-thin-width);
  }

  &.wide > .panel {
    width: var(--sidepanel-wide-width);
  }

  & > .scrim {
    opacity: 0;
    transition: opacity 300ms;
  }

  &.active {
    background-color: transparent; /* var(--scrim-bg) */
    opacity: 1;
    pointer-events: initial;
    transition:
      opacity 0ms linear 0ms,
      background-color 350ms ease;

    &:before {
      opacity: var(--scrim-opacity);
    }

    &.transparent {
      background-color: transparent;

      &::before {
        opacity: 0;
      }
    }

    & > .scrim {
      opacity: 1;
      pointer-events: initial;
    }

    & > .panel {
      pointer-events: initial;
      transform: translate3d(0, 0, 0);
    }

    &.push {
      & ~ * {
        transition: transform 500ms ease;
      }

      &.left ~ * {
        transform: translate3d(var(--sidepanel-width), 0, 0);
      }

      &.left.thin ~ * {
        transform: translate3d(var(--sidepanel-thin-width), 0, 0);
      }

      &.left.wide ~ * {
        transform: translate3d(var(--sidepanel-wide-width), 0, 0);
      }

      &.right ~ * {
        transform: translate3d(calc(-1 * var(--sidepanel-width)), 0, 0);
      }

      &.right.thin ~ * {
        transform: translate3d(calc(-1 * var(--sidepanel-thin-width)), 0, 0);
      }

      &.right.wide ~ * {
        transform: translate3d(calc(-1 * var(--sidepanel-wide-width)), 0, 0);
      }
    }
  }
}
</style>
