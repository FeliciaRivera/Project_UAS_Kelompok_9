/*
  Data pendukung Panel Admin (simulasi tanpa backend).
*/

// Akun admin. Password tidak disimpan sebagai teks biasa, melainkan
// sebagai hash SHA-256 (lihat utils/hash.js). Pada aplikasi produksi,
// pemeriksaan login seharusnya dilakukan di server.
export const AKUN_ADMIN = {
  username: "adminkel9",
  passwordHash: "1c3f8f6f51588b4cd489b41083665121803f30bb83643c7e4f4174e1a39c0d8e",
};

// Menu tab di dashboard admin
export const TAB_ADMIN = [
  { id: "rekap", label: "Rekap Pesanan" },
  { id: "menu", label: "Menu & Foto" },
  { id: "kategori", label: "Kategori Menu" },
  { id: "urutan", label: "Urutan Menu" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Cerita Kami" },
];

export const STATUS_PESANAN = {
  Baru: "primary",
  Diproses: "warning",
  Selesai: "success",
  Dibatalkan: "secondary",
};

// Contoh pesanan masuk (simulasi). Pesanan dari halaman Keranjang
// ikut ditambahkan di atas daftar ini dengan status "Baru".
export const REKAP_PESANAN_DUMMY = [
  { kode: "WPS-104512", tanggal: "07/11/2026 12.15", pelanggan: "Andi Pratama", menu: "Nasi Goreng Komplit ×2, Nutrisari ×2", total: 62000, status: "Selesai" },
  { kode: "WPS-109833", tanggal: "07/11/2026 12.40", pelanggan: "Siti Rahmawati", menu: "Nasi Katsu Geprek ×1, Good Day ×1", total: 32000, status: "Selesai" },
  { kode: "WPS-112047", tanggal: "07/11/2026 13.05", pelanggan: "Budi Santoso", menu: "Mie Goreng Tek Tek Komplit Special ×1", total: 29000, status: "Dibatalkan" },
  { kode: "WPS-120590", tanggal: "08/11/2026 09.20", pelanggan: "Dewi Lestari", menu: "Roti Bakar Mix Keju ×2, Aneka Kopi Panas ×2", total: 42000, status: "Diproses" },
  { kode: "WPS-121376", tanggal: "08/11/2026 10.02", pelanggan: "Rizky Hidayat", menu: "Katsu Mix Indomie Double + Telor ×1, Ovaltine ×1", total: 42000, status: "Diproses" },
  { kode: "WPS-122918", tanggal: "08/11/2026 10.45", pelanggan: "Nadia Putri", menu: "Kwetiau Goreng Komplit ×3", total: 72000, status: "Baru" },
];
