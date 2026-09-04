import { faker } from '@faker-js/faker'
import type {
  WarrantyRegistrationResponseModel,
  ProductCatalogResponseModel,
} from '@/modules/repair/warranty-registration/models/warrantyRegistration.response.model'
import type { WarrantyRegistrationFormModel } from '@/modules/repair/warranty-registration/models/warrantyRegistration.form.model'

const catalogByBrand: Record<string, string[]> = {
  SHIMIZU: ['PB-268BIT', 'PB-288BIT', 'PS-135BIT'],
  MIYAKO: ['MM-250', 'MM-138EX'],
  RINNAI: ['PR-82M', 'PR-50M'],
}

const registeredSerials = ['ABC123', 'CAB340149', 'CAB340150', 'SN12345678', 'ABC123456', 'XYZ987654', 'QWE456789']

const availableSerials = ['DEF456', 'AVL100001', 'AVL100002', 'AVL100003', 'AVL100004', 'AVL100005']

export const masterSerials = [...registeredSerials, ...availableSerials]

export const productCatalog: ProductCatalogResponseModel[] = Object.entries(catalogByBrand).flatMap(([merk, types]) =>
  types.map((tipeProduk) => ({
    merk,
    tipeProduk,
    namaProduk: `POMPA BOOSTER ${merk} ${tipeProduk}`,
  })),
)

export const brandOptions = Object.keys(catalogByBrand)

export function buildWarrantyRegistration(id: number): WarrantyRegistrationResponseModel {
  const product = faker.helpers.arrayElement(productCatalog)

  return {
    id,
    nomorRegistrasi: `GAR-${String(id).padStart(4, '0')}`,
    merk: product.merk,
    tipeProduk: product.tipeProduk,
    namaProduk: product.namaProduk,
    nomorSerial: registeredSerials[id - 1] ?? faker.string.alphanumeric({ length: 9, casing: 'upper' }),
    namaToko: faker.company.name(),
    kota: faker.location.city(),
    tanggalPembelian: faker.date.past({ years: 1 }).toISOString().slice(0, 10),
    invoice: `INV-${faker.string.numeric(6)}`,
    fotoInvoicePembelian: 'invoice.jpg',
    nama: faker.person.fullName(),
    alamatTempatTinggal: faker.location.streetAddress(),
    nomorTelepon: `08${faker.string.numeric(10)}`,
    alamatEmail: faker.internet.email().toLowerCase(),
    fotoKtp: 'ktp.jpg',
    status: faker.helpers.arrayElement(['Terdaftar', 'Aktif', 'Kedaluwarsa']),
    tanggalRegistrasi: faker.date.recent({ days: 30 }).toISOString().slice(0, 10),
  }
}

export const seedWarrantyRegistrations: WarrantyRegistrationResponseModel[] = Array.from({ length: 6 }, (_, index) =>
  buildWarrantyRegistration(index + 1),
)

export function generateWarrantyRegistration(
  id: number,
  payload: WarrantyRegistrationFormModel,
): WarrantyRegistrationResponseModel {
  return {
    id,
    nomorRegistrasi: `GAR-${String(id).padStart(4, '0')}`,
    status: 'Terdaftar',
    tanggalRegistrasi: new Date().toISOString().slice(0, 10),
    ...payload,
  }
}