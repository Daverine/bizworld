<script lang="ts" setup>
const expanded = ref<boolean | any>(false);

function toggle(key?: any) {
  if (key !== undefined) {
    expanded.value = key === expanded.value ? false : key;
  } else {
    expanded.value = expanded.value ? false : true;
  }
}
</script>
<template>
  <slot :expanded :toggle />
</template>
