<template>
  <div class="grid w-full grid-rows-1 gap-2">
    <div>
      <input
        v-model="value"
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

  let baseRule = yup
    .string()
    .trim()
    .test('valid-email', 'Format email tidak valid', (value) => {
      if (!value) return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    })

  if (props.required) {
    baseRule = baseRule.required('Email wajib diisi')
  }

  const additionalRules = props.additionalRules as yup.StringSchema<string, yup.AnyObject, undefined, ''> | undefined
  disabledRule.value = additionalRules ? baseRule.concat(additionalRules) : baseRule
}

defineExpose({ meta, value, errors, validate })
</script>
