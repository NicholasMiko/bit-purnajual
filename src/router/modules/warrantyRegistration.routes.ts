import { type RouteRecordRaw } from 'vue-router'
import { Mode } from '@/models/enum/mode'

const WarrantyRegistrationComponent = () => import("@/modules/repair/warranty-registration/WarrantyRegistrationComponent.vue")
const WarrantyRegistrationMain = () => import("@/modules/repair/warranty-registration/views/WarrantyRegistrationMain.vue")

const warrantyRegistration: RouteRecordRaw = {
  path: 'registrasi-garansi-pembelian',
  name: 'warrantyregistration',
  component: WarrantyRegistrationComponent,
  redirect: { name: 'warrantyregistration-create' },
  children: [
    {
      path: 'create',
      name: 'warrantyregistration-create',
      component: WarrantyRegistrationMain,
      props: () => ({ mode: Mode.Create }),
    },
  ],
}

export default warrantyRegistration