# ESLint Setup — bit-purnajual

## Apa itu ESLint?

ESLint adalah *static code analysis tool* yang memeriksa source code **sebelum dijalankan** (compile time).
Tidak menjalankan kode — hanya membaca dan menganalisis teks.

Tujuan utama:
- Mendeteksi bug potensial lebih awal
- Memaksa standar penulisan kode yang konsisten di seluruh tim
- Mencegah penggunaan pattern berbahaya (`any`, `var`, `v-html`, dll.)

---

## Cara Menjalankan

### Cek seluruh project

```bash
npm run lint
```

### Auto-fix yang bisa diperbaiki otomatis

```bash
npm run lint:fix
```

### Cek file atau folder tertentu saja

```bash
# Satu file
npx eslint src/views/DashboardView.vue

# Satu folder
npx eslint src/views/

# Dengan auto-fix
npx eslint src/views/DashboardView.vue --fix
```

> `lint:fix` dan `--fix` hanya bisa memperbaiki rule style otomatis seperti `attributes-order`.
> Rule seperti `no-explicit-any` dan `no-unused-vars` **harus diperbaiki manual**.

---

## Menyimpan Output ke File

Gunakan flag `-o` / `--output-file` untuk menulis hasil lint ke sebuah file, biasanya dipasangkan dengan `-f` untuk memilih format.

```bash
# Format human-readable (default stylish)
npx eslint <files> -f stylish -o eslint-report.txt

# Format machine-readable (paling cocok jika report akan diproses ulang, mis. dikirim ke PR)
npx eslint <files> -f json -o eslint-report.json

# Format built-in lain: compact, unix, junit, html
npx eslint <files> -f junit -o eslint-report.xml
```

---

## Format Output Error

```
/src/views/DashboardView.vue
  12:18  error    Unexpected any. Specify a different type           @typescript-eslint/no-explicit-any
  15:7   error    'unusedVar' is assigned a value but never used     @typescript-eslint/no-unused-vars
  20:1   error    Unexpected var, use let or const instead           no-var
  25:3   warning  Unexpected empty function                          @typescript-eslint/no-empty-function

✖ 4 problems (3 errors, 1 warning)
```

Format tiap baris:
```
baris:kolom  level  pesan  nama-rule
```

- **error** → wajib diperbaiki, akan menghentikan pipeline CI
- **warning** → sebaiknya diperbaiki, tidak menghentikan pipeline

---

## Penjelasan `eslint.config.ts`

File konfigurasi ESLint menggunakan format **Flat Config** (cara terbaru ESLint v9+).
Flat Config adalah array of config objects — urutan penting, config di bawah bisa override config di atas.

```ts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
```

| Import | Paket | Fungsi |
|---|---|---|
| `js` | `@eslint/js` | Rule bawaan JavaScript (no-undef, no-unused-vars JS, dll.) |
| `globals` | `globals` | Kumpulan nama global variable per environment (browser, node, es2022) |
| `tseslint` | `typescript-eslint` | Rule dan parser khusus TypeScript |
| `pluginVue` | `eslint-plugin-vue` | Rule khusus Vue SFC (`.vue` files) |
| `defineConfig` | `eslint/config` | Helper untuk type-safe config, tidak mengubah behavior |

---

### Block 1 — Ignores

```ts
{
  ignores: [
    "**/node_modules/**",  // dependency pihak ketiga
    "**/dist/**",          // hasil build production
    "**/build/**",         // hasil build alternatif
    "**/.git/**",          // internal git
    "**/coverage/**",      // hasil test coverage (jika ada)
    "**/.vscode/**",       // setting editor lokal
    "**/*.min.js",         // file JS yang sudah di-minify
    "**/*.config.ts",      // semua file konfigurasi .ts (vite, eslint, dll.)
    "**/*.config.js"       // semua file konfigurasi .js (postcss, dll.)
  ]
}
```

File/folder di sini **tidak diproses sama sekali** oleh ESLint.
Pattern `**` berarti berlaku di semua subdirektori.

---

### Block 2 — Global Language Settings

```ts
{
  files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
  languageOptions: {
    globals: {
      ...globals.browser,  // window, document, fetch, localStorage, dll.
      ...globals.node,     // process, __dirname, __filename, Buffer, dll.
      ...globals.es2022    // structuredClone, Array.at(), Object.hasOwn(), dll.
    },
    ecmaVersion: 2022,   // syntax modern: optional chaining, nullish coalescing
    sourceType: "module" // boleh pakai import/export
  }
}
```

Tanpa `globals.browser`, ESLint akan anggap `window` atau `document` sebagai variabel tidak terdefinisi.

