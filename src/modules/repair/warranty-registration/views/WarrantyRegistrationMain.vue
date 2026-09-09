<template>
  <section class="mx-auto max-w-5xl space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-ink-850">
          Registrasi Garansi Pembelian
        </h1>
        <p v-if="!isReviewStep" class="mt-3 text-sm text-ink-700">
          Step {{ currentStep }} of {{ totalStep }}
        </p>
      </div>
      <StepIndicator v-if="!isReviewStep" class="mt-14" :current="currentStep" :total="totalStep" />
    </div>

    <PageContainer>
      <PurchaseInfoForm
        v-if="isPurchaseInfoStep"
        v-model="warrantyRegistrationForm"
        v-model:invoice-file="invoiceFile"
        :product-catalog="productCatalog"
      />

      <BuyerDataForm
        v-if="isBuyerDataStep"
        v-model="warrantyRegistrationForm"
        v-model:ktp-file="ktpFile"
      />

      <RegistrationReview
        v-if="isReviewStep"
        :form="warrantyRegistrationForm"
        :invoice-file="invoiceFile"
        :ktp-file="ktpFile"
      />

      <div class="px-8 pb-8">
        <p v-if="isReviewStep" class="mb-4 text-lg font-bold text-ink-700">
          Apakah data yang di-input sudah benar semua?
        </p>

        <p v-if="submitError" class="mb-3 text-sm text-rose-600">
          {{ submitError }}
        </p>

        <p v-if="storageWarning" class="mb-3 text-sm text-amber-600">
          {{ storageWarning }}
        </p>

        <div ref="actionRef" class="flex items-center gap-3 border-t border-ink-100 pt-5">
          <template v-if="isReviewStep">
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

    <ScrollToActionButton v-if="isReviewStep" :target-ref="actionRef" label="Konfirmasi" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import PageContainer from '@/components/sharedComponents/container/PageContainer.vue'
import StepIndicator from '@/components/base/StepIndicator.vue'
import ScrollToActionButton from '@/components/base/ScrollToActionButton.vue'
import PurchaseInfoForm from '../components/PurchaseInfoForm.vue'
import BuyerDataForm from '../components/BuyerDataForm.vue'
import RegistrationReview from '../components/RegistrationReview.vue'
import { WarrantyRegistrationFormModel } from '../models/warrantyRegistration.form.model'
import {
  WarrantyRegistrationStep,
  stepByStepParam,
  stepParamByStep,
} from '../models/warrantyRegistration.step.enum'
import {
  getProductCatalogList,
  createWarrantyRegistration,
} from '../services/warrantyRegistration.service'
import { mapToWarrantyRegistrationCreatePayload } from '../mappers/warrantyRegistration.mapper'
import type { ProductCatalogResponseModel } from '../models/warrantyRegistration.response.model'
import {
  buildFileFromStored,
  clearDraft,
  loadDraft,
  readFileAsStored,
  saveDraft,
  type StoredFileModel,
} from '../utility/warrantyRegistration.storage'
import { validateSerialAvailability } from '../validations/nomorSerial.validation'

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

const pagingRequest = {
  requestType: 'LIST',
  page: 1,
  size: 100,
  sortBy: {},
  filterBy: {},
}

const route = useRoute()
const router = useRouter()

const draft = loadDraft()

const initialForm = buildInitialForm()

const warrantyRegistrationForm = ref(initialForm)
const productCatalog = ref<ProductCatalogResponseModel[]>([])
const invoiceFile = ref<File | null>(draft?.invoiceFile ? buildFileFromStored(draft.invoiceFile) : null)
const ktpFile = ref<File | null>(draft?.ktpFile ? buildFileFromStored(draft.ktpFile) : null)

const storedInvoiceFile = ref<StoredFileModel | null>(draft?.invoiceFile ?? null)
const storedKtpFile = ref<StoredFileModel | null>(draft?.ktpFile ?? null)

const submitError = ref('')
const storageWarning = ref('')
const actionRef = ref<HTMLElement | null>(null)

const { errors, values } = useForm({
  initialValues: { ...initialForm },
})

const currentStep = computed(
  () => stepByStepParam[String(route.params.step)] ?? WarrantyRegistrationStep.PurchaseInfo,
)

const isPurchaseInfoStep = computed(() => currentStep.value === WarrantyRegistrationStep.PurchaseInfo)
const isBuyerDataStep = computed(() => currentStep.value === WarrantyRegistrationStep.BuyerData)
const isReviewStep = computed(() => currentStep.value === WarrantyRegistrationStep.Review)

