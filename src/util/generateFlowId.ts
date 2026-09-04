import appMetaData from '@/appMetaData'

export const generateFlowId = (): string => {
  const userId = appMetaData.anonymousUserId

  const path = typeof window === 'undefined' ? '' : window.location.pathname
  const segments = path.split('/').filter(Boolean)
  const moduleCode = segments.length > 0 ? segments.join('-').toUpperCase() : appMetaData.applicationCode

  return `${appMetaData.applicationCode}:${moduleCode}:${userId}:${new Date().toISOString().replace(/[\D]/g, '').slice(0, 17)}`
}