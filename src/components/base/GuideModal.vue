<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
      <div class="flex min-h-64 items-center justify-center rounded-xl bg-ink-100 p-8">
        <p class="text-center text-xl font-semibold text-ink-700">
          {{ currentStep.title }}
        </p>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          class="rounded-md bg-brand-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-600"
          @click="emit('close')"
        >
          Got it
        </button>

        <div v-if="hasMultipleSteps" class="flex items-center gap-3 text-sm text-ink-700">
          <button
            type="button"
            class="rounded p-1 hover:bg-ink-100 disabled:opacity-30"
            :disabled="isFirstStep"
            @click="showPreviousStep"
          >
            &#9664;
          </button>
          <span>{{ currentIndex + 1 }} of {{ steps.length }}</span>
          <button
            type="button"
            class="rounded p-1 hover:bg-ink-100 disabled:opacity-30"
            :disabled="isLastStep"
            @click="showNextStep"
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GuideStepModel } from '@/models/guide-step.model'

const props = defineProps({
  steps: {
    type: Array as () => GuideStepModel[],
    default: () => [],
  },
})

const emit = defineEmits<{ close: [] }>()

const currentIndex = ref(0)

const hasMultipleSteps = computed(() => props.steps.length > 1)
const isFirstStep = computed(() => currentIndex.value === 0)
const isLastStep = computed(() => currentIndex.value === props.steps.length - 1)
const currentStep = computed(() => props.steps[currentIndex.value] ?? { title: '' })

function showPreviousStep() {
  if (!isFirstStep.value) currentIndex.value -= 1
}

function showNextStep() {
  if (!isLastStep.value) currentIndex.value += 1
}
</script>