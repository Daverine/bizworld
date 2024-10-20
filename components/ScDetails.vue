<script setup>
defineProps(['details']);
</script>

<template>
  <template v-if="details">
    <BusinessDetails v-if="details.type === 'business'" :details="details" />
    <ProductDetails v-else-if="details.type === 'product'" :details="details" />
    <ServiceDetails  v-else-if="details.type === 'service'" :details="details" />
  </template>
  <div v-else class="dialog self-scroll">
    <div class="progress-bar"></div>
  </div>
</template>

<style lang="scss">
.sc-dialog {
  .dm-header {
    position: absolute;
    width: 100%;
    align-items: center;
    background-color: transparent;
    z-index: var(--z-level-3);
    transition: background-color ease 250ms;

    &.active {
      background-color: var(--surface);
      box-shadow: var(--z-depth-2);
    }

    &>.content {
      transition: opacity ease 250ms;
    }

    &:not(.active)>.content {
      opacity: 0;
    }

    &>.trailing.icon {
      height: 2em !important;
      width: 2em !important;
    }

    &:not(.active)>.trailing.icon {
      background-color: var(--surface) !important;
      box-shadow: var(--z-depth-1);
    }
  }

  .dm-display {
    position: relative;
    width: 100%;
    max-width: var(--display-width);
    flex: 0 0 auto;
    border-radius: inherit !important;

    .dm-media {
      position: relative;
      width: 100%;
      height: 0rem;

      canvas,
      .dm-dps {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0px;
        left: 0px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .dm-gap {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
  }

  .dm-logo {
    position: relative;
    width: 4.25rem;
    height: 4.25rem;
    border-radius: 50%;
    background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid gray;
  }

  .dm-title {
    font-size: 1.375em;
    font-weight: var(--semibold-weight);
    color: var(--on-surface);
    line-height: 1.125 !important;
    width: 100%;
    padding-bottom: 0.125em;
    margin: 0 0 0.125em !important;
  }

  .dm-info td {
    vertical-align: top;

    &:first-child>i.icon {
      color: var(--primary);
    }
  }

  .dm-review {
    &>header {
      display: flex;
      gap: 1em;
      align-items: center;
      width: 100%;

      &>.avatar.image {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: var(--surface-v5);
      }

      &>.content {
        flex: 1 1 auto;
      }
    }
  }

  &[data-type="business"] {
    .dm-heading {
      width: calc(100% - 4.25rem - 0.5rem);
    }

    .dm-media {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      padding-top: calc(100% / 9 * 5); // 9:5 aspect ratio
    }
  }

  &[data-type="product"],
  &[data-type="service"] {
    .dm-media {
      padding-top: calc(100% / 4 * 3); // 4:3 aspect ratio
    }
  }
}
</style>