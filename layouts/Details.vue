<script setup>
const searchStore = useSearchStore();
</script>

<template>
  <div class="as-page">
    <div class="menu sticky z-level-3">
      <Shareables name="main_menu" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.menu {
  top: 0px;
  border-bottom: 1px solid var(--outline);
  background-color: var(--surface);
}
</style>
