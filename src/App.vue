<template>
  <div class="min-h-screen bg-canvas font-sans text-ink-900">
    <main class="mx-auto max-w-5xl px-8 py-10">
      <RouterView />
    </main>
    <Notification />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Notification from '@/components/sharedComponents/notification/Notification.vue'
</script>