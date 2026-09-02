<template>
  <svg
    v-if="iconTypes === iconType.Info" viewBox="0 0 20 20" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <circle
      cx="10" cy="10" r="8" stroke="currentColor"
      stroke-width="1.4"
    />
    <path
      d="M7.9 7.6a2.1 2.1 0 114 .9c-.5.7-1.4 1-1.7 1.7-.1.3-.2.6-.2 1"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle cx="10" cy="14" r="0.9" fill="currentColor" />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Calendar" viewBox="0 0 20 20" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <rect
      x="3" y="4.5" width="14" height="12"
      rx="1.5" stroke="currentColor" stroke-width="1.4"
    />
    <path d="M3 8h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Upload" viewBox="0 0 24 24" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Download" viewBox="0 0 24 24" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Trash" viewBox="0 0 24 24" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Document" viewBox="0 0 24 24" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Chevron" viewBox="0 0 20 20" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.ChevronDouble" viewBox="0 0 20 20" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M5 5L10 10L15 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 10.5L10 15.5L15 10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Check" viewBox="0 0 20 20" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M4 10.5l3.5 3.5L16 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else-if="iconTypes === iconType.Warning" viewBox="0 0 24 24" fill="none" :class="customClass"
    aria-hidden="true"
  >
    <path d="M12 3l9 16.5H3L12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
    <path d="M12 10v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
import { iconType } from '@/models/enum/iconType'

defineProps({
  iconTypes: {
    type: String as () => iconType,
    required: true,
  },
  customClass: {
    type: String,
    default: 'w-4 h-4',
  },
})
</script>