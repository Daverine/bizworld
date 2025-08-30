<template>
  <div class="as-page">
    <div class="menu sticky z-level-3">
      <Shareables name="main_menu" />
    </div>
    <section class="csection flexbox">
      <ManageShareables name="page_nav" />
      <slot />
      <!-- <Shareables name="ad_menu" /> -->
    </section>
  </div>
</template>
<style scoped>
.csection {
  position: relative;
  min-height: 70vh;
  max-width: 1440px;
  margin: 0rem auto;
}
.menu {
  top: 0px;
  border-bottom: 1px solid var(--outline);
  background-color: var(--surface);
}
</style>
