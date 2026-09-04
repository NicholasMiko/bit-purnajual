export const WARRANTY_STATUS = ['Terdaftar', 'Aktif', 'Kedaluwarsa', 'Dibatalkan'] as const
export type WarrantyStatus = (typeof WARRANTY_STATUS)[number]

export interface WarrantyRegistrationResponseModel {
  id: number
  nomorRegistrasi: string
  merk: string
  tipeProduk: string
  namaProduk: string
  nomorSerial: string
  namaToko: string
  kota: string
  tanggalPembelian: string
  invoice: string
  fotoInvoicePembelian: string
  nama: string
  alamatTempatTinggal: string
  nomorTelepon: string
  alamatEmail: string
  fotoKtp: string
  status: WarrantyStatus
  tanggalRegistrasi: string
}

export interface ProductCatalogResponseModel {
  merk: string
  tipeProduk: string
  namaProduk: string
}

export interface CheckSerialResponseModel {
  available: boolean
}