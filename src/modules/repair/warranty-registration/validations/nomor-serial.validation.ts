import * as yup from 'yup'
import { warrantyRegistrationServices } from '../services/warranty-registration-services'

export const uniqueSerialRule = yup
  .string()
  .test(
    'unique-serial',
    'Nomor serial telah ter-register hubungi call center untuk masalah ini.',
    async (value) => {
      if (!value) return true
      return !(await warrantyRegistrationServices.checkSerialExists(value))
    },
  )
