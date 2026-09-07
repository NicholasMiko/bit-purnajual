<template>
  <div
    ref="popUpRef"
    class="fixed z-50 w-80 rounded-xl border border-ink-100 bg-white p-3 shadow-xl"
    :style="popUpStyle"
  >
    <div class="flex min-h-40 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
      <img v-if="currentStep.image" :src="currentStep.image" :alt="currentStep.title" class="max-h-40 w-full object-contain">
      <p v-else class="px-4 text-center text-sm font-semibold text-ink-700">
        {{ currentStep.title }}
      </p>
    </div>

    <p v-if="currentStep.description" class="mt-2 text-xs text-ink-500">
      {{ currentStep.description }}
    </p>

    <div class="mt-3 flex items-center justify-between gap-3">
      <button
        type="button"
        class="rounded-md bg-brand-500 px-5 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand-600"
        @click="emit('close')"
      >
        Got it
      </button>

      <div v-if="hasMultipleSteps" class="flex items-center gap-2 text-xs text-ink-700">
        <button
          type="button"
          class="rounded px-1 hover:bg-ink-100 disabled:opacity-30"
          :disabled="isFirstStep"
          @click="showPreviousStep"
        >
          &#9664;
        </button>
        <span>{{ currentIndex + 1 }} of {{ steps.length }}</span>
        <button
          type="button"
          class="rounded px-1 hover:bg-ink-100 disabled:opacity-30"
          :disabled="isLastStep"
          @click="showNextStep"
        >
          &#9654;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuideStepModel } from '@/models/guide-step';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'


const props = defineProps({
  steps: {
    type: Array as () => GuideStepModel[],
    default: () => [],
  },
  anchor: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  gap: {
    type: Number,
    default: 10,
  },
  margin: {
    type: Number,
    default: 16,
  },
})

const emit = defineEmits<{ close: [] }>()

const popUpRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const popUpStyle = ref<{ top: string; left: string; visibility: 'hidden' | 'visible' }>({
  top: '0px',
  left: '0px',
  visibility: 'hidden',
})
const hasMultipleSteps = computed(() => props.steps.length > 1)
const isFirstStep = computed(() => currentIndex.value === 0)
const isLastStep = computed(() => currentIndex.value === props.steps.length - 1)
const currentStep = computed(() => props.steps[currentIndex.value] ?? { title: '' })

onMounted(async () => {
  await nextTick()
  updatePosition()
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscape)
})

function updatePosition() {
  const anchorElement = props.anchor
  const popUpElement = popUpRef.value
  if (!anchorElement || !popUpElement) return

  const anchorRect = anchorElement.getBoundingClientRect()
  const popUpWidth = popUpElement.offsetWidth
  const popUpHeight = popUpElement.offsetHeight
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let left = anchorRect.left
  const spaceBelow = viewportHeight - anchorRect.bottom
  const spaceAbove = anchorRect.top
  const fitsBelow = spaceBelow >= popUpHeight + props.gap + props.margin
  const fitsAbove = spaceAbove >= popUpHeight + props.gap + props.margin

  let top = fitsBelow || !fitsAbove ? anchorRect.bottom + props.gap : anchorRect.top - popUpHeight - props.gap

  if (left + popUpWidth > viewportWidth - props.margin) {
    left = anchorRect.right - popUpWidth
  }

  if (left < props.margin) {
    left = props.margin
  }

  if (left + popUpWidth > viewportWidth - props.margin) {
    left = viewportWidth - popUpWidth - props.margin
  }

  if (top < props.margin) {
    top = props.margin
  }

  if (top + popUpHeight > viewportHeight - props.margin) {
    top = viewportHeight - popUpHeight - props.margin
  }

  popUpStyle.value = { top: `${top}px`, left: `${left}px`, visibility: 'visible' }
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as Node
  if (popUpRef.value?.contains(target)) return
  if (props.anchor?.contains(target)) return
  emit('close')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

function showPreviousStep() {
  if (!isFirstStep.value) currentIndex.value -= 1
}

function showNextStep() {
  if (!isLastStep.value) currentIndex.value += 1
}
</script>