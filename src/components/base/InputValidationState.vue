<template>
  <span
    v-if="showSpinner"
    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-4 border-brand-200 border-t-brand-500 motion-safe:animate-spin"
  />
  <span
    v-else-if="showCheck"
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
  deferred: {
    type: Boolean,
    default: false,
  },
  checking: {
    type: Boolean,
    default: false,
  },
})

const fieldValue = useFieldValue<string>(() => props.name)
const fieldValid = useIsFieldValid(() => props.name)

const isTimerRunning = ref(false)
const hasCompletedCheck = ref(false)
let checkTimer: ReturnType<typeof setTimeout> | undefined

const isFilled = computed(() => {
  const currentValue = fieldValue.value
  return typeof currentValue === 'string' ? currentValue.trim().length > 0 : currentValue != null
})

const showSpinner = computed(() => (props.deferred ? props.checking : isTimerRunning.value))

const showCheck = computed(() => {
  if (!isFilled.value || !fieldValid.value) return false
  if (props.deferred) return !props.checking && hasCompletedCheck.value
  return !isTimerRunning.value
})

watch(fieldValue, () => {
  hasCompletedCheck.value = false

  if (props.deferred) return

  clearCheckTimer()

  if (!isFilled.value) {
    isTimerRunning.value = false
    return
  }

  isTimerRunning.value = true
  checkTimer = setTimeout(() => {
    isTimerRunning.value = false
  }, props.checkDelay)
})

watch(
  () => props.checking,
  (isChecking, wasChecking) => {
    if (wasChecking && !isChecking) hasCompletedCheck.value = true
  },
)

onBeforeUnmount(() => {
  clearCheckTimer()
})

function clearCheckTimer() {
  if (checkTimer) clearTimeout(checkTimer)
  checkTimer = undefined
}
</script>