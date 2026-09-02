import { createRouter, createWebHistory } from 'vue-router'
import { utilityRoutes } from './modules/utility.routes'
import { repairRoutes } from './modules/repair.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...utilityRoutes, ...repairRoutes],
})

export default router
