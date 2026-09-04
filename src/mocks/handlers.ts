import { handlers as warrantyRegistrationHandlers } from '@/mocks/domain/warrantyRegistration'
import { handlers as serviceTicketHandlers } from '@/mocks/domain/serviceTicket'

export const handlers = [
  ...warrantyRegistrationHandlers,
  ...serviceTicketHandlers,
]