export interface WarrantyRegistrationGetPayload {
  id: string
}

export interface WarrantyRegistrationCreatePayload {
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
}

export interface WarrantyRegistrationCheckSerialPayload {
  nomorSerial: string
}