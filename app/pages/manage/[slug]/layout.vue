<script setup>
definePageMeta({ name: "manage-biz-layout", layout: "common", auth: { only: "user" } });
</script>
<template>
  <main class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 pointer-none-only [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 transition-[font-size] duration-200 flex gap-3 justify-between items-end bg-surface pin-top-blend m-0"
      >
        Page Layout
      </div>
    </header>
  </main>
</template>
