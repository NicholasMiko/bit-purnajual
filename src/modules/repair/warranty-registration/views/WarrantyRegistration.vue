<template>
  <ConfirmationResponse
    v-if="isSubmitted"
    :nomor-registrasi="nomorRegistrasi"
    @register-again="onRegisterAgain"
  />

  <section v-else class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-ink-850">
          Registrasi Garansi Pembelian
        </h1>
        <p v-if="!isConfirmation" class="mt-3 text-sm text-ink-700">
          Step {{ currentStep }} of {{ totalStep }}
        </p>
      </div>
      <StepIndicator v-if="!isConfirmation" class="mt-14" :current="currentStep" :total="totalStep" />
    </div>

    <PageContainer>
      <PurchaseInfoForm
        v-if="isPurchaseInfoStep"
        v-model="warrantyRegistrationForm"
        v-model:invoice-file="invoiceFile"
        :product-catalog="store.productCatalog"
      />

      <BuyerDataForm
        v-if="isBuyerDataStep"
        v-model="warrantyRegistrationForm"
        v-model:ktp-file="ktpFile"
      />

      <RegistrationReview
        v-if="isConfirmation"
        :form="warrantyRegistrationForm"
        :invoice-file="invoiceFile"
        :ktp-file="ktpFile"
      />

      <div class="px-8 pb-8">
        <p v-if="isConfirmation" class="mb-4 text-lg font-bold text-ink-700">
          Apakah data yang di-input sudah benar semua?
        </p>

        <p v-if="submitError" class="mb-3 text-sm text-rose-600">
          {{ submitError }}
        </p>

        <div ref="actionRef" class="flex items-center gap-3 border-t border-ink-100 pt-5">
          <template v-if="isConfirmation">
            <button
              type="button"
              class="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              @click="onBack"
            >
              Kembali Perbaiki Data
            </button>
            <button
              type="button"
              class="rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              @click="onSubmit"
            >
              Ya, Kirim Data
            </button>
          </template>

          <template v-else>
            <button
              v-if="isBuyerDataStep"
              type="button"
              class="rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              @click="onBack"
            >
              Kembali
            </button>
            <button
              type="button"
              class="ml-auto rounded-md px-4 py-2 text-sm font-medium"
              :class="isStepValid
                ? 'bg-brand-500 text-white hover:bg-brand-600'
                : 'cursor-not-allowed bg-ink-100 text-ink-500'"
              :disabled="!isStepValid"
              @click="onNext"
            >
              {{ isBuyerDataStep ? 'Kirim Registrasi Garansi' : 'Lanjut' }}
            </button>
          </template>
        </div>
      </div>
    </PageContainer>

    <ScrollToActionButton v-if="isConfirmation" :target-ref="actionRef" label="Konfirmasi" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import PageContainer from '@/components/sharedComponents/container/PageContainer.vue'
import StepIndicator from '@/components/base/StepIndicator.vue'
import ScrollToActionButton from '@/components/base/ScrollToActionButton.vue'
import { useWarrantyRegistrationStore } from '@/stores/useWarrantyRegistrationStore'
import { WarrantyRegistrationFormModel } from '../models/warranty-registration-form.model'
import { WarrantyRegistrationStep } from '../models/warranty-registration-step.enum'
import PurchaseInfoForm from '../components/PurchaseInfoForm.vue'
import BuyerDataForm from '../components/BuyerDataForm.vue'
import RegistrationReview from '../components/RegistrationReview.vue'
import ConfirmationResponse from '../components/ConfirmationResponse.vue'

const purchaseInfoFields = [
  'merk',
  'tipeProduk',
  'namaProduk',
  'nomorSerial',
  'namaToko',
  'kota',
  'tanggalPembelian',
  'invoice',
  'fotoInvoicePembelian',
]

const buyerDataFields = ['nama', 'alamatTempatTinggal', 'nomorTelepon', 'alamatEmail', 'fotoKtp']

const totalStep = 2

const store = useWarrantyRegistrationStore()

const warrantyRegistrationForm = ref(new WarrantyRegistrationFormModel())
const invoiceFile = ref<File | null>(null)
const ktpFile = ref<File | null>(null)

const currentStep = ref<WarrantyRegistrationStep>(WarrantyRegistrationStep.PurchaseInfo)
const isConfirmation = ref(false)
const isSubmitted = ref(false)
const nomorRegistrasi = ref('')
const submitError = ref('')
const actionRef = ref<HTMLElement | null>(null)

const { errors, values, resetForm } = useForm({
  initialValues: new WarrantyRegistrationFormModel(),
})

const isPurchaseInfoStep = computed(() => !isConfirmation.value && currentStep.value === WarrantyRegistrationStep.PurchaseInfo)
const isBuyerDataStep = computed(() => !isConfirmation.value && currentStep.value === WarrantyRegistrationStep.BuyerData)

const isStepValid = computed(() => {
  const fields = isBuyerDataStep.value ? buyerDataFields : purchaseInfoFields
  return fields.every((field) => {
    const fieldValue = values[field as keyof typeof values]
    const isFilled = typeof fieldValue === 'string' ? fieldValue.trim().length > 0 : fieldValue != null
    return isFilled && !errors.value[field as keyof typeof errors.value]
  })
})

onMounted(() => {
  store.fetchRegistrations()
  store.fetchProductCatalog()
})

function onNext() {
  if (!isStepValid.value) return

  if (isPurchaseInfoStep.value) {
    currentStep.value = WarrantyRegistrationStep.BuyerData
    return
  }

  isConfirmation.value = true
}

function onBack() {
  if (isConfirmation.value) {
    isConfirmation.value = false
    currentStep.value = WarrantyRegistrationStep.BuyerData
    return
  }

  currentStep.value = WarrantyRegistrationStep.PurchaseInfo
}

async function onSubmit() {
  submitError.value = ''
  try {
    const created = await store.register(warrantyRegistrationForm.value)
    nomorRegistrasi.value = created.nomorRegistrasi
    isSubmitted.value = true
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Gagal menyimpan registrasi garansi'
  }
}

function onRegisterAgain() {
  warrantyRegistrationForm.value = new WarrantyRegistrationFormModel()
  invoiceFile.value = null
  ktpFile.value = null
  resetForm({ values: new WarrantyRegistrationFormModel() })
  currentStep.value = WarrantyRegistrationStep.PurchaseInfo
  isConfirmation.value = false
  isSubmitted.value = false
  nomorRegistrasi.value = ''
  submitError.value = ''
}
</script>
