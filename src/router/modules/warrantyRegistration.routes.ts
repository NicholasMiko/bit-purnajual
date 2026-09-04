import { type RouteRecordRaw } from 'vue-router'
import { Mode } from '@/models/enum/mode'
import WarrantyRegistrationComponent from '@/modules/repair/warranty-registration/WarrantyRegistrationComponent.vue'
import WarrantyRegistrationMain from '@/modules/repair/warranty-registration/views/WarrantyRegistrationMain.vue'

const warrantyRegistration: RouteRecordRaw = {
  path: '/',
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