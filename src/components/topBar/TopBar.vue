<template>
  <div class="fixed left-0 top-0 z-10 w-full">
    <header class="flex items-center justify-between bg-white shadow-md">
      <div class="flex h-[3.5em] w-[6.3em] justify-center">
        <button type="button" :disabled="disabled" @click="toggleMenu">
          <span class="m-auto mb-0.5 block h-[0.15em] w-4 rounded bg-gray-500" />
          <span class="m-auto mb-0.5 block h-[0.15em] w-4 rounded bg-gray-500" />  
          <span class="m-auto block h-[0.15em] w-4 rounded bg-gray-500" />
        </button>
      </div>
      <TitleMenu />
    </header>
  </div>
</template>

<script setup lang="ts">
import TitleMenu from '../TitleMenu.vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const isMenuOpen = defineModel<boolean>({ default: false })

function toggleMenu() {
  if (props.disabled) return
  isMenuOpen.value = !isMenuOpen.value
}
</script>