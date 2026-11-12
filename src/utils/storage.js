/*
  Modul penyimpanan data aplikasi (pengganti backend/database).

  Seluruh data disimpan di localStorage sehingga tetap tersedia
  setelah halaman dimuat ulang atau browser ditutup:
  menu, galeri, teks Cerita Kami, kategori menu, opsi urutan menu, rekap pesanan,
  isi keranjang, struk terakhir, dan status login admin.

  Setiap key diberi awalan "wps_" (Warung Pojok Sofy) agar tidak
  bertabrakan dengan data situs lain di alamat yang sama.
*/

const AWALAN = "wps_";

// Daftar key yang dipakai aplikasi, dipusatkan agar konsisten
export const KEY = {
  menu: "menu",
  galeri: "galeri",
  cerita: "cerita",
  urutan: "urutan",
  kategori: "kategori",
  pesanan: "pesanan",
  keranjang: "keranjang",
  struk: "struk",
  admin: "admin_login",
};

// Membaca data; mengembalikan nilai awal jika belum ada atau tidak valid
export function muatData(key, nilaiAwal) {
  try {
    const teks = localStorage.getItem(AWALAN + key);
    return teks ? JSON.parse(teks) : nilaiAwal;
  } catch {
    return nilaiAwal;
  }
}

// Menyimpan data; mengembalikan false jika gagal (misalnya kuota penuh)
export function simpanData(key, nilai) {
  try {
    localStorage.setItem(AWALAN + key, JSON.stringify(nilai));
    return true;
  } catch {
    return false;
  }
}

// Menghapus satu atau beberapa key
export function hapusData(daftarKey) {
  try {
    daftarKey.forEach(function (key) {
      localStorage.removeItem(AWALAN + key);
    });
  } catch {
    // localStorage tidak tersedia; tidak ada yang perlu dihapus
  }
}
