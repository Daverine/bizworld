<script setup>
definePageMeta({ name: "manage-biz-support", layout: "common", auth: { only: "user" } });
</script>
<template>
  <main class="auto-contain max-w-180">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 self-pointer-none mb-4 min-h-23 [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 bg-surface shadow-t-blend m-0 flex items-end justify-between gap-3 transition-[font-size] duration-200"
      >
        Support
      </div>
    </header>
  </main>
</template>
