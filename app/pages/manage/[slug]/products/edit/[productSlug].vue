<script lang="ts" setup>
definePageMeta({
  name: "edit-product",
  layout: "details",
  auth: { only: "user" },
  noCart: true,
});
</script>

<template>
  <ProductForm :slug="$route.params.productSlug as string" />
</template>