---

### Block 3 — Rule Sets Bawaan

```ts
js.configs.recommended,           // rule JS standar
...tseslint.configs.recommended,   // rule TypeScript standar
...pluginVue.configs["flat/recommended"],  // rule Vue standar
```

Ketiga config ini di-spread langsung — artinya semua rule rekomendasi dari masing-masing plugin aktif.

`pluginVue.configs["flat/recommended"]` lebih ketat dari `flat/essential`:
- `essential` → hanya rule yang mencegah error
- `recommended` → essential + rule style dan best practice

---

### Block 4 — Parser TypeScript untuk Vue

```ts
{
  files: ["**/*.vue"],
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser,  // parse <script lang="ts"> di dalam .vue
      ecmaVersion: 2022,
      sourceType: "module"
    }
  }
}
```

Tanpa ini, ESLint tidak bisa membaca TypeScript di dalam `<script setup lang="ts">`.
Berlaku khusus untuk file `.vue` saja.

---

### Block 5 — Custom Rules untuk JS/TS

```ts
{
  files: ["**/*.{js,ts}"],
  rules: { ... }
}
```

Berlaku hanya untuk `.js` dan `.ts`. File `.vue` punya block rule sendiri di bawah.

---

### Block 6 — Custom Rules untuk Vue

```ts
{
  files: ["**/*.vue"],
  rules: { ... }
}
```

Berlaku khusus untuk file `.vue`.

---

## Semua Rule Aktif — Lengkap dengan Contoh

### `eqeqeq` — error

Wajib pakai `===` dan `!==`. Mencegah bug akibat type coercion JavaScript.

**Config:** `["error", "always", { null: "ignore" }]`
— `always` berarti berlaku di semua kondisi, kecuali perbandingan ke `null` (karena `== null` sering dipakai untuk cek `null | undefined` sekaligus).

```ts
// ❌ Error
if (count == 0) { }
if (name != '') { }
if (status == false) { }

// ✅ Fix
if (count === 0) { }
if (name !== '') { }
if (status === false) { }

// ✅ Pengecualian — null boleh pakai == karena config null:"ignore"
// Ini menangkap null DAN undefined sekaligus
if (value == null) { }   // ok: menangkap value === null || value === undefined
if (value != null) { }   // ok
```

---

### `no-var` — error

Dilarang deklarasi variabel dengan `var`. Harus pakai `const` atau `let`.

`var` punya masalah: scope-nya function-level bukan block-level, dan ter-hoist ke atas fungsi sehingga bisa diakses sebelum deklarasi.

```ts
// ❌ Error
var userName = 'John'
var count = 0
for (var i = 0; i < 10; i++) { }

// ✅ Fix — const untuk nilai yang tidak berubah
const userName = 'John'

// ✅ Fix — let untuk nilai yang perlu reassign
let count = 0
for (let i = 0; i < 10; i++) { }
```

---

### `no-console` — warn (dev) / error (production)

**Config:** `process.env.NODE_ENV === "production" ? "error" : "warn"`

Di development hanya warning, di production build menjadi error.
`console.log` yang tertinggal di production bisa bocorkan informasi sensitif.

```ts
// ❌ Error di production / Warning di development
console.log('user data:', userData)
console.error('something failed')

// ✅ Fix — hapus setelah selesai debugging
// (jika perlu logging permanent, gunakan service logger khusus)
```

---

### `no-debugger` — warn (dev) / error (production)

Sama seperti `no-console`, `debugger` statement tidak boleh masuk ke production.

```ts
// ❌ Error di production
function calculateTotal() {
  debugger  // ← tertinggal dari sesi debugging
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Fix — hapus statement debugger
function calculateTotal() {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

---

### `@typescript-eslint/no-explicit-any` — error

Dilarang menggunakan tipe `any`. `any` mematikan seluruh type checking TypeScript untuk variabel tersebut.

```ts
// ❌ Error
function processData(data: any) { }
const result: any = fetchResponse
let payload: any = {}

// ✅ Fix — gunakan tipe spesifik
interface ApiResponse {
  code: number
  message: string
  result: UserModel
}
function processData(data: ApiResponse) { }

// ✅ Fix — gunakan unknown jika tipe benar-benar tidak diketahui
// unknown lebih aman dari any karena harus di-narrow dulu sebelum dipakai
function processData(data: unknown) {
  if (typeof data === 'string') {
    console.log(data.toUpperCase())  // TypeScript tahu ini string
  }
}

