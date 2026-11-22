<script lang="ts" setup>
definePageMeta({
  name: "add-product",
  layout: "details",
  auth: { only: "user" },
  noCart: true,
});
</script>

<template>
  <ProductForm />
</template>
