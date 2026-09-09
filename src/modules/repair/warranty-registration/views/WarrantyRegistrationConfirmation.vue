<template>
  <section class="mx-auto max-w-5xl">
    <ConfirmationResponse :nomor-registrasi="nomorRegistrasi" @register-again="onRegisterAgain" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmationResponse from '../components/ConfirmationResponse.vue'
import { clearDraft } from '../utility/warrantyRegistration.storage'

const route = useRoute()
const router = useRouter()

const nomorRegistrasi = computed(() => String(route.query.nomor ?? ''))

onMounted(() => {
  if (!nomorRegistrasi.value) goToFirstStep()
})

function onRegisterAgain() {
  clearDraft()
  goToFirstStep()
}

function goToFirstStep() {
  router.replace({ name: 'warrantyregistration-create', params: { step: 'step1' } })
}
</script>