<template>
  <button
    v-if="isVisible"
    type="button"
    class="fixed bottom-8 right-8 z-20 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-lg hover:bg-brand-50"
    @click="scrollToTarget"
  >
    {{ label }}
    <Icon :icon-types="iconType.Chevron" custom-class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'

const props = defineProps({
  targetRef: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  label: {
    type: String,
    default: 'Konfirmasi',
  },
})

const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  startObserving()
})

onBeforeUnmount(() => {
  stopObserving()
})

watch(
  () => props.targetRef,
  () => {
    stopObserving()
    startObserving()
  },
)

function startObserving() {
  if (!props.targetRef) return
  observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !entry.isIntersecting
    },
    { threshold: 0.1 },
  )
  observer.observe(props.targetRef)
}

function stopObserving() {
  observer?.disconnect()
  observer = null
}

function scrollToTarget() {
  props.targetRef?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
