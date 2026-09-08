import type { RouteRecordRaw } from 'vue-router'

export const utilityRoutes: RouteRecordRaw[] = [
  {
    path: '/tiket-servis',
    name: 'service-tickets',
    component: () => import('@/modules/service-ticket/ServiceTicketsView.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/modules/test-view/TestView.vue'),
  },
]
