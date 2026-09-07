import type { ApiResponse } from '@/models/responseMessage'
import { RequestType } from '@/services/automic.enum'

export async function handleErrorResponse(response: Response, requestType: RequestType): Promise<never> {
  let message = `Request gagal dengan status ${response.status}`

  try {
    const body = (await response.clone().json()) as Partial<ApiResponse>
    const detail = body.result?.[0]?.responseDetail?.[0]?.responseMessage
    if (detail) message = detail
  } catch {
    message = `Request gagal dengan status ${response.status}`
  }

  const error = new Error(message)
  error.name = requestType
  throw error
}