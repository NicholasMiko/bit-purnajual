import endPoint from '@/endPoint'
import type { PagingDataV2 } from '@/models/paging.types'
import type { ApiResponse } from '@/models/responseMessage.model'
import type { Result } from '@/models/page'
import { Get, Post } from '@/services/apiTemplate.service'

import type {
  WarrantyRegistrationGetPayload,
  WarrantyRegistrationCreatePayload,
  WarrantyRegistrationCheckSerialPayload,
} from '../models/warrantyRegistration.request.model'
import type { CheckSerialResponseModel, ProductCatalogResponseModel, WarrantyRegistrationResponseModel } from '../models/warrantyRegistration.response.model'

export const getWarrantyRegistrationList = async (
  body: PagingDataV2,
): Promise<Result<WarrantyRegistrationResponseModel[]>> => {
  return Get<Result<WarrantyRegistrationResponseModel[]>, PagingDataV2>(
    endPoint.repair.warranty_registration.list,
    body,
  )
}

export const getWarrantyRegistrationViewById = async (
  id: string,
): Promise<WarrantyRegistrationResponseModel> => {
  const payload: WarrantyRegistrationGetPayload = { id }
  return Get<WarrantyRegistrationResponseModel, WarrantyRegistrationGetPayload>(
    endPoint.repair.warranty_registration.view,
    payload,
  )
}

export const createWarrantyRegistration = async (
  data: WarrantyRegistrationCreatePayload,
): Promise<ApiResponse> => {
  return Post(endPoint.repair.warranty_registration.create, data)
}

export const checkWarrantyRegistrationSerial = async (
  nomorSerial: string,
): Promise<CheckSerialResponseModel> => {
  const payload: WarrantyRegistrationCheckSerialPayload = { nomorSerial }
  return Get<CheckSerialResponseModel, WarrantyRegistrationCheckSerialPayload>(
    endPoint.repair.warranty_registration.checkSerial,
    payload,
  )
}

export const getProductCatalogList = async (
  body: PagingDataV2,
): Promise<Result<ProductCatalogResponseModel[]>> => {
  return Get<Result<ProductCatalogResponseModel[]>, PagingDataV2>(
    endPoint.repair.warranty_registration.listProduct,
    body,
  )
}