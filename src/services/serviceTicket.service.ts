import endPoint from '@/endPoint'
import type { PagingDataV2 } from '@/models/paging.types'
import type { ApiResponse } from '@/models/responseMessage.model'
import type { Result } from '@/models/page'
import { Get, Post } from '@/services/apiTemplate.service'

export const TICKET_STATUS = [
  'Menunggu',
  'Diproses',
  'Menunggu Sparepart',
  'Selesai',
  'Dibatalkan',
] as const

export type TicketStatus = (typeof TICKET_STATUS)[number]

export interface ServiceTicketResponseModel {
  id: number
  nomorTiket: string
  nomorRegistrasi: string
  namaPelanggan: string
  produk: string
  keluhan: string
  status: TicketStatus
  tanggalMasuk: string
}

export interface ServiceTicketGetPayload {
  id: string
}

export interface ServiceTicketCreatePayload {
  nomorRegistrasi: string
  keluhan: string
  status: TicketStatus
}

export type ServiceTicketUpdatePayload = ServiceTicketCreatePayload & {
  id: string
}

export interface ServiceTicketDeletePayload {
  id: string
}

export const getServiceTicketList = async (
  body: PagingDataV2,
): Promise<Result<ServiceTicketResponseModel[]>> => {
  return Get<Result<ServiceTicketResponseModel[]>, PagingDataV2>(endPoint.repair.service_ticket.list, body)
}

export const getServiceTicketViewById = async (id: string): Promise<ServiceTicketResponseModel> => {
  const payload: ServiceTicketGetPayload = { id }
  return Get<ServiceTicketResponseModel, ServiceTicketGetPayload>(endPoint.repair.service_ticket.view, payload)
}

export const createServiceTicket = async (data: ServiceTicketCreatePayload): Promise<ApiResponse> => {
  return Post(endPoint.repair.service_ticket.create, data)
}

export const updateServiceTicket = async (data: ServiceTicketUpdatePayload): Promise<ApiResponse> => {
  return Post(endPoint.repair.service_ticket.update, data)
}

export const deleteServiceTicket = async (data: ServiceTicketDeletePayload): Promise<ApiResponse> => {
  return Post(endPoint.repair.service_ticket.delete, data)
}