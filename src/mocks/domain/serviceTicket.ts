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
import { seedTickets, generateTicketNumber } from '@/mocks/utility/serviceTicketGenerator'
import { findRegistrationByNomor } from '@/mocks/domain/warrantyRegistration'
import type { ServiceTicketResponseModel, ServiceTicketCreatePayload } from '@/services/serviceTicket.service'

type ServiceTicketUpdateBody = ServiceTicketCreatePayload & { id: string }

const module = 'SERVICE_TICKET'

let dataTemp: ServiceTicketResponseModel[] = [...seedTickets]
let nextId = dataTemp.length + 1

function findItemById(id: string): ServiceTicketResponseModel | undefined {
  return dataTemp.find((item) => String(item.id) === id)
}

function defaultFilter(content: ServiceTicketResponseModel[], request: PagingDataV2): ServiceTicketResponseModel[] {
  const filterBy = request?.filterBy || {}
  let filteredContent = [...content]

  const textKeys: Array<keyof ServiceTicketResponseModel> = ['nomorTiket', 'nomorRegistrasi', 'namaPelanggan', 'produk', 'status']

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

function getList(request: PagingDataV2, content: ServiceTicketResponseModel[]): Response {
  return getListGeneratorPagingData(request, defaultFilter(content, request))
}

export const handlers = [
  http.post('/repair/serviceticket/v1/get-list', async ({ request }) => {
    const data = (await request.json()) as PagingDataV2
    return HttpResponse.json(getList(data, dataTemp))
  }),

  http.post('/repair/serviceticket/v1/get', async ({ request }) => {
    const body = (await request.json()) as { id: string }

    if (!body.id) return errorArrayResponse(module)

    const result = findItemById(body.id)
    if (!result) return errorArrayResponse(module)

    const response: RequestResponse<ServiceTicketResponseModel> = {
      code: 0,
      status: 'Success',
      responseCode: 20000101300,
      responseMessage: `${module} Get Successful`,
      result,
    }
    return HttpResponse.json(response)
  }),

  http.post('/repair/serviceticket/v1/create', async ({ request }) => {
    const body = (await request.json()) as ServiceTicketCreatePayload
    const registration = findRegistrationByNomor(body.nomorRegistrasi)

    if (!registration) return errorArrayResponse(module)

    const id = nextId
    nextId += 1

    const newTicket: ServiceTicketResponseModel = {
      id,
      nomorTiket: generateTicketNumber(id),
      nomorRegistrasi: registration.nomorRegistrasi,
      namaPelanggan: registration.nama,
      produk: registration.namaProduk,
      keluhan: body.keluhan,
      status: body.status,
      tanggalMasuk: new Date().toISOString().slice(0, 10),
    }

    dataTemp = [newTicket, ...dataTemp]

    const desiredDataResponse = getdesiredDataResponse(
      TypeDataResponse.Created_Successfully,
      module,
      newTicket.nomorTiket,
    )
    return HttpResponse.json(responseWrapper(desiredDataResponse))
  }),

  http.post('/repair/serviceticket/v1/update', async ({ request }) => {
    const body = (await request.json()) as ServiceTicketUpdateBody

    if (!body.id) return errorArrayResponse(module)

    const index = dataTemp.findIndex((item) => String(item.id) === body.id)
    if (index === -1) return errorArrayResponse(module)

    const registration = findRegistrationByNomor(body.nomorRegistrasi)
    if (!registration) return errorArrayResponse(module)

    dataTemp[index] = {
      ...dataTemp[index],
      nomorRegistrasi: registration.nomorRegistrasi,
      namaPelanggan: registration.nama,
      produk: registration.namaProduk,
      keluhan: body.keluhan,
      status: body.status,
    }

    const desiredDataResponse = getdesiredDataResponse(TypeDataResponse.Updated_Successfully, module, body.id)
    return HttpResponse.json(responseWrapper(desiredDataResponse))
  }),

  http.post('/repair/serviceticket/v1/delete', async ({ request }) => {
    const body = (await request.json()) as { id: string }

    if (!body.id) return errorArrayResponse(module)

    const exists = dataTemp.some((item) => String(item.id) === body.id)
    if (!exists) return errorArrayResponse(module)

    dataTemp = dataTemp.filter((item) => String(item.id) !== body.id)

    const desiredDataResponse = getdesiredDataResponse(TypeDataResponse.Deleted_Successfully, module, body.id)
    return HttpResponse.json(responseWrapper(desiredDataResponse))
  }),
]