<script lang="ts" setup>
const model = defineModel({
  set(value: string) {
    value = value.replace(/[^0-9]/g, '');
    if (value) return parseFloat(value);
    return;
  },
  get(value: number | undefined) {
    if (value) return value.toLocaleString();
    return '';
  },
});
function currencyFormat(e: Event) {
  let target = e.target as HTMLInputElement;
  let value = target.value;
  // Remove non-numeric characters except decimal and optionally a minus sign
  value = value.replace(/[^0-9]/g, '');

  // Format as currency
  if (value) {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) value = numberValue.toLocaleString();
  }
  target.value = value;
}
</script>
<template>
  <input
    type="text"
    inputmode="decimal"
    autocomplete="off"
    @input="currencyFormat"
    v-model="model"
  />
</template>
