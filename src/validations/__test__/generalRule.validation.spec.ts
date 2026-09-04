import { withDefaultGeneralInputTextRule } from '@/validations/generalRule.validation'
import { describe, it, expect } from 'vitest'


async function getErrorMessage(schema: ReturnType<typeof withDefaultGeneralInputTextRule>, value: string) {
  try {
    await schema.validate(value)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}

describe('withDefaultGeneralInputTextRule', () => {
  describe('aturan wajib diisi', () => {
    it('menolak nilai kosong saat required aktif', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, 'Nama Toko')

      expect(await getErrorMessage(schema, '')).toBe('Nama Toko wajib diisi')
    })

    it('menolak nilai berisi spasi saja saat required aktif', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, 'Nama Toko')

      expect(await getErrorMessage(schema, '   ')).toBe('Nama Toko wajib diisi')
    })

    it('menerima nilai kosong saat required tidak aktif', async () => {
      const schema = withDefaultGeneralInputTextRule(true, false, true, 'Catatan')

      expect(await getErrorMessage(schema, '')).toBeNull()
    })
  })

  describe('label pada pesan error', () => {
    it('memakai label yang diberikan', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, 'Nomor Serial')

      expect(await getErrorMessage(schema, '')).toBe('Nomor Serial wajib diisi')
    })

    it('tidak menampilkan kata this saat label kosong', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, '')

      expect(await getErrorMessage(schema, '')).not.toContain('this')
    })
  })

  describe('aturan spasi', () => {
    it('menolak nilai berspasi saat allowSpace dimatikan', async () => {
      const schema = withDefaultGeneralInputTextRule(false, true, true, 'Kode Produk')

      expect(await getErrorMessage(schema, 'ABC 123')).toBe('Kode Produk tidak boleh mengandung spasi')
    })

    it('menerima nilai berspasi saat allowSpace aktif', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, 'Nama Toko')

      expect(await getErrorMessage(schema, 'Toko Jaya Abadi')).toBeNull()
    })
  })

  describe('aturan garis miring', () => {
    it('menolak nilai bergaris miring saat allowSlash dimatikan', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, false, 'Invoice')

      expect(await getErrorMessage(schema, 'INV/2026/001')).toBe('Invoice tidak boleh mengandung karakter /')
    })

    it('menerima nilai bergaris miring saat allowSlash aktif', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, 'Invoice')

      expect(await getErrorMessage(schema, 'INV/2026/001')).toBeNull()
    })
  })

  describe('pembersihan nilai', () => {
    it('memangkas spasi di awal dan akhir', async () => {
      const schema = withDefaultGeneralInputTextRule(true, true, true, 'Kota')

      expect(await schema.validate('  Jakarta  ')).toBe('Jakarta')
    })
  })
})