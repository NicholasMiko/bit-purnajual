import type { WarrantyRegistrationFormModel } from './warranty-registration-form.model'

export const WARRANTY_STATUS = ['Terdaftar', 'Aktif', 'Kedaluwarsa', 'Dibatalkan'] as const
export type WarrantyStatus = (typeof WARRANTY_STATUS)[number]

export interface WarrantyRegistrationModel extends WarrantyRegistrationFormModel {
  id: number
  nomorRegistrasi: string
  status: WarrantyStatus
  tanggalRegistrasi: string
}

export interface ProductCatalogModel {
  merk: string
  tipeProduk: string
  namaProduk: string
}
