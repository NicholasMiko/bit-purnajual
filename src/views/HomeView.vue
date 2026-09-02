<template>
  <section class="space-y-8">
    <div>
      <h1 class="text-2xl font-semibold text-ink-950">
        bit-purnajual
      </h1>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <RouterLink
        :to="{ name: 'service-tickets' }"
        class="rounded-lg border border-ink-100 bg-panel p-5 transition-colors hover:border-brand-500"
      >
        <p class="text-sm text-ink-500">
          Total tiket servis
        </p>
        <p class="mt-1 text-3xl font-semibold text-ink-950">
          {{ ticketStore.total }}
        </p>
      </RouterLink>
      <RouterLink
        :to="{ name: 'warranty-registration' }"
        class="rounded-lg border border-ink-100 bg-panel p-5 transition-colors hover:border-brand-500"
      >
        <p class="text-sm text-ink-500">
          Total registrasi garansi
        </p>
        <p class="mt-1 text-3xl font-semibold text-ink-950">
          {{ warrantyStore.registrations.length }}
        </p>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useServiceTicketStore } from '@/stores/serviceTickets'
import { useWarrantyRegistrationStore } from '@/stores/useWarrantyRegistrationStore'

const ticketStore = useServiceTicketStore()
const warrantyStore = useWarrantyRegistrationStore()

onMounted(() => {
  ticketStore.fetchTickets()
  warrantyStore.fetchRegistrations()
})
</script>
