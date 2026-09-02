import { faker } from '@faker-js/faker'
import type { WarrantyRegistrationModel, ProductCatalogModel } from '@/modules/repair/warranty-registration/models/warranty-registration.model'

const catalogByBrand: Record<string, string[]> = {
  SHIMIZU: ['PB-268BIT', 'PB-288BIT', 'PS-135BIT'],
  MIYAKO: ['PC-268BIT', 'PC-288BIT'],
  RINNAI: ['PR-268BIT', 'PR-268BIT'],
}

export const productCatalog: ProductCatalogModel[] = Object.entries(catalogByBrand).flatMap(([merk, types]) =>
  types.map((tipeProduk) => ({
    merk,
    tipeProduk,
    namaProduk: `POMPA BOOSTER ${merk} ${tipeProduk}`,
  })),
)

export const brandOptions = Object.keys(catalogByBrand)
export const registeredSerials = ['CAB340149', 'CAB340150', 'SN12345678', 'ABC123456', 'XYZ987654', 'QWE456789']

function buildWarrantyRegistration(id: number): WarrantyRegistrationModel {
  const product = faker.helpers.arrayElement(productCatalog)
  return {
    id,
    nomorRegistrasi: `UUID-${String(id).padStart(4, '0')}`,
    merk: product.merk,
    tipeProduk: product.tipeProduk,
    namaProduk: product.namaProduk,
    nomorSerial: registeredSerials[id - 1] ?? faker.string.alphanumeric({ length: 9, casing: 'upper' }),
    namaToko: faker.company.name(),
    kota: faker.location.city(),
    tanggalPembelian: faker.date.past({ years: 1 }).toISOString().slice(0, 10),
    invoice: `INV-${faker.string.numeric(6)}`,
    fotoInvoicePembelian: 'invoice.jpg',
    nama: faker.person.firstName(),
    alamatTempatTinggal: faker.location.streetAddress(),
    nomorTelepon: `08${faker.string.numeric(10)}`,
    alamatEmail: faker.internet.email().toLowerCase(),
    fotoKtp: 'ktp.jpg',
    status: faker.helpers.arrayElement(['Terdaftar', 'Aktif', 'Kedaluwarsa']),
    tanggalRegistrasi: faker.date.recent({ days: 30 }).toISOString().slice(0, 10),
  }
}

export const seedWarrantyRegistrations: WarrantyRegistrationModel[] = Array.from({ length: 6 }, (_, index) =>
  buildWarrantyRegistration(index + 1),
)

let nextWarrantyId = seedWarrantyRegistrations.length + 1

export function generateWarrantyRegistration(
  payload: Omit<WarrantyRegistrationModel, 'id' | 'nomorRegistrasi' | 'status' | 'tanggalRegistrasi'>,
): WarrantyRegistrationModel {
  const id = nextWarrantyId
  nextWarrantyId += 1
  return {
    id,
    nomorRegistrasi: `UUID-${String(id).padStart(4, '0')}`,
    status: 'Terdaftar',
    tanggalRegistrasi: new Date().toISOString().slice(0, 10),
    ...payload,
  }
}
