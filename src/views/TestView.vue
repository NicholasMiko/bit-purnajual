<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-ink-950">
        Katalog Komponen
      </h1>
    </div>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Input Textbox
        </h2>

        <FormRow label="Huruf kapital" :without-after="false">
          <InputTextbox
            v-model="form.textboxUppercase" name="textboxUppercase" label="Huruf kapital" place-holder="Otomatis kapital"
            uppercase
          />
          <template #after>
            <FieldValidIcon name="textboxUppercase" />
          </template>
        </FormRow>

        <FormRow label="Nonaktif" without-after>
          <InputTextbox
            v-model="form.textboxDisabled" name="textboxDisabled" label="Nonaktif" place-holder="Tidak bisa diisi"
            disabled
          />
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Input Email dan Nomor Telepon
        </h2>

        <FormRow label="Email" :without-after="false">
          <InputEmail v-model="form.email" name="email" placeholder="nama@perusahaan.com" required />
          <template #after>
            <FieldValidIcon name="email" />
          </template>
        </FormRow>

        <FormRow label="Nomor telepon" :without-after="false" content-col-span="col-span-12 sm:col-span-4">
          <InputPhoneNumber
            v-model="form.phone" name="phone" label="Nomor telepon" placeholder="08xxxxxxxxxx"
            required
          />
          <template #after>
            <FieldValidIcon name="phone" />
          </template>
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Combobox
        </h2>

        <FormRow label="Pilihan tersedia" :without-after="false">
          <Combobox
            v-model="form.comboFilled"
            name="comboFilled"
            label="Pilihan tersedia"
            value-key="value"
            label-key="label"
            place-holder="Pilih salah satu"
            :options="sampleOptions"
            required
          />
          <template #after>
            <FieldValidIcon name="comboFilled" />
          </template>
        </FormRow>

        <FormRow label="Tanpa pilihan" without-after>
          <Combobox
            v-model="form.comboEmpty"
            name="comboEmpty"
            label="Tanpa pilihan"
            value-key="value"
            label-key="label"
            place-holder="Belum ada data"
            :options="[]"
          />
        </FormRow>

        <FormRow label="Nonaktif" without-after>
          <Combobox
            v-model="form.comboDisabled"
            name="comboDisabled"
            label="Nonaktif"
            value-key="value"
            label-key="label"
            place-holder="Tidak bisa dipilih"
            :options="sampleOptions"
            disabled
          />
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Input Date
        </h2>

        <FormRow label="Bebas" :without-after="false" content-col-span="col-span-12 sm:col-span-4">
          <InputDate v-model="form.dateFree" name="dateFree" required />
          <template #after>
            <FieldValidIcon name="dateFree" />
          </template>
        </FormRow>

        <FormRow label="Maks. Current Date" :without-after="false" content-col-span="col-span-12 sm:col-span-4">
          <InputDate v-model="form.datePast" name="datePast" :max-date="today" required />
          <template #after>
            <FieldValidIcon name="datePast" />
          </template>
        </FormRow>

        <FormRow label="Nonaktif" without-after content-col-span="col-span-12 sm:col-span-4">
          <InputDate v-model="form.dateDisabled" name="dateDisabled" disabled />
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Input Text Area
        </h2>

        <FormRow label="Remarks" :without-after="false">
          <InputTextArea
            v-model="form.textArea"
            name="textArea"
            label="Remarks"
            place-holder="Maksimal 200 karakter"
            :max-length="200"
            required
          />
          <template #after>
            <FieldValidIcon name="textArea" />
          </template>
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Input File
        </h2>

        <FormRow label="Upload File" tooltip-string="Format JPG atau PNG, maksimal 2 MB" :without-after="false">
          <InputFile
            v-model="form.file" v-model:file="uploadedFile" name="file" hint="Upload 1 supported file: JPG, PNG. Max 2 MB."
            required
          />
          <template #after>
            <FieldValidIcon name="file" />
          </template>
        </FormRow>

        <FormRow label="Preview" without-after>
          <FilePreview :file="uploadedFile" />
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Input Read Only Text
        </h2>

        <FormRow label="Reactive" :without-after="false">
          <InputReadOnlyText v-model="form.readOnly" name="readOnly" label="Reactive" />
          <template #after>
            <FieldValidIcon name="readOnly" />
          </template>
        </FormRow>

        <FormRow label="Isi" without-after>
          <InputTextbox v-model="form.readOnly" name="readOnlySource" label="Isi" place-holder="Ketik di sini" />
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Form Row
        </h2>

        <FormRow label="Tooltip" :guide-steps="sampleGuideSteps" without-after>
          <p class="text-sm text-ink-500">
            Klik ikon tooltip.
          </p>
        </FormRow>

        <FormRow label="Hint" hint="test123" without-after>
          <p class="text-sm text-ink-500">
            Keterangan tambahan.
          </p>
        </FormRow>

        <FormRow label="Kolom pendek" without-after content-col-span="col-span-12 sm:col-span-4">
          <InputTextbox v-model="form.shortColumn" name="shortColumn" label="Kolom pendek" place-holder="Lebar dipersempit" />
        </FormRow>
      </FormContainer>
    </PageContainer>

    <PageContainer>
      <FormContainer>
        <h2 class="text-base font-semibold text-ink-950">
          Komponen Tampilan
        </h2>

        <FormRow label="Status badge" without-after>
          <div class="flex flex-wrap gap-2">
            <StatusBadge status="Menunggu" :tone-map="statusTone" />
            <StatusBadge status="Diproses" :tone-map="statusTone" />
            <StatusBadge status="Selesai" :tone-map="statusTone" />
            <StatusBadge status="Dibatalkan" :tone-map="statusTone" />
          </div>
        </FormRow>

        <FormRow label="Step indicator" without-after>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="text-sm text-ink-500">Step 1 of 2</span>
              <StepIndicator :current="1" :total="2" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-ink-500">Step 2 of 2</span>
              <StepIndicator :current="2" :total="2" />
            </div>
          </div>
        </FormRow>

        <FormRow label="Alert modal" without-after>
          <button
            type="button"
            class="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            @click="openAlert"
          >
            Tampilkan modal
          </button>
        </FormRow>

        <FormRow label="Ikon" without-after>
          <div class="flex flex-wrap items-center gap-4 text-ink-700">
            <Icon :icon-types="iconType.Info" custom-class="h-5 w-5" />
            <Icon :icon-types="iconType.Calendar" custom-class="h-5 w-5" />
            <Icon :icon-types="iconType.Upload" custom-class="h-5 w-5" />
            <Icon :icon-types="iconType.Download" custom-class="h-5 w-5" />
            <Icon :icon-types="iconType.Chevron" custom-class="h-5 w-5" />
            <Icon :icon-types="iconType.Check" custom-class="h-5 w-5" />
            <Icon :icon-types="iconType.Warning" custom-class="h-5 w-5" />
          </div>
        </FormRow>
      </FormContainer>
    </PageContainer>

    <AlertModal
      v-if="isAlertOpen"
      title="Contoh Judul Modal"
      message="Ini contoh pesan yang muncul di dalam modal peringatan."
      @close="closeAlert"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import PageContainer from '@/components/sharedComponents/container/PageContainer.vue'
