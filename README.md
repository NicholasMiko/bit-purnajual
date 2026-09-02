# bit-purnajual

Prolog
konsumen akan diminta untuk input nomor garansi ke pabrik. karna project ini hanya akan digunakan konsumen, maka project dipisahkan dari phoenix-reborn

## Stack

- Vue 3 (Composition API, `<script setup>`) + TypeScript
- Vite
- Vue Router, Pinia
- Tailwind CSS v4 (via PostCSS)
- vee-validate + yup untuk validasi form
- MSW + `@faker-js/faker` untuk mocking API saat pengembangan
- ESLint (flat config)

Path alias: `@` mengarah ke `./src`

## Menjalankan

```bash
npm install
npm run dev          # dev server, mock API aktif otomatis
npm run sit          # dev server dengan mode sit
npm run build        # type-check + build produksi
npm run build-only   # build tanpa type-check
npm run type-check   # hanya type-check
npm run lint         # cek ESLint
npm run lint:fix     # perbaiki otomatis pelanggaran style
npm run preview      # preview hasil build
```

## Halaman

| Route | Halaman |
|---|---|
| `/` | Ringkasan |
| `/repair/registrasi-garansi-pembelian` | Registrasi Garansi Pembelian |
| `/tiket-servis` | Tiket Servis |
| `/test` | Halaman pengecekan fitur |

## Struktur

```
src/
  App.vue
  main.ts
  style.css
  appMetaData.ts            metadata aplikasi
  endPoint.ts               daftar endpoint API per domain
  fetchRequest.ts           helper get/post/put/delete
  fetchRequestGeneral.ts    pembungkus dasar fetch

  assets/
  components/
    base/                   AlertModal, FieldValidIcon, FilePreview,
                            ScrollToActionButton, StatusBadge, StepIndicator
    combobox/               Combobox
    formRow/                FormRow
    icons/                  Icon
    inputDate/              InputDate
    inputEmail/             InputEmail
    inputFile/              InputFile
    inputPhoneNumber/       InputPhoneNumber
    inputReadOnlyText/      InputReadOnlyText
    inputStringNumber/      InputStringNumber
    inputTextArea/          InputTextArea
    inputTextbox/           InputTextbox
    sharedComponents/
      container/            FormContainer, PageContainer
    ErrorMessages.vue
  composable/               fungsi reusable Composition API
  mocks/
    domain/                 data dummy per domain
    handlers.ts
    browser.ts
  models/                   tipe dan enum bersama
  modules/
    repair/
      warranty-registration/
        components/
        mappers/
        models/
        schemas/
        services/
        validations/
        views/
  router/
    modules/                definisi route per domain
    index.ts
  schemas/
  services/
  stores/
  util/
  utilities/
  validations/
  views/
```

## Konvensi

Setiap jenis input (textbox, dropdown, date picker, upload file) berada di file komponennya
sendiri di bawah `src/components/`. Halaman dan form induk hanya menyusun komponen tersebut,
tidak menuliskan elemen `input`, `select`, atau `textarea` secara langsung.

Setiap komponen input membawa aturan validasinya sendiri melalui prop (`required`,
`additionalRules`) yang dirakit menjadi skema yup, lalu didaftarkan ke vee-validate melalui
`useField`. Karena itu `useForm` di level halaman tidak memakai `validationSchema` — kedua
pendekatan tersebut tidak dapat digabung, dan skema di level form akan menonaktifkan aturan
per komponen.

Nilai form disimpan dalam satu ref bertipe class model (contoh `WarrantyRegistrationFormModel`)
di level halaman, lalu diteruskan ke komponen anak lewat `v-model`.

Untuk transformasi antar model, gunakan fungsi mapper eksplisit di folder `mappers/`.

## Environment

Tersedia tiga berkas environment: `.env.development`, `.env.sit`, dan `.env.production`.
Variabel yang dipakai frontend harus diawali `VITE_`.