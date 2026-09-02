<template>
  <div class="grid w-full grid-rows-1 gap-2">
    <div>
      <input
        v-model="displayValue"
        type="text"
        :disabled="disabled"
        :readonly="isReadOnly"
        :placeholder="placeholder"
        class="h-9 w-full rounded-md border p-2 text-sm shadow-xs focus:outline-none focus:ring-1"
        :class="[
          disabled
            ? 'border-brand-500 bg-ink-100 text-ink-500'
            : errors.length
              ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400'
              : 'border-brand-500 focus:border-brand-500 focus:ring-brand-500',
          externalClasses,
        ]"
      >
      <ErrorMessages :errors="errors" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, ref, watch, type PropType } from 'vue'
import * as yup from 'yup'
import ErrorMessages from '../ErrorMessages.vue'
import { InputVariant } from '@/models/enum/inputVariant'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
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
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  groupPattern: {
  type: Array as () => number[],
  default: undefined,
},
})

defineModel<string>({ default: '' })

const disabledRule = ref<yup.StringSchema<string | undefined>>()

refreshDisabledRule()

const { value, errors, validate, meta } = useField<string>(
  () => props.name,
  computed(() => disabledRule.value),
  { syncVModel: true },
)

watch(
  () => props.disabled,
  () => {
    refreshDisabledRule()
  },
)

function refreshDisabledRule() {
  if (props.disabled) {
    disabledRule.value = yup.string()
    return
  }

  const baseRule = props.required
    ? yup.string().trim().label(props.label || props.name).required('${path} wajib diisi')
    : yup.string().trim()
  const additionalRules = props.additionalRules as yup.StringSchema<string, yup.AnyObject, undefined, ''> | undefined

  disabledRule.value = additionalRules ? baseRule.concat(additionalRules) : baseRule
}

const displayValue = computed({
  get: () => formatGroup(value.value ?? ''),
  set: (input: string) => {
    value.value = input.replace(/\D/g, '')
  },
})

function formatGroup(raw: string) {
  if (!props.groupPattern || !raw) return raw
  const digits = raw.replace(/\D/g, '')
  const parts: string[] = []
  let position = 0
  for (const size of props.groupPattern) {
    if (position >= digits.length) break
    parts.push(digits.slice(position, position + size))
    position += size
  }
  if (position < digits.length) parts.push(digits.slice(position))
  return parts.join('-')
}

defineExpose({ meta, value, errors, validate })
</script>
