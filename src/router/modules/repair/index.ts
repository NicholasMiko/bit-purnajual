import { type RouteRecordRaw } from 'vue-router';
import warrantyRegistrationRoutes from './warrantyRegistration.routes';
const RepairView = () => import('@/views/RepairView.vue')

const repairRoutes: RouteRecordRaw = {
  path: 'repair',
  name: 'repair',
  component: RepairView,
  children: [
    warrantyRegistrationRoutes,
  ]
};

export default repairRoutes;
