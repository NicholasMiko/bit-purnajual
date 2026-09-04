import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = reactive<{ id: number; text: string; type: string; timeout?: number }[]>([])

  const showNotification = (id: number, text: string, type: string, timeout = 3000) => {
    if (notifications.some((item) => item.text === text && item.type === type)) {
      return
    }

    notifications.push({ id, text, type, timeout })

    setTimeout(() => {
      closeNotification(id)
    }, timeout)
  }

  const closeNotification = (id: number) => {
    const index = notifications.findIndex((notification) => notification.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
    }
  }

  return { notifications, showNotification, closeNotification }
})