/*
  Kumpulan fungsi bantu untuk memproses data, dipisahkan dari JSX:
  format harga, alamat gambar, filter dan urutan menu, perhitungan
  keranjang, validasi form, serta pembacaan file gambar.
*/
import { sha256 } from "./hash.js";

// 20000 → "Rp 20.000"
export function formatRupiah(angka) {
  return "Rp " + Number(angka || 0).toLocaleString("id-ID");
}

// true jika "file" berupa link (https://...) atau hasil upload (data:...)
export function isLinkGambar(file) {
  return /^(https?:|data:|blob:)/i.test(file || "");
}

// Path foto menu di folder public/image (atau link langsung)
export function gambarUrl(file) {
  if (isLinkGambar(file)) return file;
  return `${import.meta.env.BASE_URL}image/${file}`;
}

// Path foto galeri di folder public/image/galeri (atau link langsung)
export function fotoGaleriUrl(file) {
  if (isLinkGambar(file)) return file;
  return `${import.meta.env.BASE_URL}image/galeri/${file}`;
}

// Teks singkat untuk menampilkan sumber foto di tabel admin
export function labelSumberFoto(file) {
  if ((file || "").startsWith("data:")) return "File upload";
  return file;
}

// id baru = id terbesar + 1
export function buatIdBaru(daftar) {
  return daftar.length ? Math.max(...daftar.map((x) => x.id)) + 1 : 1;
}

