export interface ResponseDetail {
  responseCode: number
  responseMessage: string
}

export interface Result {
  [key: string]: string | ResponseDetail[]

  statusDetail: string
  responseDetail: ResponseDetail[]
}

export interface ApiResponse {
  status: string
  code: number
  result: Result[]
}