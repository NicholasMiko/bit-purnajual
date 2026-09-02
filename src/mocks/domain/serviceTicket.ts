import { faker } from '@faker-js/faker'
import { seedWarrantyRegistrations } from './warrantyRegistration'
import type { ServiceTicket } from '@/models/serviceTicket'

function buildTicket(id: number): ServiceTicket {
  const registration = seedWarrantyRegistrations[id - 1] ?? seedWarrantyRegistrations[0]

  return {
    id,
    nomorTiket: `PJ-${String(id).padStart(4, '0')}`,
    nomorRegistrasi: registration.nomorRegistrasi,
    namaPelanggan: registration.nama,
    produk: registration.namaProduk,
    keluhan: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['Menunggu', 'Diproses', 'Selesai']),
    tanggalMasuk: faker.date.recent({ days: 14 }).toISOString().slice(0, 10),
  }
}

export const seedTickets: ServiceTicket[] = Array.from({ length: 3 }, (_, index) => buildTicket(index + 1))

let nextTicketId = seedTickets.length + 1

export function generateTicketId(): number {
  const id = nextTicketId
  nextTicketId += 1
  return id
}

export function generateTicketNumber(id: number): string {
  return `PJ-${String(id).padStart(4, '0')}`
}