<template>
  <FormContainer>
    <h2 class="text-base font-bold text-ink-700">
      Informasi Pembelian
    </h2>

    <FormRow label="Merk" :without-after="false">
      <Combobox
        v-model="form.merk"
        label="Merk"
        name="merk"
        value-key="value"
        label-key="label"
        place-holder="Search Merk"
        :options="brandOptions"
        required
      />
      <template #after>
        <FieldValidIcon name="merk" />
      </template>
    </FormRow>

    <FormRow label="Tipe Produk" :without-after="false">
      <Combobox
        v-model="form.tipeProduk"
        label="Tipe Produk"
        name="tipeProduk"
        value-key="value"
        label-key="label"
        place-holder="Search Tipe Produk"
        :options="typeOptions"
        :disabled="!form.merk"
        required
      />
      <template #after>
        <FieldValidIcon name="tipeProduk" />
      </template>
    </FormRow>

    <FormRow label="Nama Produk" :without-after="false">
      <InputReadOnlyText 
        v-model="form.namaProduk" 
        label="Nama Produk" 
        name="namaProduk" required 
      />
      <template #after>
        <FieldValidIcon name="namaProduk" />
      </template>
    </FormRow>

    <FormRow
      label="Nomor Serial"
      :guide-steps="nomorSerialGuideSteps"
      :without-after="false"
      content-col-span="col-span-12 sm:col-span-4"
    >
      <InputTextbox
        v-model="form.nomorSerial"
        label="Nomor Serial"
        name="nomorSerial"
        place-holder="Input Nomor Serial"
        :additional-rules="uniqueSerialRule"
        required
      />
      <template #after>
        <FieldValidIcon name="nomorSerial" />
      </template>
    </FormRow>

    <FormRow label="Nama Toko" :without-after="false">
      <InputTextbox 
        v-model="form.namaToko"
        label="Nama Toko"
        name="namaToko"
        place-holder="Input Nama Toko" required
      />
      <template #after>
        <FieldValidIcon name="namaToko" />
      </template>
    </FormRow>

    <FormRow label="Kota" :without-after="false">
      <InputTextbox 
        v-model="form.kota" 
        label="Kota" 
        name="kota" 
        place-holder="Input Kota" 
        required 
      />
      <template #after>
        <FieldValidIcon name="kota" />
      </template>
    </FormRow>

    <FormRow label="Tanggal Pembelian" :without-after="false" content-col-span="col-span-12 sm:col-span-4">
      <InputDate v-model="form.tanggalPembelian" name="tanggalPembelian" :max-date="today" required />
      <template #after>
        <FieldValidIcon name="tanggalPembelian" />
      </template>
    </FormRow>

    <FormRow label="Invoice" :without-after="false">
      <InputTextbox 
        v-model="form.invoice" 
        label="Invoice"
        name="invoice"
        place-holder="Input Invoice" required
      />
      <template #after>
        <FieldValidIcon name="invoice" />
      </template>
    </FormRow>

    <FormRow
      label="Foto Invoice Pembelian"
      :guide-steps="fotoInvoiceGuideSteps"
      :without-after="false"
    >
      <InputFile
        v-model="form.fotoInvoicePembelian"
        v-model:file="invoiceFile"
        name="fotoInvoicePembelian"
        hint="Upload 1 supported file: JPG, PNG. Max 2 MB."
        required
      />
      <template #after>
        <FieldValidIcon name="fotoInvoicePembelian" />
      </template>
    </FormRow>
  </FormContainer>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import FormContainer from '@/components/sharedComponents/container/FormContainer.vue'
import FormRow from '@/components/formRow/FormRow.vue'
import Combobox from '@/components/combobox/Combobox.vue'
import InputTextbox from '@/components/inputTextbox/InputTextbox.vue'
import InputDate from '@/components/inputDate/InputDate.vue'
import InputFile from '@/components/inputFile/InputFile.vue'
import InputReadOnlyText from '@/components/inputReadOnlyText/InputReadOnlyText.vue'
import FieldValidIcon from '@/components/base/FieldValidIcon.vue'
import { uniqueSerialRule } from '../validations/nomor-serial.validation'
import { WarrantyRegistrationFormModel } from '../models/warranty-registration-form.model'
import type { ProductCatalogModel } from '../models/warranty-registration.model'
import { fotoInvoiceGuideSteps, nomorSerialGuideSteps } from '../composables/guide-steps'


const form = defineModel<WarrantyRegistrationFormModel>({ required: true })
const invoiceFile = defineModel<File | null>('invoiceFile', { default: null })

const props = defineProps({
  productCatalog: {
    type: Array as () => ProductCatalogModel[],
    default: () => [],
  },
})

const today = new Date().toISOString().slice(0, 10)

const brandOptions = computed(() =>
  [...new Set(props.productCatalog.map((product) => product.merk))].map((brand) => ({ value: brand, label: brand })),
)

const typeOptions = computed(() =>
  props.productCatalog
    .filter((product) => product.merk === form.value.merk)
    .map((product) => ({ value: product.tipeProduk, label: product.tipeProduk })),
)

watch(
  () => form.value.merk,
  () => {
    form.value.tipeProduk = ''
    form.value.namaProduk = ''
  },
)

watch(
  () => form.value.tipeProduk,
  (tipeProduk) => {
    const product = props.productCatalog.find(
      (item) => item.merk === form.value.merk && item.tipeProduk === tipeProduk,
    )
    form.value.namaProduk = product ? product.namaProduk : ''
  },
)
</script>
