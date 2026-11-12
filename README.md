# Warung Pojok Mba Sofy — React + Bootstrap

Lanjutan proyek kelompok mata kuliah **Pemrograman Antarmuka Pengguna**. Website profil & katalog UMKM yang sebelumnya berupa HTML/CSS statis (`index.html`, `menu.html`, `about.html`) dimigrasikan menjadi **Single Page Application React** dengan **Bootstrap 5**.

- Kelompok: 9 (SI A) · Studi kasus: Opsi A, Profil & Katalog UMKM
- Anggota: Deio Castello Sujati (825250002), Felicia Rivera (825250003), Muhammad Ubait Dhaifullah (825250012)


## Fitur

**Dimigrasikan dari versi HTML**
- Halaman Beranda, Menu, dan Tentang dengan header, navigasi, konten, dan footer yang konsisten
- Layout 2 kolom Bootstrap (`col-lg-8` + `col-lg-4`) yang menjadi 1 kolom di layar kecil
- Navbar responsif + dropdown Menu (dikendalikan state React, tanpa JavaScript Bootstrap)
- Tabel daftar harga dengan `colSpan` & `rowSpan`, sekarang dibangkitkan otomatis dari data
- Galeri produk, video profil, peta Google Maps, kontak, jam operasional

**Fitur baru**
1. **Pencarian & filter menu**: cari nama, filter kategori (Makanan / Roti Bakar / Minuman), urutkan harga/nama, ganti tampilan kartu ↔ tabel.
2. **Keranjang belanja + hitung total**: tambah menu, ubah jumlah (+/−), hapus item, kosongkan keranjang (dengan modal konfirmasi), subtotal per item & total otomatis, badge jumlah item di navbar, bar keranjang melayang.
3. **Checkout**: form data pemesan (controlled form) dengan validasi, lalu struk pesanan berkode dengan pesan **"Pesanan Anda telah diverifikasi"** (tanpa backend, semua berjalan di browser).
4. Notifikasi toast, badge status **Sedang Buka / Tutup** berdasarkan jam saat ini.
5. **Galeri "Pelanggan Menikmati Menu"**: kartu kategori di Galeri Produk (halaman Menu) bisa diklik untuk membuka modal berisi minimal 4 foto pelanggan yang sedang makan menu tersebut.
6. **Panel Admin (simulasi backend)**: login admin, rekap pesanan, kelola menu & foto, kelola galeri, kelola opsi urutan menu, dan ubah teks halaman Cerita Kami.
7. **Penyimpanan localStorage**: menu, kategori, galeri, teks Cerita Kami, opsi urutan, rekap pesanan, isi keranjang, struk terakhir, dan status login tetap tersimpan setelah halaman dimuat ulang.

## Panel Admin

- Buka lewat tautan **Admin** di footer, atau alamat `http://localhost:5173/#admin`.
- Akun admin diberikan terpisah kepada dosen dan anggota kelompok. Di kode, password disimpan dalam bentuk hash SHA-256 (`src/data/adminData.js`), bukan teks biasa.
- Tab yang tersedia:
  - **Rekap Pesanan**: tabel pesanan dummy + pesanan dari halaman Keranjang (status Baru).
  - **Menu & Foto**: tambah, ubah, hapus menu; foto bisa berupa nama file, link, atau upload.
  - **Galeri**: tambah, ubah, hapus foto galeri per kategori.
  - **Kategori Menu**: tambah kategori baru dengan mengetik namanya (misalnya Camilan atau Paket Hemat), ganti nama, dan hapus kategori yang sudah tidak memiliki menu. Kategori langsung muncul di dropdown Menu pada navbar, tombol filter halaman Menu, dan form Menu & Foto.
  - **Urutan Menu**: tambah, ubah, hapus opsi pada dropdown "Urutkan" di halaman Menu (berdasarkan harga, nama, kelompok, kategori, atau waktu ditambahkan), dengan pratinjau 5 menu teratas.
  - **Cerita Kami**: ubah teks halaman Tentang lewat textarea, dengan pratinjau.
- Tombol **Kembalikan data awal** menghapus semua perubahan dari `localStorage`.
- Pelanggan tidak perlu login untuk melihat website.

