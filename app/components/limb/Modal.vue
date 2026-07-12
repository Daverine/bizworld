<script setup lang="ts">
const props = defineProps<{
  id: string;
  options?: DialogerSettings;
}>();
const modal = useTemplateRef("modal");
const options: DialogerSettings = {
  namespace: "modal",
  toggler: ".open-modal",
  toExcuseToggler: ".ex-open-modal",
  closeOnEsc: true,
  closeOnWrapperClick: true,
  dismissible: true,
  autoFocusEl: "[md-autofocus]",
  dismisser: ".exit-modal",
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
<style>
.modal {
  position: fixed;
  inset: 0px;
  margin: 0px;
  padding: 0px;
  border: 0px none;
  outline: 0px none;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: var(--z-level-5);
  overflow: hidden auto;
  visibility: hidden;
  scroll-behavior: smooth;
  pointer-events: none;
  background-color: transparent;
  opacity: 0;
  transition:
    opacity 0ms linear 500ms,
    background-color 350ms ease;

  &:not(.custom-scrim)::before {
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

  & > .scrim {
    z-index: -1;
  }

  & > .dialog {
    position: relative;
    background-color: var(--color-surface);
    width: calc(100% - 4rem);
    max-width: 560px;
    max-height: 90vh;
    overflow: hidden auto;
    z-index: 10;
    margin: 7vh auto 3vh;
    backface-visibility: hidden;
    border-radius: var(--radius-block);
    box-shadow: var(--z-depth-5);
    opacity: 0;
    transition:
      transform 500ms ease-out,
      opacity 350ms ease;

    &.bottom-sheet {
      position: fixed;
      top: auto;
      bottom: 0px;
      margin: 0px;
      width: 100%;
      max-width: 100%;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      overflow: auto;
    }

    &.all-scale {
      transform: scale(0.25);
    }

    &.horizontal-scale {
      transform: scaleX(0.25);
    }

    &.vertical-scale {
      transform: scaleY(0.25);
    }

    &.horizontal-flip {
      transform: perspective(2000px) rotateX(-90deg);
    }

    &.vertical-flip {
      transform: perspective(2000px) rotateY(-90deg);
    }

    &.bottom-sheet {
      transform: translateY(100%);
    }
  }

  &.active {
    opacity: 1;
    pointer-events: initial;
    transition:
      opacity 0ms linear 0ms,
      background-color 350ms ease;

    &:not(.transparent):before {
      opacity: var(--scrim-opacity);
    }

    & > .dialog {
      opacity: 1;
      transition:
        transform 500ms ease-in,
        opacity 350ms ease-out 150ms;

      &.all-scale {
        transform: scale(1);
      }

      &.horizontal-scale {
        transform: scaleX(1);
      }

      &.vertical-scale {
        transform: scaleY(1);
      }

      &.horizontal-flip {
        transform: perspective(2000px) rotateX(0deg);
      }

      &.vertical-flip {
        transform: perspective(2000px) rotateY(0deg);
      }

      &.bottom-sheet {
        transform: translate(0%);
      }
    }
  }
}
</style>
