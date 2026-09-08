<template>
  <main>
    <RouterView />
  </main>
  <Notification />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Notification from '@/components/sharedComponents/notification/Notification.vue'
</script>