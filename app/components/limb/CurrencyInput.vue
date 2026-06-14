<script lang="ts" setup>
const [model, modifiers] = defineModel({
  set(value: string) {
    value = value.replace(/[^\d.-]/g, "");
    if (modifiers.number) {
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue)) return numberValue;
      return undefined;
    }
    return value;
  },
  get(value: number | string | undefined) {
    if (value === undefined) return "";
    return Number(value).toLocaleString();
  },
});
function currencyFormat(e: Event) {
  let target = e.target as HTMLInputElement;
  let value = target.value;
  let formattedValue = "";
  // Remove non-numeric characters except decimal and optionally a minus sign
  value = value.replace(/[^\d.-]/g, "");

  // Format as currency
  if (value) {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) formattedValue = numberValue.toLocaleString();
    if (value.endsWith(".") && !formattedValue?.includes(".")) {
      formattedValue = formattedValue + ".";
    }
  }
  target.value = formattedValue || value;
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
