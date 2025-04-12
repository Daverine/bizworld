<script setup>
defineProps(['details', 'isSaved']);
</script>
<template>
  <NuxtLink
    :to="`/${details.type}/${details.id}`"
    class="fluid item-card card"
    :class="isSaved ? 'sav' : ''"
    :data-type="details.type"
  >
    <businessCard v-if="details.type === 'business'" :details="details" />
    <productCard v-else-if="details.type === 'product'" :details="details" />
    <serviceCard v-else-if="details.type === 'project'" :details="details" />

    <div v-if="isSaved" class="itm-opt ex-open-modal">
      <Dropdown
        :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
        class="icon circular transparent compact button"
      >
        <Icon name="material-symbols:more-vert" />
        <div class="drop menu">
          <div class="item">
            <Icon name="material-symbols:share-outline" class="lead" /> Share
          </div>
          <div class="item">
            <Icon
              name="material-symbols:bookmark-remove-outline-rounded"
              class="lead"
            />
            Unsave
          </div>
        </div>
      </Dropdown>
    </div>
  </NuxtLink>
</template>

<style lang="scss">
.item-card {
  --display-width: 11rem;
  --itm-gap: 0.5rem;

  display: flex;
  flex-flow: row wrap;
  width: 100%;
  gap: var(--itm-gap);
  padding: 0.5rem;
  text-decoration: none !important;

  .itm-display {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    max-width: var(--display-width);
    flex: 0 0 auto;
    border-radius: inherit !important;

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .itm-content {
    flex: 1 1 0;
    min-width: 55%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: inherit;
  }

  .itm-title {
    font-size: 1.125em;
    font-weight: var(--semibold-weight);
    color: var(--on-surface);
    line-height: 1.25 !important;
    max-width: calc(100% - 2rem);
    --line-clamp: 2;
  }

  .itm-gap {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    column-gap: 0.5em;
  }

  &[data-type='business'] {
    --display-width: 4.25rem;
  }

  @media only screen and (max-width: 500px) {
    .item-card {
      --display-width: 8rem;
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--outline);
  }

  .itm-tag {
    position: absolute;
    padding: 0.25em;
    border-radius: 0px 0px 0.5rem 0.5rem !important;
    z-index: 100;
    top: 0px;
    right: 1rem;
    background: rgb(255, 188, 0);
    background: linear-gradient(
      45deg,
      rgba(255, 188, 0, 1) 0%,
      rgba(255, 243, 0, 1) 35%,
      rgba(255, 231, 0, 1) 55%,
      rgba(255, 252, 0, 1) 75%,
      rgba(255, 218, 0, 1) 100%
    );
    // background-color: #e53427;
    color: #000;
    font-size: 0.65rem;
  }
}
</style>