import FormContainer from '@/components/sharedComponents/container/FormContainer.vue'
import FormRow from '@/components/formRow/FormRow.vue'
import InputTextbox from '@/components/inputTextbox/InputTextbox.vue'
import InputEmail from '@/components/inputEmail/InputEmail.vue'
import InputPhoneNumber from '@/components/inputPhoneNumber/InputPhoneNumber.vue'
import InputTextArea from '@/components/inputTextArea/InputTextArea.vue'
import InputDate from '@/components/inputDate/InputDate.vue'
import InputFile from '@/components/inputFile/InputFile.vue'
import InputReadOnlyText from '@/components/inputReadOnlyText/InputReadOnlyText.vue'
import Combobox from '@/components/combobox/Combobox.vue'
import FieldValidIcon from '@/components/base/FieldValidIcon.vue'
import FilePreview from '@/components/base/FilePreview.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'
import StepIndicator from '@/components/base/StepIndicator.vue'
import AlertModal from '@/components/base/AlertModal.vue'
import Icon from '@/components/icons/Icon.vue'
import { iconType } from '@/models/enum/iconType'
import { ComponentCatalogModel } from '@/models/component-catalog.model'

const today = new Date().toISOString().slice(0, 10)

const sampleOptions = [
  { value: 'satu', label: 'Pilihan Satu' },
  { value: 'dua', label: 'Pilihan Dua' },
  { value: 'tiga', label: 'Pilihan Tiga' },
]

const sampleGuideSteps = [
  { title: 'Panduan Langkah 1' },
  { title: 'Panduan Langkah 2' },
  { title: 'Panduan Langkah 3' },
]

const statusTone: Record<string, string> = {
  Menunggu: 'bg-ink-100 text-ink-700',
  Diproses: 'bg-brand-100 text-brand-500',
  Selesai: 'bg-brand-500 text-white',
  Dibatalkan: 'bg-rose-100 text-rose-600',
}

const form = ref(new ComponentCatalogModel())
const uploadedFile = ref<File | null>(null)
const isAlertOpen = ref(false)

useForm({ initialValues: new ComponentCatalogModel() })

function openAlert() {
  isAlertOpen.value = true
}

function closeAlert() {
  isAlertOpen.value = false
}
</script>
