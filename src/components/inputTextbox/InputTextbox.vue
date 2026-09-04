<template>
  <div class="grid w-full grid-rows-1 gap-2">
    <div>
      <input
        v-model="inputValue"
        type="text"
        v-bind="$attrs"
        :disabled="disabled"
        :placeholder="placeHolder"
        :readonly="isReadOnly"
        class="h-9 w-full rounded-md border p-2 text-sm shadow-xs focus:outline-none focus:ring-1"
        :class="[
          disabled
            ? 'border-brand-200 bg-ink-100 text-ink-500'
            : meta.touched && errors.length
              ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400'
              : 'border-brand-200 focus:border-brand-500 focus:ring-brand-500',
          externalClasses,
        ]"
        @blur="onBlur"
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
import { withDefaultGeneralInputTextRule } from '@/validations/generalRule.validation'
import { InputVariant } from '@/models/enum/inputVariant'
import { useTextCaseModel } from '@/composable/useTextCaseModel'

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
  asyncValidator: {
    type: Function as PropType<(value: string) => Promise<string | true>>,
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
  uppercase: {
    type: Boolean,
    default: false,
  },
  allowSpace: {
    type: Boolean,
    default: true,
  },
  allowSlash: {
    type: Boolean,
    default: true,
  },
  placeHolder: {
    type: String,
    default: '',
  },
})

defineModel<string>({ default: '' })

const isCheckingAsync = defineModel<boolean>('checking', { default: false })

const disabledRule = ref<yup.StringSchema<string | undefined>>()
const hasAsyncError = ref(false)

refreshDisabledRule()

const { value, errors, validate, meta, handleBlur, setErrors } = useField<string>(
  () => props.name,
  computed(() => disabledRule.value),
  { syncVModel: true },
)

const inputValue = useTextCaseModel(value, () => props.uppercase)

watch(
  () => props.disabled,
  () => {
    refreshDisabledRule()
  },
)

watch(value, () => {
  if (!hasAsyncError.value) return
  hasAsyncError.value = false
  validate()
})

function refreshDisabledRule() {
  const defaultRule = withDefaultGeneralInputTextRule(
    props.allowSpace,
    props.required,
    props.allowSlash,
    props.label || props.name,
  )
  const additionalRules = props.additionalRules as yup.StringSchema<string, yup.AnyObject, undefined, ''> | undefined

  disabledRule.value = props.disabled
    ? yup.string()
    : additionalRules
      ? defaultRule.concat(additionalRules)
      : defaultRule
}

async function onBlur() {
  handleBlur()

  if (!props.asyncValidator || props.disabled) return

  const currentValue = value.value?.trim() ?? ''
  if (!currentValue) return

  const result = await validate()
  if (!result.valid) return

  isCheckingAsync.value = true
  try {
    const asyncResult = await props.asyncValidator(currentValue)
    if (asyncResult === true) return

    hasAsyncError.value = true
    setErrors(asyncResult)
  } finally {
    isCheckingAsync.value = false
  }
}

defineExpose({ meta, value, errors, validate })
</script>