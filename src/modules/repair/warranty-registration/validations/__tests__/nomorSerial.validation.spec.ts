import { describe, it, expect, vi, beforeEach } from 'vitest'

const { checkSerialMock } = vi.hoisted(() => ({ checkSerialMock: vi.fn() }))

vi.mock('../../services/warrantyRegistration.service', () => ({
  checkWarrantyRegistrationSerial: checkSerialMock,
}))

import { validateSerialAvailability } from '../nomorSerial.validation'

const serialNotFoundMessage = 'Nomor serial tidak ditemukan di database produk.'
const serialAlreadyUsedMessage = 'Nomor serial telah ter-register hubungi call center untuk masalah ini.'

describe('validateSerialAvailability', () => {
  beforeEach(() => {
    checkSerialMock.mockReset()
  })

  it('memeriksa ulang serial yang sebelumnya ditolak', async () => {
  checkSerialMock.mockRejectedValue(new Error(serialAlreadyUsedMessage))
  const first = await validateSerialAvailability('AVL100004')

  checkSerialMock.mockResolvedValue({ available: true })
  const second = await validateSerialAvailability('AVL100004')

  expect(first).toBe(serialAlreadyUsedMessage)
  expect(second).toBe(true)
  expect(checkSerialMock).toHaveBeenCalledTimes(2)
})

  it('mengembalikan pesan saat serial sudah dipakai', async () => {
    checkSerialMock.mockRejectedValue(new Error(serialAlreadyUsedMessage))

    const result = await validateSerialAvailability('CAB340149')

    expect(result).toBe(serialAlreadyUsedMessage)
  })

  it('mengembalikan pesan saat serial tidak ditemukan', async () => {
    checkSerialMock.mockRejectedValue(new Error(serialNotFoundMessage))

    const result = await validateSerialAvailability('ZZZ999999')

    expect(result).toBe(serialNotFoundMessage)
  })

  it('mengembalikan pesan umum saat error tanpa keterangan', async () => {
    checkSerialMock.mockRejectedValue('kesalahan tanpa bentuk Error')

    const result = await validateSerialAvailability('QQQ111111')

    expect(result).toBe('Gagal memeriksa nomor serial.')
  })

  it('membersihkan spasi dan mengubah ke huruf besar sebelum memanggil service', async () => {
    checkSerialMock.mockResolvedValue({ available: true })

    await validateSerialAvailability('  avl100002  ')

    expect(checkSerialMock).toHaveBeenCalledWith('AVL100002')
  })

  it('selalu memanggil service untuk setiap pemeriksaan', async () => {
    checkSerialMock.mockResolvedValue({ available: true })

    await validateSerialAvailability('AVL100003')
    await validateSerialAvailability('AVL100003')

    expect(checkSerialMock).toHaveBeenCalledTimes(2)
})
})