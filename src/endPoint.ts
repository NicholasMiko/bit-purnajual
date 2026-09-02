
export const endPoint = {
  repair: {
    warrantyRegistration: '/api/repair/warranty-registration',
    warrantyRegistrationById: (id: number | string) => `/api/repair/warranty-registration/${id}`,
    product: '/api/repair/products',
    checkSerial: (serial: string) => `/api/repair/warranty-registration/check-serial?serial=${encodeURIComponent(serial)}`,
  },
  serviceTicket: {
    list: '/api/tickets',
    byId: (id: number | string) => `/api/tickets/${id}`,
  },
  utility: {
    ping: '/api/ping',
  },
} as const