// Baca file gambar dari <input type="file">, perkecil maks. 900px,
// lalu ubah ke teks base64 (data URL) agar bisa disimpan di localStorage.
export function bacaFileGambar(file, ukuranMaks = 900) {
  return new Promise(function (resolve, reject) {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("File harus berupa gambar (JPG/PNG)."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = function () {
      reject(new Error("Gagal membaca file."));
    };
    reader.onload = function () {
      const img = new Image();
      img.onerror = function () {
        reject(new Error("Format gambar tidak didukung."));
      };
      img.onload = function () {
        const skala = Math.min(1, ukuranMaks / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * skala);
        canvas.height = Math.round(img.height * skala);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Cek status buka: Senin–Jumat, 07.00–17.00
export function cekStatusBuka(tanggal = new Date()) {
  const hari = tanggal.getDay(); // 0 = Minggu, 6 = Sabtu
  const jam = tanggal.getHours();
  const hariKerja = hari >= 1 && hari <= 5;
  return hariKerja && jam >= 7 && jam < 17;
}

// Filter + urutkan daftar menu sesuai pilihan pengguna
export function prosesDaftarMenu(menuItems, filter, daftarUrutan, daftarKategori = []) {
  const keyword = filter.keyword.trim().toLowerCase();

  const hasil = menuItems.filter(function (item) {
    const cocokKategori = filter.kategori === "semua" || item.kategori === filter.kategori;
    const cocokKeyword =
      keyword === "" ||
      item.nama.toLowerCase().includes(keyword) ||
      item.kelompok.toLowerCase().includes(keyword);
    return cocokKategori && cocokKeyword;
  });

  const aturan = daftarUrutan.find((u) => u.id === filter.urutan);
  return aturan ? urutkanMenu(hasil, aturan, daftarKategori) : hasil;
}

// Mengurutkan daftar menu berdasarkan satu aturan { field, arah }.
// Untuk field "kategori", urutan mengikuti nama kategori yang dibuat admin.
export function urutkanMenu(items, aturan, daftarKategori = []) {
  const pengali = aturan.arah === "turun" ? -1 : 1;
  function ambilNilai(item) {
    if (aturan.field !== "kategori") return item[aturan.field];
    const kategori = daftarKategori.find((k) => k.id === item.kategori);
    return kategori ? kategori.label : item.kategori;
  }
  return [...items].sort(function (a, b) {
    const nilaiA = ambilNilai(a);
    const nilaiB = ambilNilai(b);
    if (typeof nilaiA === "number" && typeof nilaiB === "number") {
      return (nilaiA - nilaiB) * pengali;
    }
    return String(nilaiA).localeCompare(String(nilaiB), "id") * pengali;
  });
}

// Validasi form opsi urutan (admin)
export function validasiUrutan(data, daftarUrutan, editingId) {
  const errors = {};
  const label = data.label.trim();
  if (label.length < 3) errors.label = "Nama opsi minimal 3 karakter.";
  const duplikat = daftarUrutan.some((u) => u.label.toLowerCase() === label.toLowerCase() && u.id !== editingId);
  if (duplikat) errors.label = "Nama opsi sudah dipakai.";
  return errors;
}

// Validasi form kategori menu: nama wajib diisi dan tidak boleh sama
export function validasiKategori(data, daftarKategori, editingId) {
  const errors = {};
  const label = data.label.trim();
  if (label.length < 3) errors.label = "Nama kategori minimal 3 karakter.";
  else if (label.length > 30) errors.label = "Nama kategori maksimal 30 karakter.";
  const duplikat = daftarKategori.some((k) => k.label.toLowerCase() === label.toLowerCase() && k.id !== editingId);
  if (duplikat) errors.label = "Nama kategori sudah ada.";
  return errors;
}

// Gabungkan isi keranjang [{id, qty}] dengan data menu → detail lengkap
export function detailKeranjang(cart, menuItems) {
  return cart
    .map(function (baris) {
      const menu = menuItems.find((m) => m.id === baris.id);
      if (!menu) return null;
      return { ...menu, qty: baris.qty, subtotal: menu.harga * baris.qty };
    })
    .filter(Boolean);
}

// Hitung ringkasan keranjang
export function hitungTotal(items) {
  return items.reduce(
    function (acc, item) {
      return { totalItem: acc.totalItem + item.qty, totalHarga: acc.totalHarga + item.subtotal };
    },
    { totalItem: 0, totalHarga: 0 }
  );
}

// Kelompokkan menu per "kelompok" untuk tabel dengan rowspan
export function kelompokkanMenu(items) {
  const grup = [];
  items.forEach(function (item) {
    let g = grup.find((x) => x.kelompok === item.kelompok);
    if (!g) {
      g = { kelompok: item.kelompok, items: [] };
      grup.push(g);
    }
    g.items.push(item);
  });
  return grup;
}

// Validasi form checkout → objek error (kosong = valid)
export function validasiCheckout(data) {
  const errors = {};
  if (data.nama.trim().length < 3) errors.nama = "Nama minimal 3 karakter.";
  if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Format email tidak valid.";
  if (!/^[0-9]{10,13}$/.test(data.telepon)) errors.telepon = "No. telepon 10–13 digit angka.";
  return errors;
}

// Validasi form menu (admin)
export function validasiMenu(data) {
  const errors = {};
  if (data.nama.trim().length < 3) errors.nama = "Nama menu minimal 3 karakter.";
  if (data.kelompok.trim() === "") errors.kelompok = "Kelompok menu wajib diisi.";
  if (data.kategori === "") errors.kategori = "Kategori wajib dipilih.";
  if (!data.harga || Number(data.harga) < 1000) errors.harga = "Harga minimal Rp 1.000.";
  if (data.gambar.trim() === "") errors.gambar = "Isi nama file, link, atau upload foto.";
  return errors;
}

// Validasi form foto galeri (admin)
export function validasiFoto(data) {
  const errors = {};
  if (data.file.trim() === "") errors.file = "Isi nama file, link, atau upload foto.";
  if (data.keterangan.trim().length < 3) errors.keterangan = "Keterangan minimal 3 karakter.";
  return errors;
}

// Cek login admin dengan akun statis
export function cekLoginAdmin(data, akun) {
  return data.username.trim() === akun.username && sha256(data.password) === akun.passwordHash;
}

// Ringkas isi keranjang jadi satu baris untuk rekap admin
export function ringkasPesanan(items) {
  return items.map((i) => `${i.nama} ×${i.qty}`).join(", ");
}

// Pecah teks cerita menjadi paragraf (dipisah baris kosong)
export function pecahParagraf(teks) {
  return (teks || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
