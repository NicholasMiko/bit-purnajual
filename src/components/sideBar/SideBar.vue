<template>
  <SlideBar v-model:show="isMenuOpen" direction="left" panel-class="top-[3.55em] h-[calc(100vh-3.55em)]">
    <aside class="h-full w-64 overflow-y-auto bg-cyan-900 pb-2 pl-5 pr-7 pt-4 text-white">
      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.to"
          class="rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10"
          active-class="bg-white/15 font-semibold"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
  </SlideBar>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SlideBar from '../slideBar/SlideBar.vue'

const isMenuOpen = defineModel<boolean>({ default: false })

const menuItems = [
  {
    label: 'Registrasi Garansi Pembelian',
    to: { name: 'warrantyregistration-create', params: { step: 'step1' } },
  },
]

function closeMenu() {
  isMenuOpen.value = false
}
</script>