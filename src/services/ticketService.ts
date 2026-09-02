import { fetchRequest } from '@/fetchRequest'
import { endPoint } from '@/endPoint'
import type { ServiceTicket, ServiceTicketInput } from '@/models/serviceTicket'

export const ticketService = {
  list(): Promise<ServiceTicket[]> {
    return fetchRequest.get<ServiceTicket[]>(endPoint.serviceTicket.list)
  },
  create(payload: ServiceTicketInput): Promise<ServiceTicket> {
    return fetchRequest.post<ServiceTicket>(endPoint.serviceTicket.list, payload)
  },
  update(id: number, payload: ServiceTicketInput): Promise<ServiceTicket> {
    return fetchRequest.put<ServiceTicket>(endPoint.serviceTicket.byId(id), payload)
  },
  remove(id: number): Promise<null> {
    return fetchRequest.delete<null>(endPoint.serviceTicket.byId(id))
  },
}
