<template>
  <SlideBar v-model:show="isMenuOpen" direction="left" panel-class="top-[3.55em] h-[calc(100vh-3.55em)]">
    <aside class="h-full w-64 overflow-y-auto bg-cyan-900 pb-2 pl-5 pr-7 pt-4 text-white">
      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="rounded-md px-3 py-2 text-xl"
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
  { name: 'warrantyregistration-create', label: 'Registrasi Garansi Pembelian' },
  { name: 'service-tickets', label: 'Tiket Servis' },
  { name: 'test', label: 'Test' },
]

function closeMenu() {
  isMenuOpen.value = false
}
</script>