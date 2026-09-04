import { faker } from '@faker-js/faker'
import { seedWarrantyRegistrations } from './warrantyRegistrationGenerator'
import type { ServiceTicketResponseModel } from '@/services/serviceTicket.service'

export function generateTicketNumber(id: number): string {
  return `PJ-${String(id).padStart(4, '0')}`
}

export function buildTicket(id: number): ServiceTicketResponseModel {
  const registration = seedWarrantyRegistrations[id - 1] ?? seedWarrantyRegistrations[0]

  return {
    id,
    nomorTiket: generateTicketNumber(id),
    nomorRegistrasi: registration.nomorRegistrasi,
    namaPelanggan: registration.nama,
    produk: registration.namaProduk,
    keluhan: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['Menunggu', 'Diproses', 'Menunggu Sparepart', 'Selesai']),
    tanggalMasuk: faker.date.recent({ days: 14 }).toISOString().slice(0, 10),
  }
}

export const seedTickets: ServiceTicketResponseModel[] = Array.from({ length: 3 }, (_, index) => buildTicket(index + 1))