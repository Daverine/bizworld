<script lang="ts" setup></script>
<template>
  <div class="pointing dropdown menu h-[calc(100vh-84px)] max-h-150 w-75">
    <div class="flex h-full flex-col p-4">
      <div class="flex flex-1 flex-col items-center justify-center gap-3">
        <Icon
          name="material-symbols:notifications-off-outline-rounded"
          class="text-surface-v2 text-8xl"
        />
        <span class="text">You have no new notifications.</span>
      </div>
      <div class="transparent compact divider"></div>
      <div class="item">
        <button class="button w-full">View all</button>
      </div>
    </div>
  </div>
</template>
<style></style>
