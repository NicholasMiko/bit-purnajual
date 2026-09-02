import { fetchRequest } from '@/fetchRequest'
import { endPoint } from '@/endPoint'
import type { WarrantyRegistrationFormModel } from '../models/warranty-registration-form.model'
import type { WarrantyRegistrationModel, ProductCatalogModel } from '../models/warranty-registration.model'

export const warrantyRegistrationServices = {
  list(): Promise<WarrantyRegistrationModel[]> {
    return fetchRequest.get<WarrantyRegistrationModel[]>(endPoint.repair.warrantyRegistration)
  },
  create(payload: WarrantyRegistrationFormModel): Promise<WarrantyRegistrationModel> {
    return fetchRequest.post<WarrantyRegistrationModel>(endPoint.repair.warrantyRegistration, payload)
  },
  productCatalog(): Promise<ProductCatalogModel[]> {
    return fetchRequest.get<ProductCatalogModel[]>(endPoint.repair.product)
  },
  async checkSerialExists(serial: string): Promise<boolean> {
    const res = await fetchRequest.get<{ exists: boolean }>(endPoint.repair.checkSerial(serial))
    return res.exists
  },
}
