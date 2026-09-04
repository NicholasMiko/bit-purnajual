import { http, HttpResponse } from 'msw'
import type { PagingDataV2 } from '@/models/paging.types'
import type { RequestResponse } from '@/models/api'
import {
  errorArrayResponse,
  responseWrapper,
  getdesiredDataResponse,
  getListGeneratorPagingData,
  TypeDataResponse,
  type Response,
} from '@/mocks/utility/requestApprovalGenerator'
import {
  productCatalog,
  masterSerials,
  seedWarrantyRegistrations,
  generateWarrantyRegistration,
} from '@/mocks/utility/warrantyRegistrationGenerator'
import type { WarrantyRegistrationResponseModel } from '@/modules/repair/warranty-registration/models/warrantyRegistration.response.model'
import type { WarrantyRegistrationFormModel } from '@/modules/repair/warranty-registration/models/warrantyRegistration.form.model'

type WarrantyRegistrationCreateBody = WarrantyRegistrationFormModel

const module = 'WARRANTY_REGISTRATION'

const serialNotFoundMessage = 'Nomor serial tidak ditemukan di database produk.'
const serialAlreadyUsedMessage = 'Nomor serial telah ter-register hubungi call center untuk masalah ini.'

let dataTemp: WarrantyRegistrationResponseModel[] = [...seedWarrantyRegistrations]
let nextId = dataTemp.length + 1

export function findRegistrationByNomor(nomorRegistrasi: string): WarrantyRegistrationResponseModel | undefined {
  return dataTemp.find((item) => item.nomorRegistrasi === nomorRegistrasi)
}

function findItemById(id: string): WarrantyRegistrationResponseModel | undefined {
  return dataTemp.find((item) => String(item.id) === id)
}

function serialErrorResponse(httpStatus: number, responseCode: number, responseMessage: string) {
  return HttpResponse.json(
    {
      status: 'Failed',
      code: 2,
      result: [
        {
          id: `${module}~uuid`,
          statusDetail: 'Failed',
          responseDetail: [{ responseCode, responseMessage }],
        },
      ],
    },
    { status: httpStatus },
  )
}

function defaultFilter(
  content: WarrantyRegistrationResponseModel[],
  request: PagingDataV2,
): WarrantyRegistrationResponseModel[] {
  const filterBy = request?.filterBy || {}
  let filteredContent = [...content]

  const textKeys: Array<keyof WarrantyRegistrationResponseModel> = [
    'nomorRegistrasi',
    'nama',
    'namaProduk',
    'nomorSerial',
  ]

  textKeys.forEach((key) => {
    const filterValue = filterBy[key as string]
    if (Array.isArray(filterValue) && filterValue.length > 0) {
      const values = filterValue.map((item) => String(item).toLowerCase())
      filteredContent = filteredContent.filter((row) =>
        values.some((value) => String(row[key] ?? '').toLowerCase().includes(value)),
      )
    }
  })

  return filteredContent
}

function getList(request: PagingDataV2, content: WarrantyRegistrationResponseModel[]): Response {
  return getListGeneratorPagingData(request, defaultFilter(content, request))
}

export const handlers = [
  http.post('/repair/warrantyregistration/v1/get-list', async ({ request }) => {
    const data = (await request.json()) as PagingDataV2
    return HttpResponse.json(getList(data, dataTemp))
  }),

  http.post('/repair/warrantyregistration/v1/get', async ({ request }) => {
    const body = (await request.json()) as { id: string }

    if (!body.id) return errorArrayResponse(module)

    const result = findItemById(body.id)
    if (!result) return errorArrayResponse(module)

    const response: RequestResponse<WarrantyRegistrationResponseModel> = {
      code: 0,
      status: 'Success',
      responseCode: 20000101300,
      responseMessage: `${module} Get Successful`,
      result,
    }
    return HttpResponse.json(response)
  }),

  http.post('/repair/warrantyregistration/v1/create', async ({ request }) => {
    const body = (await request.json()) as WarrantyRegistrationCreateBody

    if (!body.nomorSerial || !body.nama) {
      return errorArrayResponse(module)
    }

    const serial = body.nomorSerial.trim().toUpperCase()

    if (!masterSerials.some((item) => item.toUpperCase() === serial)) {
      return serialErrorResponse(404, 40400101001, serialNotFoundMessage)
    }

    if (dataTemp.some((item) => item.nomorSerial.toUpperCase() === serial)) {
      return serialErrorResponse(409, 40900101001, serialAlreadyUsedMessage)
    }

    const created = generateWarrantyRegistration(nextId, body)
    nextId += 1
    dataTemp = [created, ...dataTemp]

    const desiredDataResponse = getdesiredDataResponse(
      TypeDataResponse.Created_Successfully,
      module,
      created.nomorRegistrasi,
    )
    return HttpResponse.json(responseWrapper(desiredDataResponse))
  }),

  http.post('/repair/warrantyregistration/v1/check-serial', async ({ request }) => {
    const body = (await request.json()) as { nomorSerial: string }
    const serial = (body.nomorSerial ?? '').trim().toUpperCase()

    if (!serial) {
      return serialErrorResponse(400, 40000101001, 'Nomor serial wajib diisi.')
    }

    if (!masterSerials.some((item) => item.toUpperCase() === serial)) {
      return serialErrorResponse(404, 40400101001, serialNotFoundMessage)
    }

    if (dataTemp.some((item) => item.nomorSerial.toUpperCase() === serial)) {
      return serialErrorResponse(409, 40900101001, serialAlreadyUsedMessage)
    }

    const response: RequestResponse<{ available: boolean }> = {
      code: 0,
      status: 'Success',
      responseCode: 20000101300,
      responseMessage: `${module} Check Serial Successful`,
      result: { available: true },
    }
    return HttpResponse.json(response)
  }),

  http.post('/repair/warrantyregistration/v1/_get-list-product', async ({ request }) => {
    const data = (await request.json()) as PagingDataV2
    return HttpResponse.json(getListGeneratorPagingData(data, productCatalog))
  }),
]