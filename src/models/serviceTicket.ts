export const TICKET_STATUS = [
  'Menunggu',
  'Diproses',
  'Selesai',
  'Dibatalkan',
] as const

export type TicketStatus = (typeof TICKET_STATUS)[number]

export interface ServiceTicket {
  id: number
  nomorTiket: string
  nomorRegistrasi: string
  namaPelanggan: string
  produk: string
  keluhan: string
  status: TicketStatus
  tanggalMasuk: string
}

export type ServiceTicketInput = Pick<ServiceTicket, 'nomorRegistrasi' | 'keluhan' | 'status'>