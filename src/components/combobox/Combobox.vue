<template>
  <div class="grid w-full grid-rows-1 gap-2">
    <div>
      <div class="relative">
        <select
          :id="name"
          v-model="value"
          :disabled="disabled"
          class="h-9 w-full appearance-none rounded-md border bg-white px-3 pr-10 text-sm shadow-xs focus:outline-none focus:ring-1"
          :class="[
            disabled
              ? 'border-brand-500 bg-ink-100 text-ink-500'
              : meta.touched && errors.length
                ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400'
                : 'border-brand-500 focus:border-brand-500 focus:ring-brand-500',
            externalClasses,
          ]"
          @change="onSelectChange"
        >
          <option disabled hidden value="">
            {{ placeHolder }}
          </option>
          <option v-for="(option, index) in options" :key="index" :value="valueKey ? option[valueKey] : option">
            {{ option[labelKey] }}
          </option>
        </select>

        <span
          class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          :class="disabled ? 'text-ink-300' : 'text-brand-500'"
        >
          <Icon :icon-types="iconType.Chevron" custom-class="h-4 w-4" />
        </span>
      </div>

      <ErrorMessages :errors="errors" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { useField } from 'vee-validate'
import { computed, ref, watch, type PropType } from 'vue'
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
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  additionalRules: {
    type: Object,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as PropType<T[]>,
    required: true,
  },
  valueKey: {
    type: String,
    default: undefined,
  },
  labelKey: {
    type: String,
    required: true,
  },
  externalClasses: {
    type: [String, Array, Object],
    default: '',
  },
  variant: {
    type: String as PropType<InputVariant>,
    default: InputVariant.Default,
  },
  placeHolder: {
    type: String,
    default: 'Select an option',
  },
})

const emit = defineEmits<{ selected: [option: T] }>()

defineModel<string>({ default: '' })

const disabledRule = ref<yup.StringSchema<string | undefined>>()

refreshDisabledRule()

const { value, errors, validate, meta } = useField<string>(
  () => props.name,
  computed(() => disabledRule.value),
  { syncVModel: true },
)

watch(
  () => [props.disabled, props.additionalRules],
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
    ? yup.string().trim().label(props.label || props.name).required('${path} wajib dipilih')
    : yup.string().trim().label(props.label || props.name)
  const additionalRules = props.additionalRules as yup.StringSchema<string, yup.AnyObject, undefined, ''> | undefined

  disabledRule.value = additionalRules ? baseRule.concat(additionalRules) : baseRule
}

function onSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement
  const selected = props.options[select.selectedIndex - 1]
  if (selected) emit('selected', selected)
}

defineExpose({ meta, value, errors, validate })
</script>