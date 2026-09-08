import { createRouter, createWebHistory } from 'vue-router'
import { utilityRoutes } from './modules/utility.routes'
import { repairRoutes } from './modules/repair.routes'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainView,
      children: [...utilityRoutes, ...repairRoutes]
    }
  ]
})

export default router
