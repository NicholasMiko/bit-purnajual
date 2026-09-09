import { WarrantyRegistrationFormModel } from '../models/warrantyRegistration.form.model'

const draftKey = 'warrantyRegistrationDraft'

export interface StoredFileModel {
  name: string
  type: string
  dataUrl: string
}

export interface WarrantyRegistrationDraftModel {
  form: WarrantyRegistrationFormModel
  invoiceFile: StoredFileModel | null
  ktpFile: StoredFileModel | null
}

export function readFileAsStored(file: File): Promise<StoredFileModel> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: String(reader.result) })
    reader.onerror = () => reject(new Error('Gagal membaca berkas'))
    reader.readAsDataURL(file)
  })
}

export function buildFileFromStored(stored: StoredFileModel): File {
  const base64 = stored.dataUrl.split(',')[1] ?? ''
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], stored.name, { type: stored.type })
}

export function saveDraft(draft: WarrantyRegistrationDraftModel): boolean {
  try {
    sessionStorage.setItem(draftKey, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function loadDraft(): WarrantyRegistrationDraftModel | null {
  const raw = sessionStorage.getItem(draftKey)
  if (!raw) return null

  try {
    return JSON.parse(raw) as WarrantyRegistrationDraftModel
  } catch {
    sessionStorage.removeItem(draftKey)
    return null
  }
}

export function clearDraft() {
  sessionStorage.removeItem(draftKey)
}