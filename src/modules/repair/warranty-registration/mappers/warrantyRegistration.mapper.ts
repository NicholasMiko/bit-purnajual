import { WarrantyRegistrationFormModel } from '../models/warrantyRegistration.form.model'
import type { WarrantyRegistrationCreatePayload } from '../models/warrantyRegistration.request.model'
import type { WarrantyRegistrationResponseModel } from '../models/warrantyRegistration.response.model'

export const mapWarrantyRegistrationResponseToFormModel = (
  response: WarrantyRegistrationResponseModel,
): WarrantyRegistrationFormModel => {
  const model = new WarrantyRegistrationFormModel()
  model.merk = response.merk
  model.tipeProduk = response.tipeProduk
  model.namaProduk = response.namaProduk
  model.nomorSerial = response.nomorSerial
  model.namaToko = response.namaToko
  model.kota = response.kota
  model.tanggalPembelian = response.tanggalPembelian
  model.invoice = response.invoice
  model.fotoInvoicePembelian = response.fotoInvoicePembelian
  model.nama = response.nama
  model.alamatTempatTinggal = response.alamatTempatTinggal
  model.nomorTelepon = response.nomorTelepon
  model.alamatEmail = response.alamatEmail
  model.fotoKtp = response.fotoKtp

  return model
}

export const mapToWarrantyRegistrationCreatePayload = (
  form: WarrantyRegistrationFormModel,
): WarrantyRegistrationCreatePayload => {
  return {
    merk: form.merk,
    tipeProduk: form.tipeProduk,
    namaProduk: form.namaProduk,
    nomorSerial: form.nomorSerial,
    namaToko: form.namaToko,
    kota: form.kota,
    tanggalPembelian: form.tanggalPembelian,
    invoice: form.invoice,
    fotoInvoicePembelian: form.fotoInvoicePembelian,
    nama: form.nama,
    alamatTempatTinggal: form.alamatTempatTinggal,
    nomorTelepon: form.nomorTelepon,
    alamatEmail: form.alamatEmail,
    fotoKtp: form.fotoKtp,
  }
}