<template>
  <section class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-ink-950">
          Tiket Servis
        </h1>
        <p class="mt-1 text-sm text-ink-500">
          Test CRUD.
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        @click="openCreateForm"
      >
        Tiket Baru
      </button>
    </div>

    <p v-if="ticketStore.error" class="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ ticketStore.error }}
    </p>

    <PageContainer>
      <table class="w-full text-left text-sm">
        <thead class="border-b border-ink-100 bg-ink-100/40 text-ink-500">
          <tr>
            <th class="px-4 py-3 font-medium">
              No. Tiket
            </th>
            <th class="px-4 py-3 font-medium">
              No. Registrasi
            </th>
            <th class="px-4 py-3 font-medium">
              Pelanggan
            </th>
            <th class="px-4 py-3 font-medium">
              Produk
            </th>
            <th class="px-4 py-3 font-medium">
              Keluhan
            </th>
            <th class="px-4 py-3 font-medium">
              Status
            </th>
            <th class="px-4 py-3 text-right font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ticketStore.isLoading">
            <td colspan="7" class="px-4 py-6 text-center text-ink-500">
              Memuat data tiket...
            </td>
          </tr>
          <tr v-else-if="ticketStore.tickets.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-ink-500">
              Belum ada tiket servis.
            </td>
          </tr>
          <tr
            v-for="ticket in ticketStore.tickets"
            :key="ticket.id"
            class="border-b border-ink-100 last:border-0 hover:bg-ink-100/30"
          >
            <td class="px-4 py-3 font-medium text-ink-950">
              {{ ticket.nomorTiket }}
            </td>
            <td class="px-4 py-3 text-brand-500">
              {{ ticket.nomorRegistrasi }}
            </td>
            <td class="px-4 py-3">
              {{ ticket.namaPelanggan }}
            </td>
            <td class="px-4 py-3">
              {{ ticket.produk }}
            </td>
            <td class="max-w-xs truncate px-4 py-3" :title="ticket.keluhan">
              {{ ticket.keluhan }}
            </td>
            <td class="px-4 py-3">
              <StatusBadge :status="ticket.status" :tone-map="statusTone" />
            </td>
            <td class="px-4 py-8 text-right">
              <button type="button" class="mr-3 text-sm font-medium text-brand-500 hover:underline" @click="openEditForm(ticket)">
                Ubah
              </button>
              <button type="button" class="mr-1 text-sm font-medium text-rose-600 hover:underline" @click="askDelete(ticket)">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </PageContainer>

    <div v-if="isFormOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/40 p-4">
      <div class="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-panel shadow-xl">
        <form novalidate @submit="onSubmit">
          <FormContainer>
            <h2 class="text-base font-semibold text-ink-950">
              {{ editingId ? 'Ubah Tiket Servis' : 'Tiket Servis Baru' }}
            </h2>

            <FormRow label="Nomor Registrasi" :without-after="false">
              <Combobox
                v-model="form.nomorRegistrasi"
                name="nomorRegistrasi"
                label="Nomor Registrasi"
                value-key="value"
                label-key="label"
                place-holder="Pilih registrasi garansi"
                :options="registrationOptions"
                required
              />
              <template #after>
                <FieldValidIcon name="nomorRegistrasi" />
              </template>
            </FormRow>

            <FormRow label="Nama Pelanggan" without-after>
              <p class="text-sm text-ink-900">
                {{ form.namaPelanggan || '—' }}
              </p>
            </FormRow>

            <FormRow label="Produk" without-after>
              <p class="text-sm text-ink-900">
                {{ form.produk || '—' }}
              </p>
            </FormRow>

            <FormRow label="Keluhan" :without-after="false">
              <InputTextArea
                v-model="form.keluhan"
                name="keluhan"
                label="Keluhan"
                place-holder="Jelaskan keluhan pelanggan"
                :max-length="500"
                required
              />
              <template #after>
                <FieldValidIcon name="keluhan" />
              </template>
            </FormRow>

            <FormRow label="Status" :without-after="false">
              <Combobox
                v-model="form.status"
                name="status"
                label="Status"
                value-key="value"
                label-key="label"
                place-holder="Pilih status"
                :options="statusOptions"
                required
              />
              <template #after>
                <FieldValidIcon name="status" />
              </template>
            </FormRow>

            <p v-if="formError" class="text-sm text-rose-600">
              {{ formError }}
            </p>

            <div class="flex justify-end gap-3 border-t border-ink-100 pt-5">
              <button
                type="button"
                class="rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
                @click="closeForm"
              >
                Batal
              </button>
              <button
                type="submit"
                class="rounded-md px-4 py-2 text-sm font-medium"
                :class="isFormValid ? 'bg-brand-500 text-white hover:bg-brand-600' : 'cursor-not-allowed bg-ink-100 text-ink-500'"
                :disabled="!isFormValid"
              >
                Simpan
              </button>
            </div>
          </FormContainer>
        </form>
      </div>
    </div>

    <div v-if="deletingTicket" class="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/40 p-4">
      <div class="w-full max-w-sm rounded-lg bg-panel p-8 shadow-xl">
        <h2 class="text-lg font-semibold text-ink-950">
          Hapus tiket?
        </h2>
        <p class="mt-2 text-sm text-ink-500">
          Tiket {{ deletingTicket.nomorTiket }} milik {{ deletingTicket.namaPelanggan }} akan dihapus.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            @click="cancelDelete"
          >
            Batal
          </button>
          <button
            type="button"
            class="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
            @click="confirmDelete"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import PageContainer from '@/components/sharedComponents/container/PageContainer.vue'
