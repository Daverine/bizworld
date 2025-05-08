<script setup>
definePageMeta({ layout: 'biz-pages', name: 'biz-services' });
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
</script>

<template>
  <main v-if="isReady" class="services-main">
    <div class="heading">Services from us</div>
    <div class="services-grid">
      <PageService v-for="service in data.projects" :details="service" />
    </div>
  </main>
</template>

<style>
.services-main {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.services-grid {
  display: grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(auto-fill, minmax(34rem, 1fr));
  gap: 1rem;
  padding-bottom: 3rem;
  width: 100%;
}
</style>
