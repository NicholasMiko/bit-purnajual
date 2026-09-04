export interface Page<T> {
  code: number
  responseCode: number
  responseMessage: string
  result: Result<T>
  status: string
}

export interface Result<T> {
  content: T
  number: number
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
}