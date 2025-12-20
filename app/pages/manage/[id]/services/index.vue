<script setup lang="ts">
definePageMeta({ name: 'manage-biz-services', layout: 'common', auth: false });
const data = useBizStore();
</script>
<template>
  <main class="container-md">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1"
      style="min-height: 5.75rem; margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 flex gap-3 justify-between items-end surface-bg pin-top-blend m-0"
      >
        Services
        <NuxtLink
          :to="{ name: 'add-service', params: { id: $route.params.id } }"
          class="compact button"
        >
          Add a service
        </NuxtLink>
      </div>
    </header>
    <section class="body-sec">
      <p>
        Let customers discover your business by adding services to your Business
        Page on Bizworld.
      </p>
      <div class="services-grid">
        <PageService v-for="service in data.projects" :details="service" />
      </div>
    </section>
  </main>
</template>
