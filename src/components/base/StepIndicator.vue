<template>
  <div class="flex items-center gap-2">
    <span
      v-for="step in total"
      :key="step"
      class="h-2.5 w-2.5 rounded-full"
      :class="step === current ? 'bg-brand-500' : 'bg-brand-100'"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  current: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
</script>
