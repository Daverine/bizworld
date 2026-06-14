<script setup lang="ts">
definePageMeta({ name: "manage-biz-services", layout: "common", auth: false });
const data = useBizStore();
</script>
<template>
  <main class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 self-pointer-none [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 transition-[font-size] duration-200 flex gap-3 justify-between items-end bg-surface pin-top-blend m-0"
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
