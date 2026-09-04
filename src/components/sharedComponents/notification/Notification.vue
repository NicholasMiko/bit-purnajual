<template>
  <div class="fixed bottom-4 right-4 z-50 w-80 space-y-2">
    <TransitionGroup name="slide-fade" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center rounded-lg border border-l-4 bg-white p-4 shadow-lg"
        :class="{
          'border-l-brand-500': notification.type === MessageType.Success,
          'border-l-rose-500': notification.type === MessageType.Failed,
          'border-l-amber-500': notification.type === MessageType.Warning,
          'border-l-ink-300': notification.type === MessageType.Info,
        }"
      >
        <div
          class="mr-3 flex items-center rounded-full p-2 text-white"
          :class="{
            'bg-brand-500': notification.type === MessageType.Success,
            'bg-rose-500': notification.type === MessageType.Failed,
            'bg-amber-500': notification.type === MessageType.Warning,
            'bg-ink-300': notification.type === MessageType.Info,
          }"
        >
          <Icon v-if="notification.type === MessageType.Success" :icon-types="iconType.Check" custom-class="h-4 w-4" />
          <Icon v-else-if="notification.type === MessageType.Failed" :icon-types="iconType.Warning" custom-class="h-4 w-4" />
          <Icon v-else-if="notification.type === MessageType.Warning" :icon-types="iconType.Warning" custom-class="h-4 w-4" />
          <Icon v-else :icon-types="iconType.Info" custom-class="h-4 w-4" />
        </div>

        <div class="flex-1 text-sm text-ink-700">
          {{ notification.text }}
        </div>

        <button type="button" class="ml-3 text-ink-500 hover:text-ink-700" @click="closeNotification(notification.id)">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'
import { MessageType } from '@/models/enum/messagetype'
import { useNotificationStore } from '@/stores/notification/notificationStore'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { closeNotification } = notificationStore
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>