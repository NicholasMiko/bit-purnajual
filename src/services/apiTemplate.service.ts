import fetchRequest from '@/fetchRequest'
import type { ApiResponse } from '@/models/responseMessage.model'
import type { RequestResponse } from '@/models/api'
import { generateFlowId } from '@/util/generateFlowId'
import { useLoading } from '@/composable/useLoading'
import { handleErrorResponse } from '@/services/apiErrorHandler.service'
import { RequestType } from '@/services/automic.enum'
import { useNotificationStore } from '@/stores/notification/notificationStore'

const { startLoading, finishLoading } = useLoading()

export const Post = async <T>(endpoint: string, data: T): Promise<ApiResponse> => {
  const loadingId = startLoading()
  try {
    const notification = useNotificationStore()
    const response = await fetchRequest(endpoint, {
      isAuth: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-FLOW-ID': generateFlowId() },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      await handleErrorResponse(response, RequestType.Automic)
    }

    const result = (await response.json()) as ApiResponse
    const responseMessage = result.result?.[0]?.responseDetail?.[0]?.responseMessage || '-'
    const statusDetail = result.result?.[0]?.statusDetail || '-'
    notification.showNotification(Date.now(), responseMessage, statusDetail)

    return result
  } finally {
    finishLoading(loadingId)
  }
}

export const Get = async <T, U = undefined>(endpoint: string, body?: U): Promise<T> => {
  const loadingId = startLoading()
  try {
    const response = await fetchRequest(endpoint, {
      isAuth: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-FLOW-ID': generateFlowId() },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      await handleErrorResponse(response, RequestType.NonAutomic)
    }

    const data = (await response.json()) as RequestResponse<T>
    return data.result
  } finally {
    finishLoading(loadingId)
  }
}