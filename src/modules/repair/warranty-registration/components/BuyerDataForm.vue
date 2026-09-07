<template>
  <FormContainer>
    <h2 class="text-base font-semibold text-ink-950">
      Data Pembeli
    </h2>

    <FormRow label="Nama" :without-after="false">
      <InputTextbox
        v-model="form.nama"
        label="Nama"
        name="nama"
        place-holder="Input Nama"
        required
      />
      <template #after>
        <InputValidationState name="nama" />
      </template>
    </FormRow>

    <FormRow label="Alamat Tempat Tinggal" :without-after="false">
      <InputTextbox
        v-model="form.alamatTempatTinggal"
        label="Alamat Tempat Tinggal"
        name="alamatTempatTinggal"
        place-holder="Input Alamat Tempat Tinggal"
        required
      />
      <template #after>
        <InputValidationState name="alamatTempatTinggal" />
      </template>
    </FormRow>

    <FormRow label="Nomor Telepon" :without-after="false" content-col-span="col-span-12 sm:col-span-4">
      <InputPhoneNumber
        v-model="form.nomorTelepon"
        label="Nomor Telepon"
        name="nomorTelepon"
        placeholder="Input Nomor Telepon (Wajib Angka)"
        required
      />
      <template #after>
        <InputValidationState name="nomorTelepon" />
      </template>
    </FormRow>

    <FormRow label="Alamat Email" :without-after="false">
      <InputEmail v-model="form.alamatEmail" name="alamatEmail" placeholder="Input Alamat Email" required />
      <template #after>
        <InputValidationState name="alamatEmail" />
      </template>
    </FormRow>

    <FormRow
      label="Foto KTP"
      tooltip-string="Panduan foto KTP yang benar"
      :guide-steps="fotoKtpGuideSteps"
      :without-after="false"
    >
      <InputFile
        v-model="form.fotoKtp"
        v-model:file="ktpFile"
        name="fotoKtp"
        hint="Upload 1 supported file: JPG, PNG. Max 2 MB."
        required
      />
      <template #after>
        <InputValidationState name="fotoKtp" />
      </template>
    </FormRow>
  </FormContainer>
</template>

<script setup lang="ts">
import FormContainer from '@/components/sharedComponents/container/FormContainer.vue'
import FormRow from '@/components/formRow/FormRow.vue'
import InputTextbox from '@/components/inputTextbox/InputTextbox.vue'
import InputEmail from '@/components/inputEmail/InputEmail.vue'
import InputPhoneNumber from '@/components/inputPhoneNumber/InputPhoneNumber.vue'
import InputFile from '@/components/inputFile/InputFile.vue'
import InputValidationState from '@/components/base/InputValidationState.vue'
import { WarrantyRegistrationFormModel } from '../models/warrantyRegistration.form.model'
import { fotoKtpGuideSteps } from '../composables/guideSteps'

const form = defineModel<WarrantyRegistrationFormModel>({ required: true })
const ktpFile = defineModel<File | null>('ktpFile', { default: null })
</script>
