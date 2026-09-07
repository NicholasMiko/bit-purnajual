### Installation
command install (vitest v3):
`npm install -D vitest@^3 @vue/test-utils jsdom`

command approve:
`npm approve-scripts @tailwindcss/oxide`
`npm approve-scripts esbuild`
`npm approve-scripts msw`
`npm approve-scripts vue-demi`
`npm approve-scripts --allow-scripts-pending`

command install (vitest coverage v8):
`npm install -D @vitest/coverage-v8@^3`

run 
`npm run test:unit`
`npx vitest run`

### warrantyRegistration.mapper.spec.ts
`src\modules\repair\warranty-registration\mappers\__tests__\warrantyRegistration.mapper.spec.ts`

FASE 1: MAPPING DARI BACKEND KE FRONTEND

- Sumber data adalah response JSON dari API backend (hasil dari GET).
    
- Test ini memastikan data mentah tersebut berhasil diubah menjadi state form di UI frontend secara akurat, tanpa ada field yang hilang atau salah posisi.
    

FASE 2: FILTERING DATA INTERNAL SERVER

- Bertujuan menyaring atribut yang di-generate otomatis oleh sistem.
    
- Test memvalidasi bahwa field seperti ID, nomor registrasi, dan status diabaikan, karena form UI tidak membutuhkan data tersebut dan user tidak memiliki hak untuk mengeditnya.
    

FASE 3: PEMBENTUKAN PAYLOAD UNTUK API

- Merupakan alur sebaliknya: mengonversi data dari form UI menjadi payload JSON yang siap disubmit (POST) ke backend.
	
- Test memverifikasi keutuhan data dan memastikan jumlah parameter eksak 14 field. Hal ini menjamin payload sudah sesuai kontrak API dan mencegah error akibat kelebihan atau kekurangan pengiriman data.

### nomorSerial.validation.spec.ts 
`src\modules\repair\warranty-registration\validations\__tests__\nomorSerial.validation.spec.ts`

FASE 1: JALUR NORMAL SERIAL TERSEDIA

- Menguji kondisi ideal ketika nomor serial terdaftar di database produk dan belum pernah dipakai registrasi lain.
	
- Fungsi harus mengembalikan `true` sehingga field dianggap valid dan ikon centang dapat ditampilkan.
	
- Sekaligus memverifikasi bahwa service benar-benar dipanggil dengan nomor serial yang tepat, bukan nilai lain.

FASE 2: PENERUSAN PESAN ERROR DARI BACKEND

- Menguji dua kondisi gagal yang dibedakan backend: serial sudah dipakai (HTTP 409) dan serial tidak ditemukan (HTTP 404).
	
- Memastikan pesan dari `responseDetail` server diteruskan apa adanya ke pesan error field, tanpa diubah atau digantikan pesan generik.
	
- Ini menjaga agar user menerima keterangan yang tepat sesuai masalahnya, bukan sekadar "terjadi kesalahan".

FASE 3: PENANGANAN ERROR TIDAK TERDUGA

- Menguji kondisi ketika yang dilempar bukan objek `Error`, misalnya gangguan jaringan atau kegagalan parsing.
	
- Memastikan tersedia pesan cadangan yang layak dibaca user, sehingga tidak pernah muncul `undefined` atau `[object Object]` di layar.

**FASE 4: NORMALISASI INPUT**

- Memastikan nilai dari user dibersihkan sebelum dikirim ke backend: spasi dipangkas dan huruf diseragamkan menjadi kapital.
	
- Menjamin `avl100002` dan `AVL100002` diperlakukan sebagai serial yang sama, mencegah pengecekan meleset hanya karena beda format ketik.

**FASE 5: EFISIENSI PEMANGGILAN API**

- Menguji mekanisme cache yang mencegah backend dibanjiri permintaan berulang untuk serial yang sama.
	
- Memverifikasi service hanya dipanggil satu kali meskipun validasi dijalankan berkali-kali, misalnya ketika user berpindah fokus bolak-balik tanpa mengubah isian.
	
- Test terakhir sengaja mendokumentasikan batasannya: hasil cache tetap dipakai walau backend berubah jawaban. Bila kelak cache perlu diberi masa berlaku, test inilah yang pertama gagal sebagai penanda.

### **generalRule.validation.spec.ts**  
`src\validations\__tests__\generalRule.validation.spec.ts`

FASE 1: PENEGAKAN FIELD WAJIB ISI

- Menguji perilaku `required` yang dipakai hampir seluruh field teks di aplikasi.
	
- Memastikan nilai kosong ditolak, dan yang lebih penting, nilai berisi spasi saja juga ditolak — user tidak bisa melewati validasi hanya dengan menekan spasi.
	
- Sebaliknya, field opsional harus tetap lolos saat dikosongkan, agar catatan tambahan tidak menghalangi submit.

FASE 2: KEBENARAN LABEL PADA PESAN ERROR

- Memastikan pesan error menyebut nama field yang dimengerti user, bukan nama variabel atau placeholder sistem.
- Test secara eksplisit menolak kemunculan kata `this` — pernah terjadi pesan "this wajib diisi" ketika `.label()` belum dipasang pada schema. Test ini mencegah regresi tersebut.

FASE 3: PEMBATASAN KARAKTER

- Memvalidasi dua aturan opsional: larangan spasi dan larangan garis miring.
	
- Keduanya harus aktif hanya saat diminta, dan tidak boleh mengganggu field lain. Contohnya nama toko wajib boleh berspasi, sementara kode produk tidak.

FASE 4: NORMALISASI NILAI

- Memastikan `.trim()` benar-benar diterapkan, sehingga spasi di awal dan akhir input tidak ikut tersimpan ke database.
	
- Menjaga konsistensi data antara yang diketik user dan yang dikirim ke backend.


### Percobaan 1 — tukar field di mapper

Buka `src/modules/repair/warranty-registration/mappers/warrantyRegistration.mapper.ts`, ubah satu baris:

ts

```ts
form.merk = response.tipeProduk
```

(dari `response.merk`)

Jalankan `npm run test:unit`. Test **"memetakan response ke form model"** harus gagal, dengan pesan kira-kira `expected 'PB-288BIT' to be 'SHIMIZU'`.

TypeScript diam saja, karena dua-duanya `string`.

### Percobaan 2 — hapus satu field dari payload

Di file yang sama, hapus satu baris dari `mapToWarrantyRegistrationCreatePayload`, misalnya `kota: form.kota,`.

Test **"memetakan form model ke payload create"** harus gagal: `expected 13 to be 14`.

Ini yang menjaga kalau ada field baru ditambahkan tapi lupa dipetakan.

### Percobaan 3 — ubah pesan error serial

Buka `src/modules/repair/warranty-registration/validations/nomorSerial.validation.ts`, ubah pesan cadangannya:

ts

```ts
'Gagal cek serial.'
```

(dari `'Gagal memeriksa nomor serial.'`)

Test **"mengembalikan pesan umum saat error tanpa keterangan"** harus gagal.

### Percobaan 4 — yang TIDAK tertangkap

Buka `src/endPoint.ts`, ubah:

ts

```ts
list: '/repair/warrantyregistration/v1/get-lists',
```

Jalankan test lagi — **semua tetap lolos**. Padahal aplikasi sudah rusak.

Itu lubang yang aku sebut tadi.