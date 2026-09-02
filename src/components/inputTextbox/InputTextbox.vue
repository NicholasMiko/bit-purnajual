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
import { withDefaultGeneralInputTextRule } from '@/validations/general-rule.validation'
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
    default: true,
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

const disabledRule = ref<yup.StringSchema<string | undefined>>()

refreshDisabledRule()

const { value, errors, validate, meta } = useField<string>(
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

function refreshDisabledRule() {
  const defaultRule = withDefaultGeneralInputTextRule(props.allowSpace, props.required, props.allowSlash, props.label || props.name)
  const additionalRules = props.additionalRules as yup.StringSchema<string, yup.AnyObject, undefined, ''> | undefined

  disabledRule.value = props.disabled
    ? yup.string()
    : additionalRules
      ? defaultRule.concat(additionalRules)
      : defaultRule
}

defineExpose({ meta, value, errors, validate })
</script>
