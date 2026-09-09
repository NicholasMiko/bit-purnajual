import { createRouter, createWebHistory } from 'vue-router'
import repairRoutes from './modules/repair';

const MainView = () => import ('@/views/MainView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainView,
      children: [
        repairRoutes,
      ]
    }
  ]
})

export default router
