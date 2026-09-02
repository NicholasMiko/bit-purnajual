import { computed, type Ref } from 'vue'

export function useTextCaseModel(source: Ref<string>, uppercase: () => boolean) {
  return computed<string>({
    get: () => source.value ?? '',
    set: (newValue: string) => {
      source.value = uppercase() ? newValue.toUpperCase() : newValue
    },
  })
}
