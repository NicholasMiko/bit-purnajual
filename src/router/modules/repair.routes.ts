import type { RouteRecordRaw } from 'vue-router'

export const repairRoutes: RouteRecordRaw[] = [
  {
    path: '/repair/registrasi-garansi-pembelian',
    name: 'warranty-registration',
    component: () => import('@/modules/repair/warranty-registration/views/WarrantyRegistration.vue'),
  },
]
