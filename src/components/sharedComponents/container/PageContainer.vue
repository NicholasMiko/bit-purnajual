<template>
  <div class="custom-scrollbar flex flex-col overflow-auto rounded-xl border border-ink-100 bg-panel">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
