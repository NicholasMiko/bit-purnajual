
import { fetchRequestGeneral } from './fetchRequestGeneral'

export const fetchRequest = {
  get<T>(url: string): Promise<T> {
    return fetchRequestGeneral<T>(url)
  },
  post<T>(url: string, body: unknown): Promise<T> {
    return fetchRequestGeneral<T>(url, { method: 'POST', body })
  },
  put<T>(url: string, body: unknown): Promise<T> {
    return fetchRequestGeneral<T>(url, { method: 'PUT', body })
  },
  delete<T>(url: string): Promise<T> {
    return fetchRequestGeneral<T>(url, { method: 'DELETE' })
  },
}
