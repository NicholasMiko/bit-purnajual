<template>
  <div class="grid grid-cols-12 items-center gap-4 py-3">
    <div class="col-span-12 sm:col-span-3">
      <slot name="label">
        <div class="font-semibold text-ink-700">
          <label v-if="label">{{ label }}</label>

          <span v-if="tooltipString || hasGuide" class="group relative ml-1 inline-block align-middle">
            <button
              ref="tooltipIconRef"
              type="button"
              class="align-middle text-ink-500 hover:text-brand-500"
              :class="{ 'cursor-default': !hasGuide }"
              @click="toggleGuide"
            >
              <Icon :icon-types="iconType.Info" custom-class="h-4 w-4" />
            </button>

            <span
              v-if="tooltipString && !isGuideOpen"
              class="invisible absolute left-1/2 top-full z-30 mt-2 w-44 -translate-x-1/2 rounded-md bg-ink-950
                     px-2 py-1.5 text-center text-xs font-normal text-white opacity-0 transition
                     group-hover:visible group-hover:opacity-100"
            >
              {{ tooltipString }}
            </span>
          </span>
        </div>
      </slot>
      <div v-if="hint && !$slots.label">
        <span class="text-sm italic text-ink-500">{{ hint }}</span>
      </div>
    </div>

    <div :class="contentColSpan ?? ['col-span-12', !withoutAfter ? 'sm:col-span-8' : 'sm:col-span-9']">
      <slot />
    </div>

    <div v-if="!withoutAfter" class="col-span-12 flex sm:col-span-1">
      <slot name="after" />
    </div>

    <GuidePopUp v-if="isGuideOpen" :steps="guideSteps" :anchor="tooltipIconRef" @close="closeGuide" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import GuidePopUp from '@/components/base/GuidePopUp.vue'
import { iconType } from '@/models/enum/iconType'
import type { GuideStepModel } from '@/models/guide-step'


const props = defineProps({
  label: {
    type: String,
    default: undefined,
  },
  hint: {
    type: String,
    default: undefined,
  },
  withoutAfter: {
    type: Boolean,
    default: false,
  },
  tooltipString: {
    type: String,
    default: undefined,
  },
  contentColSpan: {
    type: String,
    default: undefined,
  },
  guideSteps: {
    type: Array as () => GuideStepModel[],
    default: () => [],
  },
})

const tooltipIconRef = ref<HTMLElement | null>(null)
const isGuideOpen = ref(false)

const hasGuide = computed(() => props.guideSteps.length > 0)

function toggleGuide() {
  if (!hasGuide.value) return
  isGuideOpen.value = !isGuideOpen.value
}

function closeGuide() {
  isGuideOpen.value = false
}
</script>