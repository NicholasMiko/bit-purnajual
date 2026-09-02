<template>
  <span :class="badgeClass">{{ status }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  toneMap: {
    type: Object as () => Record<string, string>,
    default: () => ({}),
  },
})

const badgeClass = computed(
  () => `rounded-full px-2.5 py-1 text-xs font-medium ${props.toneMap[props.status] ?? 'bg-ink-100 text-ink-700'}`,
)
</script>
