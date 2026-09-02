<template>
  <div v-if="file" class="max-w-sm overflow-hidden rounded-lg border border-gray-300">
    <img v-if="previewUrl" :src="previewUrl" :alt="file.name" class="max-h-64 w-full bg-ink-100 object-contain">
    <div class="flex items-center justify-between gap-3 border-t border-brand-500 px-3 py-2">
      <div class="flex min-w-0 items-center gap-3">
        <div class="relative flex h-11 w-9 shrink-0 flex-col items-center justify-center rounded border border-brand-100 bg-brand-50">
          <Icon :icon-types="iconType.Document" custom-class="h-6 w-6 text-brand-200" />
          <span class="absolute bottom-1 rounded bg-brand-500 px-1 text-[8px] font-bold text-white">
            {{ fileTypeLabel }}
          </span>
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm text-ink-900" :title="file.name">
            {{ file.name }}
          </p>
          <p class="text-xs text-ink-500">
            {{ fileSizeLabel }}
          </p>
        </div>
      </div>
      <a
        :href="previewUrl ?? undefined"
        :download="file.name"
        class="shrink-0 rounded-md p-1.5 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
        title="Download"
      >
        <Icon :icon-types="iconType.Download" custom-class="h-5 w-5" />
      </a>
    </div>
  </div>
  <p v-else class="text-sm text-ink-500">
    &mdash;
  </p>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'
import { formatFileSize } from '@/util/formatFileSize'

const props = defineProps({
  file: {
    type: Object as () => File | null,
    default: null,
  },
})

const previewUrl = ref<string | null>(null)

const fileSizeLabel = computed(() => formatFileSize(props.file?.size ?? 0))

const fileTypeLabel = computed(() => {
  const extension = props.file?.name.split('.').pop() ?? ''
  return extension ? extension.toUpperCase().slice(0, 4) : 'FILE'
})

watch(
  () => props.file,
  (file) => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>