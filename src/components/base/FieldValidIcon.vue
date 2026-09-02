<template>
  <span
    v-if="isChecking"
    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-brand-100 border-t-brand-500 motion-safe:animate-spin"
  />
  <span
    v-else-if="isValid"
    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
  >
    <Icon :icon-types="iconType.Check" custom-class="h-4 w-4" />
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsFieldValid, useFieldValue } from 'vee-validate'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  checkDelay: {
    type: Number,
    default: 500,
  },
})

const fieldValue = useFieldValue<string>(() => props.name)
const fieldValid = useIsFieldValid(() => props.name)

const isChecking = ref(false)
let checkTimer: ReturnType<typeof setTimeout> | undefined

const isFilled = computed(() => {
  const currentValue = fieldValue.value
  return typeof currentValue === 'string' ? currentValue.trim().length > 0 : currentValue != null
})

const isValid = computed(() => isFilled.value && fieldValid.value)

watch(fieldValue, () => {
  clearCheckTimer()

  if (!isFilled.value) {
    isChecking.value = false
    return
  }

  isChecking.value = true
  checkTimer = setTimeout(() => {
    isChecking.value = false
  }, props.checkDelay)
})

onBeforeUnmount(() => {
  clearCheckTimer()
})

function clearCheckTimer() {
  if (checkTimer) clearTimeout(checkTimer)
  checkTimer = undefined
}
</script>