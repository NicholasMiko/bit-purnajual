<template>
  <p v-for="(error, index) in errors" :key="index" class="mt-1 text-xs text-rose-600">
    {{ error }}
  </p>
</template>

<script setup lang="ts">
defineProps({
  errors: {
    type: Array as () => string[],
    default: () => [],
  },
})
</script>
