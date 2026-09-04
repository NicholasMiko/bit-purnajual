import { checkWarrantyRegistrationSerial } from '../services/warrantyRegistration.service'

const checkedSerials = new Map<string, string | true>()

export async function validateSerialAvailability(value: string): Promise<string | true> {
  const serial = value.trim().toUpperCase()

  const cached = checkedSerials.get(serial)
  if (cached !== undefined) return cached

  try {
    await checkWarrantyRegistrationSerial(serial)
    checkedSerials.set(serial, true)
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memeriksa nomor serial.'
    checkedSerials.set(serial, message)
    return message
  }
}