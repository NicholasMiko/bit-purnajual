import type { RouteRecordRaw } from 'vue-router'

export const utilityRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/tiket-servis',
    name: 'service-tickets',
    component: () => import('@/views/ServiceTicketsView.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestView.vue'),
  },
]
