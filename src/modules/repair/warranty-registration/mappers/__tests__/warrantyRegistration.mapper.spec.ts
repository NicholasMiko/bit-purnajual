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

describe('warrantyRegistration mapper', () => {
  it('memetakan response ke form model', () => {
    const form = mapWarrantyRegistrationResponseToFormModel(response)

    expect(form).toBeInstanceOf(WarrantyRegistrationFormModel)
    expect(form.merk).toBe('SHIMIZU')
    expect(form.nomorSerial).toBe('CAB340149')
    expect(form.nama).toBe('Joni Esmud')
  })

  it('tidak membawa field milik response ke form model', () => {
    const form = mapWarrantyRegistrationResponseToFormModel(response)

    expect(form).not.toHaveProperty('id')
    expect(form).not.toHaveProperty('nomorRegistrasi')
    expect(form).not.toHaveProperty('status')
  })

  it('memetakan form model ke payload create', () => {
    const form = mapWarrantyRegistrationResponseToFormModel(response)
    const payload = mapToWarrantyRegistrationCreatePayload(form)

    expect(payload.nomorSerial).toBe('CAB340149')
    expect(payload.alamatEmail).toBe('joni@mail.com')
    expect(Object.keys(payload)).toHaveLength(14)
  })
})