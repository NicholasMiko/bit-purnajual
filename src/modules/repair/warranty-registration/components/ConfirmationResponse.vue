<template>
  <h1 class="pt-2 pb-2.5 text-3xl font-semibold text-ink-600">
    Confirmation Response
  </h1>
  <PageContainer>
    <div class="space-y-5 p-8 pb-13">
      <p class="text-sm text-ink-900">
        Terima kasih, data anda sudah kami terima.
      </p>
      <p class="text-sm text-ink-900">
        Bukti penerimaan sudah kami kirimkan ke alamat email yang diregistrasikan.
      </p>
      
      <p class="pt-6 text-sm font-bold text-ink-700">
        JIKA SUDAH TERVERIFIKASI, AKAN KAMI KIRIMKAN EMAIL LAGI.
      </p>
      <div class="flex items-center gap-120 pt-6">
        <button
          type="button"
          class="rounded-lg border border-ink-300 px-7 py-3 text-sm font-medium text-ink-700 hover:bg-ink-100"
          @click="emit('registerAgain')"
        >
          Registrasi Lagi Produk Lainnya
        </button>
        <RouterLink
          :to="{ name: 'service-tickets' }"
          class="rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
        >
          Lihat Tiket Servis
        </RouterLink>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/sharedComponents/container/PageContainer.vue'

defineProps({
  nomorRegistrasi: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{ registerAgain: [] }>()
</script>
