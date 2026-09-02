import { http, HttpResponse } from 'msw'
import { seedTickets, generateTicketId, generateTicketNumber } from './domain/serviceTicket'
import { seedWarrantyRegistrations, generateWarrantyRegistration, productCatalog } from './domain/warrantyRegistration'
import type { ServiceTicket, ServiceTicketInput } from '@/models/serviceTicket'
import type { PingResponse } from '@/models/api'
import type { WarrantyRegistrationFormModel } from '@/modules/repair/warranty-registration/models/warranty-registration-form.model'

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let tickets: ServiceTicket[] = [...seedTickets]
let warrantyRegistrations = [...seedWarrantyRegistrations]

export const handlers = [
  http.get('/api/ping', async () => {
    await delay(150)
    const body: PingResponse = { ok: true, source: 'msw-mock', time: new Date().toISOString() }
    return HttpResponse.json(body)
  }),

  http.get('/api/tickets', async () => {
    await delay()
    return HttpResponse.json(tickets)
  }),

  http.post('/api/tickets', async ({ request }) => {
    await delay()
    const body = (await request.json()) as ServiceTicketInput
    const registration = warrantyRegistrations.find((item) => item.nomorRegistrasi === body.nomorRegistrasi)

    if (!registration) {
      return HttpResponse.json({ message: 'Nomor registrasi garansi tidak ditemukan' }, { status: 404 })
    }

    const id = generateTicketId()
    const newTicket: ServiceTicket = {
      id,
      nomorTiket: generateTicketNumber(id),
      nomorRegistrasi: registration.nomorRegistrasi,
      namaPelanggan: registration.nama,
      produk: registration.namaProduk,
      keluhan: body.keluhan,
      status: body.status,
      tanggalMasuk: new Date().toISOString().slice(0, 10),
    }

    tickets = [newTicket, ...tickets]
    return HttpResponse.json(newTicket, { status: 201 })
  }),

  http.put('/api/tickets/:id', async ({ params, request }) => {
    await delay()
    const id = Number(params.id)
    const body = (await request.json()) as ServiceTicketInput
    const index = tickets.findIndex((ticket) => ticket.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Tiket tidak ditemukan' }, { status: 404 })
    }

    const registration = warrantyRegistrations.find((item) => item.nomorRegistrasi === body.nomorRegistrasi)

    if (!registration) {
      return HttpResponse.json({ message: 'Nomor registrasi garansi tidak ditemukan' }, { status: 404 })
    }

    tickets[index] = {
      ...tickets[index],
      nomorRegistrasi: registration.nomorRegistrasi,
      namaPelanggan: registration.nama,
      produk: registration.namaProduk,
      keluhan: body.keluhan,
      status: body.status,
    }

    return HttpResponse.json(tickets[index])
  }),

  http.delete('/api/tickets/:id', async ({ params }) => {
    await delay()
    const id = Number(params.id)
    const exists = tickets.some((ticket) => ticket.id === id)
    if (!exists) {
      return HttpResponse.json({ message: 'Tiket tidak ditemukan' }, { status: 404 })
    }
    tickets = tickets.filter((ticket) => ticket.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/repair/products', async () => {
    await delay(150)
    return HttpResponse.json(productCatalog)
  }),

  http.get('/api/repair/warranty-registration', async () => {
    await delay()
    return HttpResponse.json(warrantyRegistrations)
  }),

  http.post('/api/repair/warranty-registration', async ({ request }) => {
    await delay()
    const body = (await request.json()) as WarrantyRegistrationFormModel
    const created = generateWarrantyRegistration(body)
    warrantyRegistrations = [created, ...warrantyRegistrations]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.get('/api/repair/warranty-registration/check-serial', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const serial = url.searchParams.get('serial') ?? ''
    const exists = warrantyRegistrations.some((item) => item.nomorSerial.toLowerCase() === serial.toLowerCase())
    return HttpResponse.json({ exists })
  }),
]