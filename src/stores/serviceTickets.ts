import { defineStore } from 'pinia'
import { ticketService } from '@/services/ticketService'
import type { ServiceTicket, ServiceTicketInput } from '@/models/serviceTicket'

interface State {
  tickets: ServiceTicket[]
  isLoading: boolean
  error: string | null
}

export const useServiceTicketStore = defineStore('serviceTickets', {
  state: (): State => ({
    tickets: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    total: (state) => state.tickets.length,
  },

  actions: {
    async fetchTickets() {
      this.isLoading = true
      this.error = null
      try {
        this.tickets = await ticketService.list()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Gagal memuat data tiket'
      } finally {
        this.isLoading = false
      }
    },

    async createTicket(payload: ServiceTicketInput) {
      const created = await ticketService.create(payload)
      this.tickets = [created, ...this.tickets]
      return created
    },

    async updateTicket(id: number, payload: ServiceTicketInput) {
      const updated = await ticketService.update(id, payload)
      this.tickets = this.tickets.map((ticket) => (ticket.id === id ? updated : ticket))
      return updated
    },

    async deleteTicket(id: number) {
      await ticketService.remove(id)
      this.tickets = this.tickets.filter((ticket) => ticket.id !== id)
    },
  },
})