const isPurchaseInfoComplete = computed(() => hasFilledFields(purchaseInfoFields))
const isBuyerDataComplete = computed(() => hasFilledFields(buyerDataFields))

const isStepValid = computed(() => {
  const fields = isBuyerDataStep.value ? buyerDataFields : purchaseInfoFields
  return fields.every((field) => {
    const fieldValue = values[field as keyof typeof values]
    const isFilled = typeof fieldValue === 'string' ? fieldValue.trim().length > 0 : fieldValue != null
    return isFilled && !errors.value[field as keyof typeof errors.value]
  })
})

onMounted(() => {
  fetchProductCatalog()
})

watch(
  currentStep,
  (step) => {
    guardStep(step)
  },
  { immediate: true },
)

watch(
  warrantyRegistrationForm,
  () => {
    persistDraft()
  },
  { deep: true },
)

watch(invoiceFile, async (file) => {
  storedInvoiceFile.value = file ? await readFileAsStored(file) : null
  persistDraft()
})

watch(ktpFile, async (file) => {
  storedKtpFile.value = file ? await readFileAsStored(file) : null
  persistDraft()
})

function hasFilledFields(fields: string[]): boolean {
  return fields.every((field) => {
    const fieldValue = warrantyRegistrationForm.value[field as keyof WarrantyRegistrationFormModel]
    return typeof fieldValue === 'string' && fieldValue.trim().length > 0
  })
}

function guardStep(step: WarrantyRegistrationStep) {
  if (step === WarrantyRegistrationStep.PurchaseInfo) return

  if (!isPurchaseInfoComplete.value) {
    router.replace({ name: 'warrantyregistration-create', params: { step: stepParamByStep[WarrantyRegistrationStep.PurchaseInfo] } })
    return
  }

  if (step === WarrantyRegistrationStep.BuyerData) return

  if (!isBuyerDataComplete.value) {
    router.replace({ name: 'warrantyregistration-create', params: { step: stepParamByStep[WarrantyRegistrationStep.BuyerData] } })
  }
}

function buildInitialForm(): WarrantyRegistrationFormModel {
  const form = new WarrantyRegistrationFormModel()
  if (!draft) return form

  Object.keys(form).forEach((key) => {
    const typedKey = key as keyof WarrantyRegistrationFormModel
    if (draft.form[typedKey] !== undefined) form[typedKey] = draft.form[typedKey]
  })

  return form
}

function persistDraft() {
  const isSaved = saveDraft({
    form: warrantyRegistrationForm.value,
    invoiceFile: storedInvoiceFile.value,
    ktpFile: storedKtpFile.value,
  })

  storageWarning.value = isSaved
    ? ''
    : 'Data sementara tidak dapat disimpan karena ukuran berkas terlalu besar. Jangan menutup halaman sebelum registrasi dikirim.'
}

async function fetchProductCatalog() {
  try {
    const result = await getProductCatalogList(pagingRequest)
    productCatalog.value = result.content
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Gagal memuat katalog produk'
  }
}

function goToStep(step: WarrantyRegistrationStep) {
  router.push({ name: 'warrantyregistration-create', params: { step: stepParamByStep[step] } })
}

async function onNext() {
  if (!isStepValid.value) return

  submitError.value = ''

  if (isPurchaseInfoStep.value) {
    const serialResult = await validateSerialAvailability(warrantyRegistrationForm.value.nomorSerial)
    if (serialResult !== true) {
      submitError.value = serialResult
      return
    }

    goToStep(WarrantyRegistrationStep.BuyerData)
    return
  }

  goToStep(WarrantyRegistrationStep.Review)
}

function onBack() {
  if (isReviewStep.value) {
    goToStep(WarrantyRegistrationStep.BuyerData)
    return
  }

  goToStep(WarrantyRegistrationStep.PurchaseInfo)
}

async function onSubmit() {
  submitError.value = ''

  try {
    const payload = mapToWarrantyRegistrationCreatePayload(warrantyRegistrationForm.value)
    const response = await createWarrantyRegistration(payload)
    const nomorRegistrasi = String(response.result[0]?.id ?? '').replace('~uuid', '')

    clearDraft()
    router.replace({
      name: 'warrantyregistration-confirmation',
      query: { nomor: nomorRegistrasi },
    })
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Gagal menyimpan registrasi garansi'
  }
}
</script>