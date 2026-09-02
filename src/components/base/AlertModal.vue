<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4">
    <div class="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <Icon :icon-types="iconType.Warning" custom-class="h-6 w-6" />
      </div>
      <h2 class="text-lg font-semibold text-ink-950">
        {{ title }}
      </h2>
      <p class="mt-2 text-sm text-ink-500">
        {{ message }}
      </p>
      <button
        type="button"
        class="mt-6 w-full rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
        @click="emit('close')"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'

defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{ close: [] }>()
</script>
