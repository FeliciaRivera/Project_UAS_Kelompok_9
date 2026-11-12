/*
  Data opsi urutan menu.

  Opsi ini tampil pada dropdown "Urutkan" di halaman Menu dan dapat
  ditambah, diubah, atau dihapus oleh admin melalui tab "Urutan Menu".
  Perubahan disimpan ke localStorage.

  Setiap opsi terdiri dari:
  - field : kolom data yang dijadikan acuan pengurutan
  - arah  : "naik" (kecil ke besar, A ke Z) atau "turun" (sebaliknya)
  - bawaan: true untuk opsi "Default" yang tidak dapat dihapus
*/

export const FIELD_URUTAN = [
  { id: "id", label: "Waktu ditambahkan", naik: "Terlama", turun: "Terbaru" },
  { id: "harga", label: "Harga", naik: "Termurah", turun: "Termahal" },
  { id: "nama", label: "Nama menu", naik: "A ke Z", turun: "Z ke A" },
  { id: "kelompok", label: "Kelompok menu", naik: "A ke Z", turun: "Z ke A" },
  { id: "kategori", label: "Kategori", naik: "A ke Z", turun: "Z ke A" },
];

export const URUTAN_AWAL = [
  { id: "default", label: "Default", field: "id", arah: "naik", bawaan: true },
  { id: "termurah", label: "Harga termurah", field: "harga", arah: "naik" },
  { id: "termahal", label: "Harga termahal", field: "harga", arah: "turun" },
  { id: "nama", label: "Nama A–Z", field: "nama", arah: "naik" },
];
