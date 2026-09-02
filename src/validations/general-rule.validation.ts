import * as yup from 'yup'

export function withDefaultGeneralInputTextRule(allowSpace: boolean, required: boolean, allowSlash: boolean, label = '') {
  let schema = yup.string().trim()

  if (label) {
    schema = schema.label(label)
  }

  if (required) {
    schema = schema.required('${path} wajib diisi')
  }

  if (!allowSpace) {
    schema = schema.test('no-space', '${path} tidak boleh mengandung spasi', (value) => {
      if (!value) return true
      return !/\s/.test(value)
    })
  }

  if (!allowSlash) {
    schema = schema.test('no-slash', '${path} tidak boleh mengandung karakter /', (value) => {
      if (!value) return true
      return !value.includes('/')
    })
  }

  return schema
}