import { type RouteRecordRaw } from 'vue-router'
import { Mode } from '@/models/enum/mode'

const WarrantyRegistrationComponent = () => import("@/modules/repair/warranty-registration/WarrantyRegistrationComponent.vue")
const WarrantyRegistrationMain = () => import("@/modules/repair/warranty-registration/views/WarrantyRegistrationMain.vue")
const WarrantyRegistrationConfirmation = () => import('@/modules/repair/warranty-registration/views/WarrantyRegistrationConfirmation.vue')


const warrantyRegistrationRoutes: RouteRecordRaw = {
  path: 'registrasi-garansi-pembelian',
  name: 'warrantyregistration',
  component: WarrantyRegistrationComponent,
  redirect: { name: 'warrantyregistration-create', params: { step: 'step1' } },
  children: [
    {
      path: 'create/:step(step1|step2|step3)',
      name: 'warrantyregistration-create',
      component: WarrantyRegistrationMain,
      props: () => ({ mode: Mode.Create }),
    },
    {
      path: 'confirmation',
      name: 'warrantyregistration-confirmation',
      component: WarrantyRegistrationConfirmation,
    },
  ],
}

export default warrantyRegistrationRoutes;