// ✅ Fix — gunakan generic jika tipe bervariasi tapi diketahui saat call
function processData<T>(data: T): T {
  return data
}
```

---

### `@typescript-eslint/no-unused-vars` — error

Variabel, parameter, atau import yang dideklarasi tapi tidak pernah digunakan.

**Config:**
```ts
["error", {
  argsIgnorePattern: "^_",       // parameter dengan prefix _ diabaikan
  varsIgnorePattern: "^_",       // variabel dengan prefix _ diabaikan
  caughtErrorsIgnorePattern: "^_" // error di catch dengan prefix _ diabaikan
}]
```

```ts
// ❌ Error — import tidak dipakai
import { ref, computed, watch } from 'vue'  // watch tidak dipakai

// ❌ Error — variabel tidak dipakai
const unusedVar = 'hello'
const { name, age, address } = user  // address tidak dipakai

// ❌ Error — parameter tidak dipakai
function onClick(event: MouseEvent, index: number) {
  console.log(index)  // event tidak dipakai
}

// ✅ Fix — hapus import yang tidak dipakai
import { ref, computed } from 'vue'

// ✅ Fix — prefix _ untuk yang sengaja tidak dipakai
function onClick(_event: MouseEvent, index: number) {
  console.log(index)  // _event sengaja diabaikan, tidak error
}

// ✅ Fix — prefix _ di destructuring
const { name, age, _address } = user

// ✅ Fix — prefix _ di catch
try {
  await fetchData()
} catch (_error) {
  showNotification('Gagal memuat data')
}
```

---

### `@typescript-eslint/no-empty-function` — warn

Fungsi kosong tanpa isi biasanya pertanda implementasi yang belum selesai atau lupa dihapus.

```ts
// ⚠️ Warning
function onSuccess() { }
const handleClick = () => { }

// ✅ Fix — isi dengan implementasi
function onSuccess() {
  showToast('Berhasil disimpan')
}

// ✅ Fix — jika memang sengaja kosong, tambahkan komentar
const noop = () => { /* intentional no-op */ }
```

---

### `@typescript-eslint/no-inferrable-types` — warn

Jangan tulis anotasi tipe yang sudah bisa di-infer TypeScript secara otomatis dari nilai literal.
Membuat kode lebih bersih dan tidak redundant.

```ts
// ⚠️ Warning — TypeScript sudah tahu tipenya dari nilai
const name: string = 'John'
const count: number = 0
const isActive: boolean = true
const ratio: number = 3.14

// ✅ Fix — biarkan TypeScript infer
const name = 'John'       // TypeScript tahu: string
const count = 0           // TypeScript tahu: number
const isActive = true     // TypeScript tahu: boolean
const ratio = 3.14        // TypeScript tahu: number

// ✅ Tipe eksplisit masih perlu jika tidak ada nilai awal
let name: string
let items: UserModel[]
```

---

### `no-restricted-syntax` (Object.assign) — error

Dilarang menggunakan `Object.assign()`.
`Object.assign()` memodifikasi object pertama secara langsung (mutasi) dan menyembunyikan mapping yang terjadi, membuat kode sulit dilacak saat ada perubahan model.

Project ini menggunakan **mapper design pattern** — transformasi antar model dilakukan lewat fungsi mapper eksplisit di folder `mappers/`.

```ts
// ❌ Error — menyembunyikan mapping, mutasi object langsung
const formData = new UserFormModel()
Object.assign(formData, apiResponse)

// ✅ Fix — gunakan mapper function (eksplisit, mudah dilacak, testable)
// src/modules/user/user/mappers/user.mapper.ts
export function mapToUserForm(data: UserResponse): UserFormModel {
  const form = new UserFormModel()
  form.id = data.id
  form.name = data.name
  form.email = data.email
  form.active = data.active
  return form
}

// src/modules/user/user/views/User.vue
import { mapToUserForm } from '../mappers/user.mapper'

const formData = mapToUserForm(apiResponse)
```

Mapper function menjadi **single source of truth** untuk transformasi model — perubahan struktur API cukup diperbaiki di satu tempat.

---

### `vue/require-prop-types` — off

Dimatikan karena TypeScript di `<script setup lang="ts">` sudah menangani typing props melalui generics.

```vue
<!-- ✅ Cukup pakai TypeScript generic, tidak perlu type di defineProps -->
<script setup lang="ts">
const props = defineProps<{
  title: string
  count: number
  isActive?: boolean
}>()
</script>
```

---

### `vue/require-default-prop` — warn

Props yang optional (tidak wajib) harus punya nilai default.

```vue
<!-- ⚠️ Warning — isActive optional tapi tidak ada default -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  isActive?: boolean   // tidak ada default
}>(), {})

