<template>
  <div ref="rootRef" class="relative grid w-full grid-rows-1 gap-2">
    <div>
      <button
        type="button"
        :disabled="disabled"
        class="flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 text-left text-sm shadow-xs focus:outline-none focus:ring-1"
        :class="[
          disabled
            ? 'border-brand-500 bg-ink-100 text-ink-500'
            : errors.length
              ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400'
              : 'border-brand-500 focus:border-brand-500 focus:ring-brand-500',
          externalClasses,
        ]"
        @click="toggleCalendar"
      >
        <span :class="displayValue ? 'text-ink-900' : 'text-ink-500'">{{ displayValue || placeHolder }}</span>
        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand-500 text-white">
          <Icon :icon-types="iconType.Calendar" custom-class="h-3.5 w-3.5" />
        </span>
      </button>

      <div v-if="isCalendarOpen" class="absolute z-10 mt-1 w-72 rounded-md border border-brand-500 bg-white p-3 shadow-lg">
        <div class="mb-2 flex items-center justify-between">
          <button type="button" class="rounded px-2 py-1 text-ink-500 hover:bg-brand-50" @click="showPreviousMonth">
            &lsaquo;
          </button>
          <p class="text-sm font-medium capitalize text-ink-900">
            {{ monthLabel }}
          </p>
          <button type="button" class="rounded px-2 py-1 text-ink-500 hover:bg-brand-50" @click="showNextMonth">
            &rsaquo;
          </button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs text-ink-500">
          <span v-for="day in weekDays" :key="day">{{ day }}</span>
        </div>
        <div class="mt-1 grid grid-cols-7 gap-1">
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            type="button"
            :disabled="isDateDisabled(day.date)"
            class="rounded py-1 text-center text-xs"
            :class="[
              day.inCurrentMonth ? 'text-ink-900' : 'text-ink-300',
              isDateSelected(day.date) ? 'bg-brand-500 text-white' : 'hover:bg-brand-50',
              isDateDisabled(day.date) ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : '',
            ]"
            @click="selectDate(day.date)"
          >
            {{ day.date.getDate() }}
          </button>
        </div>
      </div>

      <ErrorMessages :errors="errors" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import * as yup from 'yup'
import ErrorMessages from '../ErrorMessages.vue'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'
import { InputVariant } from '@/models/enum/inputVariant'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  additionalRules: {
    type: Object,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  externalClasses: {
    type: [String, Array, Object],
    default: '',
  },
  variant: {
    type: String as PropType<InputVariant>,
    default: InputVariant.Default,
  },
  maxDate: {
    type: String,
    default: undefined,
  },
  placeHolder: {
    type: String,
    default: 'Select Date',
  },
})

defineModel<string>({ default: '' })

const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const rootRef = ref<HTMLElement | null>(null)
const isCalendarOpen = ref(false)
const viewDate = ref(new Date())
const disabledRule = ref<yup.StringSchema<string | undefined>>()

refreshDisabledRule()

const { value, errors, validate, meta } = useField<string>(
  () => props.name,
  computed(() => disabledRule.value),
  { syncVModel: true },
)

const displayValue = computed(() => {
  if (!value.value) return ''
  const formatted = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value.value))
  return formatted.toUpperCase()
})

const monthLabel = computed(() =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(viewDate.value),
)

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const startOffset = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const days: { date: Date; inCurrentMonth: boolean }[] = []

  for (let index = 0; index < startOffset; index += 1) {
    days.push({ date: new Date(year, month, index - startOffset + 1), inCurrentMonth: false })
  }
  for (let day = 1; day <= totalDays; day += 1) {
    days.push({ date: new Date(year, month, day), inCurrentMonth: true })
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date
    days.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inCurrentMonth: false })
  }
  return days
})

watch(
  () => props.disabled,
  () => {
    refreshDisabledRule()
  },
)

onMounted(() => document.addEventListener('click', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', handleDocumentClick))

function refreshDisabledRule() {
  if (props.disabled) {
    disabledRule.value = yup.string()
    return
  }

  let baseRule = yup.string().test('not-future', 'Tanggal pembelian tidak boleh di masa depan', (selected) => {
    if (!selected || !props.maxDate) return true
    return selected <= props.maxDate
  })

  if (props.required) {
    baseRule = baseRule.required('Tanggal pembelian wajib diisi')
  }

  const additionalRules = props.additionalRules as yup.StringSchema<string, yup.AnyObject, undefined, ''> | undefined
  disabledRule.value = additionalRules ? baseRule.concat(additionalRules) : baseRule
}

function toDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isDateDisabled(date: Date) {
  return !!props.maxDate && toDateString(date) > props.maxDate
}

function isDateSelected(date: Date) {
  return !!value.value && toDateString(date) === value.value
}

function selectDate(date: Date) {
  if (isDateDisabled(date)) return
  value.value = toDateString(date)
  isCalendarOpen.value = false
}

function showPreviousMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

function showNextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

function toggleCalendar() {
  if (props.disabled) return
  isCalendarOpen.value = !isCalendarOpen.value
}

function handleDocumentClick(event: MouseEvent) {
  if (!isCalendarOpen.value) return
  if (!rootRef.value?.contains(event.target as Node)) isCalendarOpen.value = false
}

defineExpose({ meta, value, errors, validate })
</script>
