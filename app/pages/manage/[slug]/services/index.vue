<script setup lang="ts">
definePageMeta({ name: "manage-biz-services", layout: "common", auth: false });
const data = useBizStore();
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
        Services
        <NuxtLink
          :to="{ name: 'add-service', params: { slug: $route.params.slug } }"
          class="compact button"
        >
          Add a service
        </NuxtLink>
      </div>
    </header>
    <section>
      <p>
        Let customers discover your business by adding services to your Business Page on Bizworld.
      </p>
      <div class="services-grid">
        <PageService v-for="service in data.projects" :details="service" />
      </div>
    </section>
  </main>
</template>
