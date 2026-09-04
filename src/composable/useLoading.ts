import { computed, ref } from 'vue'

const activeRequests = ref<number[]>([])
let nextLoadingId = 1

export function useLoading() {
  const isLoading = computed(() => activeRequests.value.length > 0)

  function startLoading(): number {
    const loadingId = nextLoadingId
    nextLoadingId += 1
    activeRequests.value = [...activeRequests.value, loadingId]
    return loadingId
  }

  function finishLoading(loadingId: number) {
    activeRequests.value = activeRequests.value.filter((item) => item !== loadingId)
  }

  return { isLoading, startLoading, finishLoading }
}