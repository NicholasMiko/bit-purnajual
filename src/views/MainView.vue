<template>
  <SideBar v-model="isMenuOpen" />
  <TopBar v-model="isMenuOpen" />

  <div class="">
    <main class="mt-14">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideBar from '@/components/sideBar/SideBar.vue'
import TopBar from '@/components/topBar/TopBar.vue'
import { RouterView } from 'vue-router'

const isMenuOpen = ref(false)
</script>