import FormContainer from '@/components/sharedComponents/container/FormContainer.vue'
import FormRow from '@/components/formRow/FormRow.vue'
import Combobox from '@/components/combobox/Combobox.vue'
import InputTextArea from '@/components/inputTextArea/InputTextArea.vue'
import FieldValidIcon from '@/components/base/FieldValidIcon.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'
import { useServiceTicketStore } from '@/stores/serviceTickets'
import { useWarrantyRegistrationStore } from '@/stores/useWarrantyRegistrationStore'
import { ServiceTicketFormModel } from '@/models/service-ticket-form.model'
import { TICKET_STATUS, type ServiceTicket, type ServiceTicketInput } from '@/models/serviceTicket'

const ticketStore = useServiceTicketStore()
const warrantyStore = useWarrantyRegistrationStore()

const form = ref(new ServiceTicketFormModel())
const isFormOpen = ref(false)
const editingId = ref<number | null>(null)
const deletingTicket = ref<ServiceTicket | null>(null)
const formError = ref('')

const { values, errors, resetForm } = useForm({ initialValues: new ServiceTicketFormModel() })

const statusTone: Record<string, string> = {
  Menunggu: 'bg-ink-100 text-ink-700',
  Diproses: 'bg-brand-100 text-brand-500',
  Selesai: 'bg-brand-500 text-white',
  Dibatalkan: 'bg-rose-100 text-rose-600',
}

const statusOptions = TICKET_STATUS.map((status) => ({ value: status, label: status }))

const registrationOptions = computed(() =>
  warrantyStore.registrations.map((registration) => ({
    value: registration.nomorRegistrasi,
    label: `${registration.nomorRegistrasi} — ${registration.nama}`,
  })),
)

const isFormValid = computed(() => {
  const requiredFields = ['nomorRegistrasi', 'keluhan', 'status']
  return requiredFields.every((field) => {
    const fieldValue = values[field as keyof typeof values]
    const isFilled = typeof fieldValue === 'string' ? fieldValue.trim().length > 0 : fieldValue != null
    return isFilled && !errors.value[field as keyof typeof errors.value]
  })
})

onMounted(() => {
  ticketStore.fetchTickets()
  warrantyStore.fetchRegistrations()
})

watch(
  () => form.value.nomorRegistrasi,
  (nomorRegistrasi) => {
    const registration = warrantyStore.registrations.find((item) => item.nomorRegistrasi === nomorRegistrasi)
    form.value.namaPelanggan = registration ? registration.nama : ''
    form.value.produk = registration ? registration.namaProduk : ''
  },
)

function openCreateForm() {
  editingId.value = null
  formError.value = ''
  form.value = new ServiceTicketFormModel()
  resetForm({ values: new ServiceTicketFormModel() })
  isFormOpen.value = true
}

function openEditForm(ticket: ServiceTicket) {
  editingId.value = ticket.id
  formError.value = ''

  const nextForm = new ServiceTicketFormModel()
  nextForm.nomorRegistrasi = ticket.nomorRegistrasi
  nextForm.namaPelanggan = ticket.namaPelanggan
  nextForm.produk = ticket.produk
  nextForm.keluhan = ticket.keluhan
  nextForm.status = ticket.status

  form.value = nextForm
  resetForm({ values: nextForm })
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingId.value = null
  formError.value = ''
}

async function onSubmit(event: Event) {
  event.preventDefault()
  if (!isFormValid.value) return

  formError.value = ''
  const payload: ServiceTicketInput = {
    nomorRegistrasi: form.value.nomorRegistrasi,
    keluhan: form.value.keluhan,
    status: form.value.status as ServiceTicketInput['status'],
  }

  try {
    if (editingId.value) {
      await ticketStore.updateTicket(editingId.value, payload)
    } else {
      await ticketStore.createTicket(payload)
    }
    closeForm()
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Gagal menyimpan tiket'
  }
}

function askDelete(ticket: ServiceTicket) {
  deletingTicket.value = ticket
}

function cancelDelete() {
  deletingTicket.value = null
}

async function confirmDelete() {
  if (!deletingTicket.value) return
  await ticketStore.deleteTicket(deletingTicket.value.id)
  deletingTicket.value = null
}
</script>