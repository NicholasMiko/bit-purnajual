<template>
  <InputStringNumber
    v-model="modelValue"
    :name="name"
    :disabled="disabled"
    :required="required"
    :is-read-only="isReadOnly"
    :external-classes="externalClasses"
    :variant="variant"
    :additional-rules="rules"
    :placeholder="placeholder"
    :group-pattern="[4, 4, 4]"
  />
</template>

<script setup lang="ts">
import * as yup from 'yup'
import InputStringNumber from '../inputStringNumber/InputStringNumber.vue'
import { computed, type PropType } from 'vue'
import { InputVariant } from '@/models/enum/inputVariant'

const modelValue = defineModel<string>({ default: '' })

const props = defineProps({
  name: {
    type: String,
    required: true,
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
  phoneLength: {
    type: Number,
    default: 12,
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const errorMessage = computed(() => `Nomor telepon harus diawali 08 dan ${props.phoneLength} digit`)

const rules = computed(() =>
  yup.string().test('phone-format', errorMessage.value, (value) => {
    if (!value) return true
    const isNumericOnly = /^\d+$/.test(value)
    const startsWithZeroEight = value.startsWith('08')
    const hasExactLength = value.length === props.phoneLength
    return isNumericOnly && startsWithZeroEight && hasExactLength
  }),
)
</script>
