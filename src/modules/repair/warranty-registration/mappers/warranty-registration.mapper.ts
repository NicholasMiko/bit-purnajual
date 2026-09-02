import { WarrantyRegistrationFormModel } from '../models/warranty-registration-form.model'
import type { WarrantyRegistrationModel } from '../models/warranty-registration.model'

export function mapToWarrantyRegistrationForm(data: WarrantyRegistrationModel): WarrantyRegistrationFormModel {
  const form = new WarrantyRegistrationFormModel()
  form.merk = data.merk
  form.tipeProduk = data.tipeProduk
  form.namaProduk = data.namaProduk
  form.nomorSerial = data.nomorSerial
  form.namaToko = data.namaToko
  form.kota = data.kota
  form.tanggalPembelian = data.tanggalPembelian
  form.invoice = data.invoice
  form.fotoInvoicePembelian = data.fotoInvoicePembelian
  form.nama = data.nama
  form.alamatTempatTinggal = data.alamatTempatTinggal
  form.nomorTelepon = data.nomorTelepon
  form.alamatEmail = data.alamatEmail
  form.fotoKtp = data.fotoKtp
  return form
}
