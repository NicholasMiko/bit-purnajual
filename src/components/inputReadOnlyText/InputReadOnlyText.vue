<template>
  <div class="grid w-full grid-rows-1 gap-2">
    <div>
      <p class="text-sm text-ink-900">
        {{ value || placeHolder }}
      </p>
      <ErrorMessages :errors="errors" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import ErrorMessages from '../ErrorMessages.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
  type: String,
  default: '',
},
  required: {
    type: Boolean,
    default: false,
  },
  placeHolder: {
    type: String,
    default: '-',
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

function refreshDisabledRule() {
  disabledRule.value = props.required
    ? yup.string().trim().label(props.label || props.name).required('${path} wajib terisi')
    : yup.string().trim()
}

defineExpose({ meta, value, errors, validate })
</script>
