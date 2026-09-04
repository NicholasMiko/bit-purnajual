import { SortDirection } from '@/models/enum/sortDirection'

export type FilterRange = { min?: number; max?: number }
export type FilterDateRange = { startDate?: string; endDate?: string }
export type FilterCurrentStatus = { deleted: boolean; expired: boolean }

export type FilterValue =
  | string[]
  | FilterRange
  | FilterDateRange
  | FilterCurrentStatus
  | boolean
  | string
  | Record<string, unknown>
  | undefined

export interface PagingDataV2 {
  requestType: string
  size: number
  page: number
  sortBy: Record<string, SortDirection>
  filterBy: Record<string, FilterValue> & {
    moduleId?: string
    moduleCode?: string[]
    active?: boolean
    currentStatus?: FilterCurrentStatus
  }
}