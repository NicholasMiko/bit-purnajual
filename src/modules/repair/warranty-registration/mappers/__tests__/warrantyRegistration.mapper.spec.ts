import { describe, it, expect } from 'vitest'
import { WarrantyRegistrationFormModel } from '../../models/warrantyRegistration.form.model'
import {
  mapToWarrantyRegistrationCreatePayload,
  mapWarrantyRegistrationResponseToFormModel,
} from '../warrantyRegistration.mapper'
import type { WarrantyRegistrationResponseModel } from '../../models/warrantyRegistration.response.model'

const response: WarrantyRegistrationResponseModel = {
  id: 1,
  nomorRegistrasi: 'GAR-0001',
  merk: 'SHIMIZU',
  tipeProduk: 'PB-288BIT',
  namaProduk: 'POMPA BOOSTER SHIMIZU PB-288BIT',
  nomorSerial: 'CAB340149',
  namaToko: 'Toko Jaya',
  kota: 'Jakarta',
  tanggalPembelian: '2026-03-30',
  invoice: 'INV-000123',
  fotoInvoicePembelian: 'invoice.jpg',
  nama: 'Joni Esmud',
  alamatTempatTinggal: 'Jl. Mawar 5',
  nomorTelepon: '081234567890',
  alamatEmail: 'joni@mail.com',
  fotoKtp: 'ktp.jpg',
  status: 'Terdaftar',
  tanggalRegistrasi: '2026-04-01',
}

const expectedForm = {
  merk: 'SHIMIZU',
  tipeProduk: 'PB-288BIT',
  namaProduk: 'POMPA BOOSTER SHIMIZU PB-288BIT',
  nomorSerial: 'CAB340149',
  namaToko: 'Toko Jaya',
  kota: 'Jakarta',
  tanggalPembelian: '2026-03-30',
  invoice: 'INV-000123',
  fotoInvoicePembelian: 'invoice.jpg',
  nama: 'Joni Esmud',
  alamatTempatTinggal: 'Jl. Mawar 5',
  nomorTelepon: '081234567890',
  alamatEmail: 'joni@mail.com',
  fotoKtp: 'ktp.jpg',
}

describe('warrantyRegistration mapper', () => {
  it('memetakan seluruh field response ke form model', () => {
    const form = mapWarrantyRegistrationResponseToFormModel(response)

    expect(form).toBeInstanceOf(WarrantyRegistrationFormModel)
    expect({ ...form }).toEqual(expectedForm)
  })

  it('tidak membawa field milik server ke form model', () => {
    const form = mapWarrantyRegistrationResponseToFormModel(response)

    expect(form).not.toHaveProperty('id')
    expect(form).not.toHaveProperty('nomorRegistrasi')
    expect(form).not.toHaveProperty('status')
    expect(form).not.toHaveProperty('tanggalRegistrasi')
  })

  it('memetakan seluruh field form model ke payload create', () => {
    const form = mapWarrantyRegistrationResponseToFormModel(response)
    const payload = mapToWarrantyRegistrationCreatePayload(form)

    expect(payload).toEqual(expectedForm)
  })

  it('mengirim payload dengan jumlah field yang tepat', () => {
    const form = new WarrantyRegistrationFormModel()
    const payload = mapToWarrantyRegistrationCreatePayload(form)

    expect(Object.keys(payload)).toHaveLength(14)
  })
})