export interface ApiErrorResponse {
  message: string
}

export interface PingResponse {
  ok: boolean
  source: string
  time: string
}

export interface ResponseDetail {
  responseCode: number
  responseMessage: string
}

export interface RequestResponse<T> {
  code: number
  status: string
  responseCode: number
  responseMessage: string
  result: T
}

export interface PagedResult<T> {
  content: T[]
  number: number
  numberOfElements: number
  totalElements: number
  totalPages: number
  size: number
}

export interface ActionResultItem {
  id: string
  statusDetail: string
  responseDetail: ResponseDetail[]
}

export interface ActionResponse {
  status: string
  code: number
  result: ActionResultItem[]
}
