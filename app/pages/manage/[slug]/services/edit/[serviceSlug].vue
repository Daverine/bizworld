<script lang="ts" setup>
definePageMeta({
  name: "edit-service",
  layout: "details",
  auth: { only: "user" },
  noCart: true,
});
</script>

<template>
  <ServiceForm :slug="$route.params.serviceSlug as string" />
</template>
