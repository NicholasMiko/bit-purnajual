
import * as yup from 'yup'

export const requiredText = (label: string, max = 100) =>
  yup.string().trim().required(`${label} wajib diisi`).max(max, `${label} maksimal ${max} karakter`)

export const requiredSelect = (label: string) => yup.string().trim().required(`${label} wajib dipilih`)

export const emailRule = yup.string().trim().required('Email wajib diisi').email('Format email tidak valid')

export const phoneRule = yup
  .string()
  .trim()
  .required('Nomor telepon wajib diisi')
  .matches(/^0[0-9]{8,14}$/, 'Nomor telepon harus diawali 0 dan berisi 9–15 digit angka')

export const notFutureDateRule = (label: string) =>
  yup
    .string()
    .required(`${label} wajib diisi`)
    .test('not-future', `${label} tidak boleh di masa depan`, (value) => {
      if (!value) return true
      return new Date(value).getTime() <= Date.now()
    })

export const optionalText = (max = 500) => yup.string().trim().max(max, `Maksimal ${max} karakter`).optional()
