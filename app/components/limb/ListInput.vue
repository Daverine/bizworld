<script lang="ts" setup>
const items = ref<Record<string, any>>({});
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    rootElement?: string;
  }>(),
  { placeholder: "Add text...", rootElement: "div" },
);

defineModel({
  set(value: typeof items.value) {
    return Object.values(value);
  },
  get(value: string[]) {
    return value.reduce(
      (acc, item, index) => {
        acc[index] = item;
        return acc;
      },
      {} as typeof items.value,
    );
  },
});

function addItem(item: {}) {
  if (!Object.values(items.value).includes(item)) {
    items.value[Object.keys(items.value).length] = item;
  }
}
function removeItem(index: string) {
  delete items.value[index];
}
function clearItems() {
  items.value = {};
}
function inputHandler(e: KeyboardEvent) {
  const target = e.target as HTMLInputElement;
  if (e.key === "Enter" && target.value && target.value.trim() !== "") {
    addItem(target.value.trim());
    target.value = "";
  } else if (target.matches(":focus") && !target.value && e.key == "Backspace") {
    const lastItem = Object.keys(items.value).at(-1);
    if (lastItem) delete items.value[lastItem];
  }
}
</script>
<template>
  <component :is="rootElement" tabindex="0" :class="{ 'form-item list-box': !$slots.default }">
    <slot :items :addItem :removeItem :clearItems :inputHandler>
      <div v-for="(data, index) in items" :key="index" :data-ddid="index" class="chip">
        {{ data }}
        <Icon @click="removeItem(index)" class="trailing" name="material-symbols:close-rounded" />
      </div>
      <input
        class="form-item compact lined field-sizing-content min-w-8"
        :placeholder
        @keydown="inputHandler"
        autocomplete="off"
      />
    </slot>
  </component>
</template>
<style>
.list-box {
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em 0.2em;
  padding-top: calc(var(--form-tb-padding) / 2);
  padding-bottom: calc(var(--form-tb-padding) / 2);
}
</style>
