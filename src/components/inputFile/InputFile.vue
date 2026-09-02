<template>
  <div class="grid w-full grid-rows-1 gap-2">
    <div>
      <input
        ref="inputRef"
        type="file"
        class="hidden"
        :accept="accept"
        :disabled="disabled"
        @change="onFileSelected"
      >

      <div v-if="value" class="flex w-full items-center gap-4">
        <div class="flex flex-1 items-center justify-between rounded-lg border border-brand-500 bg-white p-3 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="relative flex h-11 w-9 flex-col items-center justify-center rounded border border-brand-100 bg-brand-50">
              <Icon :icon-types="iconType.Document" custom-class="h-6 w-6 text-brand-500" />
              <span class="absolute bottom-1 rounded bg-brand-500 px-1 text-[8px] font-bold text-white">
                {{ fileTypeLabel }}
              </span>
            </div>

            <div class="flex flex-col overflow-hidden">
              <span class="truncate text-sm font-normal text-ink-900" :title="value">
                {{ value }}
              </span>
              <span class="text-xs text-ink-500">{{ fileSizeLabel }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 text-ink-500">
            <button
              type="button"
              :disabled="disabled"
              class="rounded-md p-1.5 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50"
              title="Upload Ulang"
              @click="openFileBrowser"
            >
              <Icon :icon-types="iconType.Upload" custom-class="h-5 w-5" />
            </button>

            <button
              type="button"
              :disabled="disabled"
              class="rounded-md p-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
              title="Hapus"
              @click="removeFile"
            >
              <Icon :icon-types="iconType.Trash" custom-class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <button
        v-else
        type="button"
        :disabled="disabled"
        class="inline-flex items-center gap-2 rounded-md border border-brand-500 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
        @click="openFileBrowser"
      >
        <Icon :icon-types="iconType.Upload" custom-class="h-4 w-4" />
        Add file
      </button>

      <p v-if="hint" class="mt-1 text-xs text-ink-500">
        {{ hint }}
      </p>
      <ErrorMessages :errors="errors" />

      <AlertModal
        v-if="isSizeWarningVisible"
        title="Ukuran File Melewati Batas Maksimal"
        :message="`Maksimal ukuran file adalah ${maxSizeMb} MB`"
        @close="closeSizeWarning"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import * as yup from 'yup'
import ErrorMessages from '../ErrorMessages.vue'
import AlertModal from '@/components/base/AlertModal.vue'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'
import { formatFileSize } from '@/util/formatFileSize'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxSizeMb: {
    type: Number,
    default: 2,
  },
})

const selectedFile = defineModel<File | null>('file', { default: null })

const inputRef = ref<HTMLInputElement | null>(null)
const isSizeWarningVisible = ref(false)
const disabledRule = ref<yup.StringSchema<string | undefined>>()

refreshDisabledRule()

const { value, errors, validate, meta } = useField<string>(
  () => props.name,
  computed(() => disabledRule.value),
)

const fileSizeLabel = computed(() => formatFileSize(selectedFile.value?.size ?? 0))

const fileTypeLabel = computed(() => {
  const extension = value.value.split('.').pop() ?? ''
  return extension ? extension.toUpperCase().slice(0, 4) : 'FILE'
})

watch(
  () => props.disabled,
  () => {
    refreshDisabledRule()
  },
)

function refreshDisabledRule() {
  disabledRule.value = props.disabled
    ? yup.string()
    : props.required
      ? yup.string().required('File wajib diunggah')
      : yup.string()
}

function openFileBrowser() {
  inputRef.value?.click()
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  const maxSizeBytes = props.maxSizeMb * 1024 * 1024

  if (file && file.size > maxSizeBytes) {
    isSizeWarningVisible.value = true
    target.value = ''
    return
  }

  selectedFile.value = file
  value.value = file ? file.name : ''
}

function removeFile() {
  selectedFile.value = null
  value.value = ''
  if (inputRef.value) inputRef.value.value = ''
}

function closeSizeWarning() {
  isSizeWarningVisible.value = false
}

defineExpose({ meta, value, errors, validate })
</script>