<!-- ✅ Fix — definisikan default untuk semua optional prop -->
const props = withDefaults(defineProps<{
  title: string
  isActive?: boolean
}>(), {
  isActive: false
})
</script>
```

---

### `vue/multi-word-component-names` — warn

Nama komponen harus terdiri dari minimal 2 kata. Mencegah konflik dengan elemen HTML native.
Elemen HTML seperti `<input>`, `<button>`, `<header>` adalah satu kata — komponen custom harus dibedakan.

```
❌ Warning: Button.vue, Input.vue, Modal.vue, Table.vue
✅ Fix:     BaseButton.vue, AppInput.vue, ConfirmModal.vue, DataTable.vue
            UserCard.vue, FormRow.vue, LoadingSpinner.vue
```

---

### `vue/require-v-for-key` — error

Setiap elemen dengan `v-for` wajib punya `:key`. Dipakai Vue untuk melacak perubahan DOM secara efisien (virtual DOM diffing).

```vue
<!-- ❌ Error — tidak ada :key -->
<div v-for="item in items">{{ item.name }}</div>

<!-- ✅ Fix — key unik, idealnya id dari data -->
<div v-for="item in items" :key="item.id">{{ item.name }}</div>

<!-- ✅ Fix — gunakan index hanya jika tidak ada id unik -->
<div v-for="(item, index) in items" :key="index">{{ item.name }}</div>
```

---

### `vue/no-mutating-props` — error

Dilarang mengubah nilai props langsung di dalam komponen. Props harus diperlakukan sebagai read-only.
Mutasi props langsung membuat data flow menjadi tidak terprediksi (one-way data flow dilanggar).

```vue
<!-- ❌ Error -->
<script setup lang="ts">
const props = defineProps<{ items: string[], count: number }>()

props.items.push('new item')  // mutasi array prop
props.count = props.count + 1  // reassign prop
</script>

<!-- ✅ Fix — emit event ke parent untuk update -->
<script setup lang="ts">
const props = defineProps<{ items: string[], count: number }>()
const emit = defineEmits<{
  'update:items': [string[]]
  'update:count': [number]
}>()

const addItem = (newItem: string) => {
  emit('update:items', [...props.items, newItem])
}
const increment = () => {
  emit('update:count', props.count + 1)
}
</script>
```

---

### `vue/no-v-html` — error

Dilarang menggunakan `v-html`. Konten yang di-render melalui `v-html` tidak di-escape oleh Vue,
sehingga rentan terhadap serangan **XSS (Cross-Site Scripting)** jika konten berasal dari input user atau API eksternal.

```vue
<!-- ❌ Error — berbahaya jika content dari user input -->
<div v-html="userContent"></div>
<span v-html="apiDescription"></span>

<!-- ✅ Fix — render sebagai teks biasa (otomatis di-escape Vue) -->
<div>{{ userContent }}</div>
```
---

### `vue/attributes-order` — warn

Urutan atribut di template harus konsisten sesuai konvensi Vue.

Urutan yang benar (dari atas ke bawah):
1. `v-is` / `is`
2. `v-for`
3. `v-if` / `v-else-if` / `v-else` / `v-show` / `v-cloak`
4. `v-pre` / `v-once`
5. `id`
6. `key`
7. `ref` / `v-model`
8. Props / atribut lainnya
9. Event handler (`@click`, `@input`, dll.)
10. `v-html` / `v-text`

```vue
<!-- ⚠️ Warning — urutan tidak konsisten -->
<input @change="onChange" v-model="value" :disabled="isDisabled" name="email" />

<!-- ✅ Fix — setelah npm run lint:fix otomatis diurutkan -->
<input name="email" v-model="value" :disabled="isDisabled" @change="onChange" />
```

---

## Cara Disable Rule (Hanya untuk debugging, tidak boleh di commit)

### Disable satu baris

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData: any = JSON.parse(rawJson)
```

### Disable satu baris di Vue template

```vue
<!-- eslint-disable-next-line vue/no-v-html -->
<div v-html="sanitizedContent"></div>
```

### Disable satu block

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
const a: any = foo()
const b: any = bar()
/* eslint-enable @typescript-eslint/no-explicit-any */
```

> **Cara ini tidak boleh digunakan apalagi di commit**. Gunakan hanya ketika debugging.

---

## Referensi

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [typescript-eslint Rules](https://typescript-eslint.io/rules/)
- [eslint-plugin-vue Rules](https://eslint.vuejs.org/rules/)
- Sample kode: `src/views/DashboardView.vue`
