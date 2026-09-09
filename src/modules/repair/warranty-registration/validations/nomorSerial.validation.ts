import { checkWarrantyRegistrationSerial } from '../services/warrantyRegistration.service'

export async function validateSerialAvailability(value: string): Promise<string | true> {
  const serial = value.trim().toUpperCase()

  try {
    await checkWarrantyRegistrationSerial(serial)
    return true
  } catch (error) {
    return error instanceof Error ? error.message : 'Gagal memeriksa nomor serial.'
  }
}