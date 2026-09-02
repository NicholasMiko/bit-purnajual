import { fetchRequest } from '@/fetchRequest'
import { endPoint } from '@/endPoint'
import type { PingResponse } from '@/models/api'

export const pingService = {
  ping(): Promise<PingResponse> {
    return fetchRequest.get<PingResponse>(endPoint.utility.ping)
  },
}
