import { defineStore } from 'pinia'
import { warrantyRegistrationServices } from '@/modules/repair/warranty-registration/services/warranty-registration-services'
import type { WarrantyRegistrationFormModel } from '@/modules/repair/warranty-registration/models/warranty-registration-form.model'
import type { WarrantyRegistrationModel, ProductCatalogModel } from '@/modules/repair/warranty-registration/models/warranty-registration.model'

interface State {
  registrations: WarrantyRegistrationModel[]
  productCatalog: ProductCatalogModel[]
  isLoading: boolean
  error: string | null
}

export const useWarrantyRegistrationStore = defineStore('warrantyRegistration', {
  state: (): State => ({
    registrations: [],
    productCatalog: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchRegistrations() {
      this.isLoading = true
      this.error = null
      try {
        this.registrations = await warrantyRegistrationServices.list()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Gagal memuat data registrasi garansi'
      } finally {
        this.isLoading = false
      }
    },

    async fetchProductCatalog() {
      this.productCatalog = await warrantyRegistrationServices.productCatalog()
    },

    async register(payload: WarrantyRegistrationFormModel) {
      const created = await warrantyRegistrationServices.create(payload)
      this.registrations = [created, ...this.registrations]
      return created
    },
  },
})