## Aturan State & Event Handling

Tidak ada fungsi yang ditulis langsung di dalam atribut event JSX (`onClick={() => ...}`).
Pola yang dipakai:

1. **State & handler didefinisikan di komponen induk**, di luar `return`.
2. Handler **dioper ke anak lewat props**.
3. Anak **memanggil handler dari props** saat event terjadi.


## Format Nama File Foto

**Foto galeri** (folder `public/image/galeri/`): `galeri-<kategori>-<nomor>.jpg`, kategori: `nasi-goreng`, `kwetiau-mie`, `nasi-katsu`, `roti-bakar`, `minuman-dingin`, `minuman-hangat`, nomor 1–4. Contoh `galeri-nasi-katsu-1.jpg`. Selama file belum ada, galeri menampilkan kotak berisi nama file yang dibutuhkan.

## Foto Menu

Setiap menu punya nama file foto sendiri di `src/data/menuData.js` (field `gambar`, contoh `nasi-goreng-biasa.jpg`). Taruh file dengan nama persis sama di `public/image/`. Teks `alt` foto memakai nama menu.

Pemrosesan data (filter, sort, total, validasi) dipisah ke `src/utils/helpers.js`, tidak ditulis di dalam JSX.

## Struktur Folder

```
public/image/            # foto menu & kategori
public/image/galeri/     # BARU: foto galeri "pelanggan makan" (galeri-<kategori>-<n>.jpg)
src/
├── App.jsx                 # INDUK: state global + semua handler (termasuk CRUD admin)
├── main.jsx                # import Bootstrap + tema
├── data/
│   ├── menuData.js         # 25 menu awal & kategori
│   ├── warungInfo.js       # profil warung + CERITA_AWAL
│   ├── galeriData.js       # BARU: 6 kategori × 4 foto galeri
│   ├── adminData.js        # akun admin (hash), tab, status, rekap pesanan dummy
│   └── urutanData.js       # opsi urutan menu awal
├── utils/
│   ├── helpers.js          # formatRupiah, filter, total, validasi, baca file gambar
│   ├── storage.js          # muat/simpan data di localStorage
│   └── hash.js             # fungsi SHA-256 untuk password admin
├── styles/custom.css
├── pages/
│   ├── HomePage.jsx · MenuPage.jsx · AboutPage.jsx · CartPage.jsx
│   └── AdminPage.jsx       # BARU: login + dashboard admin
└── components/
    ├── layout/   Header, NavItem, DropdownItem, Footer, Notification
    ├── common/   InfoBox, MapBox, ContactBox, ConfirmDialog
    ├── home/     Hero, WelcomeArticle, CategoryGrid, CategoryCard, OperatingHours
    ├── about/    AboutStory, ValuesTable, QuickInfo
    ├── menu/     MenuToolbar, ToggleButton, MenuGrid, MenuCard, PriceTable, PriceRow,
    │             Gallery, GalleryItem, GalleryViewer, GalleryPhoto, CartFloatingBar
    ├── cart/     CartList, CartItem, CartSummary, CheckoutForm, EmptyCart, OrderSuccess
    └── admin/    AdminLogin, AdminTabs, AdminTabButton, ImageField,
                  RekapPesanan, RekapTable, RekapRow,
                  MenuManager, MenuForm, MenuTable, MenuTableRow,
                  GaleriManager, GaleriForm, GaleriFotoList, GaleriFotoItem,
                  KategoriManager, KategoriForm, KategoriTable, KategoriRow,
                  UrutanManager, UrutanForm, UrutanTable, UrutanRow, UrutanPreview,
                  CeritaManager, CeritaForm, CeritaPreview
```

## Alur Props (contoh: keranjang)

```
App (cart, handleIncreaseQty, handleDecreaseQty, handleRemoveFromCart)
 └─ CartPage (onIncreaseQty, onDecreaseQty, onRemoveItem)
     └─ CartList (onIncrease, onDecrease, onRemove)
         └─ CartItem → onClick={handleIncrease} → props.onIncrease(id)
```

## Teknologi

React 19 · Vite · Bootstrap 5.3 (CSS) · Hook `useState` & `useRef`
