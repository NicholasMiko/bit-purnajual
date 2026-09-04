import { HttpResponse } from 'msw'
import type { PagingDataV2 } from '@/models/paging.types'

export interface Response {
  status: string
  code: number
  responseCode: number
  responseMessage: string
  result: {
    content: unknown[]
    number: number
    numberOfElements: number
    totalElements: number
    totalPages: number
    size: number
  }
}

export enum TypeDataResponse {
  Created_Successfully = 'Created Successfully',
  Updated_Successfully = 'Updated Successfully',
  Deleted_Successfully = 'Deleted Successfully',
  Activated_Inactivated_Successfully = 'Inactivated/Activated Successfully',
  Already_Exists = 'Already Exists',
  Doesnt_Exists = 'Doesn’t Exists',
  Success = 'Success',
}

enum StatusDataResponse {
  Success = 'Success',
  Failed = 'Failed',
}

export function responseWrapper(desiredDataResponse: unknown[]) {
  return {
    status: 'success',
    code: 0,
    result: [...desiredDataResponse],
  }
}

export function getListGeneratorPagingData<T>(request: PagingDataV2, list: T[]): Response {
  const { page = 1, size = 10 } = request
  const startIndex = (Math.max(1, page) - 1) * size
  const paginated = list.slice(startIndex, startIndex + size)
  const totalPages = Math.ceil(list.length / size)
  const totalElements = list.length

  return {
    status: 'Success',
    code: 0,
    responseCode: 20000101300,
    responseMessage: 'Get List Successfully',
    result: {
      content: paginated as unknown[],
      number: page,
      numberOfElements: size,
      totalElements,
      totalPages,
      size,
    },
  }
}

export function errorArrayResponse(code: string) {
  return HttpResponse.json(
    {
      status: 'Failed',
      code: 2,
      result: [
        {
          id: `${code}~uuid`,
          statusDetail: 'Failed',
          responseDetail: [
            {
              responseCode: 40600101001,
              responseMessage: `${code} Already Exists`,
            },
          ],
        },
      ],
    },
    { status: 400 },
  )
}

export function getdesiredDataResponse(type: string, module = '', id = '') {
  const resolvedModule = module === '' ? 'REQUEST' : module
  let resolvedId = id

  if (resolvedModule === 'REQUEST') {
    if (resolvedId === '') resolvedId = 'REQ000001'
  } else {
    if (resolvedId === '') resolvedId = 'EXAMPLE'
    if (!resolvedId.includes('~uuid')) resolvedId = `${resolvedId}~uuid`
  }

  const statusDetail =
    type === TypeDataResponse.Already_Exists || type === TypeDataResponse.Doesnt_Exists
      ? StatusDataResponse.Failed
      : StatusDataResponse.Success

  return [
    {
      id: resolvedId,
      statusDetail,
      responseDetail: [
        {
          responseCode: 20100101001,
          responseMessage: `${resolvedModule} ${type}`,
        },
      ],
    },
  ]
}