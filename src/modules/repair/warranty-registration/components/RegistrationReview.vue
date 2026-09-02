<template>
  <FormContainer>
    <div>
      <h2 class="mb-2 text-lg font-bold text-ink-700">
        Informasi Pembelian
      </h2>
      <dl>
        <div v-for="item in purchaseInfoItems" :key="item.label" class="grid grid-cols-12 gap-4 py-2">
          <dt class="col-span-4 text-sm font-medium text-ink-900">
            {{ item.label }}
          </dt>
          <dd class="col-span-8 text-sm text-ink-900">
            {{ item.value || '-' }}
          </dd>
        </div>
        <div class="grid grid-cols-12 gap-4 py-3">
          <dt class="col-span-4 text-sm font-medium text-ink-900">
            Foto Invoice Pembelian
          </dt>
          <dd class="col-span-8">
            <FilePreview :file="invoiceFile" />
          </dd>
        </div>
      </dl>
    </div>

    <div>
      <h2 class="mb-2 text-lg font-bold text-ink-700">
        Data Pembeli
      </h2>
      <dl>
        <div v-for="item in buyerDataItems" :key="item.label" class="grid grid-cols-12 gap-4 py-2">
          <dt class="col-span-4 text-sm font-medium text-ink-900">
            {{ item.label }}
          </dt>
          <dd class="col-span-8 text-sm text-ink-900">
            {{ item.value || '-' }}
          </dd>
        </div>
        <div class="grid grid-cols-12 gap-4 py-3">
          <dt class="col-span-4 text-sm font-medium text-ink-900">
            Foto KTP
          </dt>
          <dd class="col-span-8">
            <FilePreview :file="ktpFile" />
          </dd>
        </div>
      </dl>
    </div>
  </FormContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FormContainer from '@/components/sharedComponents/container/FormContainer.vue'
import FilePreview from '@/components/base/FilePreview.vue'
import { WarrantyRegistrationFormModel } from '../models/warranty-registration-form.model'

const props = defineProps({
  form: {
    type: Object as () => WarrantyRegistrationFormModel,
    required: true,
  },
  invoiceFile: {
    type: Object as () => File | null,
    default: null,
  },
  ktpFile: {
    type: Object as () => File | null,
    default: null,
  },
})

const purchaseInfoItems = computed(() => [
  { label: 'Merk', value: props.form.merk },
  { label: 'Tipe Produk', value: props.form.tipeProduk },
  { label: 'Nama Produk', value: props.form.namaProduk },
  { label: 'Nomor Serial', value: props.form.nomorSerial },
  { label: 'Nama Toko', value: props.form.namaToko },
  { label: 'Kota', value: props.form.kota },
  { label: 'Tanggal Pembelian', value: formatDate(props.form.tanggalPembelian) },
  { label: 'Invoice', value: props.form.invoice },
])

const buyerDataItems = computed(() => [
  { label: 'Nama', value: props.form.nama },
  { label: 'Alamat Tempat Tinggal', value: props.form.alamatTempatTinggal },
  { label: 'Nomor Telepon', value: props.form.nomorTelepon },
  { label: 'Alamat Email', value: props.form.alamatEmail },
])

function formatDate(value: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(value))
    .toUpperCase()
}
</script>
