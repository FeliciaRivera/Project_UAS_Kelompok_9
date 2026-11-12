/*
  App.jsx — komponen induk (parent component).

  Prinsip yang diterapkan:
  1. Seluruh state global disimpan di komponen ini: halaman aktif,
     keranjang, filter, struk, notifikasi, serta data yang dikelola
     admin (menu, kategori, galeri, cerita, opsi urutan, rekap pesanan,
     login).
  2. Seluruh fungsi pengubah state (handler) didefinisikan di sini,
     di luar blok return.
  3. Handler diteruskan ke komponen anak melalui props, lalu dipanggil
     oleh anak saat event terjadi, misalnya onClick={props.onX}.
  4. Data yang perlu bertahan disimpan ke localStorage melalui
     utils/storage.js sebagai pengganti backend.
*/

import { useRef, useState } from "react";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Notification from "./components/layout/Notification.jsx";

import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

import { KATEGORI, MENU_AWAL } from "./data/menuData.js";
import { GALERI_AWAL } from "./data/galeriData.js";
import { CERITA_AWAL } from "./data/warungInfo.js";
import { URUTAN_AWAL } from "./data/urutanData.js";
import { buatIdBaru, detailKeranjang, hitungTotal, ringkasPesanan } from "./utils/helpers.js";
import { KEY, hapusData, muatData, simpanData } from "./utils/storage.js";

const FILTER_AWAL = { keyword: "", kategori: "semua", urutan: "default", tampilan: "kartu" };

// Buka langsung panel admin jika alamat diakhiri #admin
const HALAMAN_AWAL = window.location.hash === "#admin" ? "admin" : "beranda";

function App() {
  // State tampilan (tidak perlu disimpan)
  const [activePage, setActivePage] = useState(HALAMAN_AWAL);
  const [menuFilter, setMenuFilter] = useState(FILTER_AWAL);
  const [notif, setNotif] = useState(null); // { pesan, varian }
  const notifTimer = useRef(null);

  // State pelanggan, dimuat dari localStorage
  const [cart, setCart] = useState(muatData(KEY.keranjang, [])); // [{ id, qty }]
  const [lastOrder, setLastOrder] = useState(muatData(KEY.struk, null));

  // State yang dikelola admin, dimuat dari localStorage
  const [menuItems, setMenuItems] = useState(muatData(KEY.menu, MENU_AWAL));
  const [kategoriList, setKategoriList] = useState(muatData(KEY.kategori, KATEGORI));
  const [galeri, setGaleri] = useState(muatData(KEY.galeri, GALERI_AWAL));
  const [cerita, setCerita] = useState(muatData(KEY.cerita, CERITA_AWAL));
  const [urutanMenu, setUrutanMenu] = useState(muatData(KEY.urutan, URUTAN_AWAL));
  const [pesananMasuk, setPesananMasuk] = useState(muatData(KEY.pesanan, []));
  const [isAdmin, setIsAdmin] = useState(muatData(KEY.admin, false));

  // Data turunan (dihitung dari state, bukan disimpan ganda)
  const cartItems = detailKeranjang(cart, menuItems);
  const cartTotal = hitungTotal(cartItems);

  // Handler notifikasi
  function showNotif(pesan, varian = "success") {
    clearTimeout(notifTimer.current);
    setNotif({ pesan, varian });
    notifTimer.current = setTimeout(handleCloseNotif, 2500);
  }

  function handleCloseNotif() {
    setNotif(null);
  }

  // Menyimpan ke localStorage dan memberi peringatan jika kuota penuh
  function simpanKeStorage(key, nilai) {
    const berhasil = simpanData(key, nilai);
    if (!berhasil) showNotif("Penyimpanan browser penuh. Gunakan foto yang lebih kecil atau link.", "danger");
    return berhasil;
  }

  // Memperbarui keranjang sekaligus menyimpannya
  function perbaruiKeranjang(daftarBaru) {
    setCart(daftarBaru);
    simpanKeStorage(KEY.keranjang, daftarBaru);
  }

  // Memperbarui struk terakhir sekaligus menyimpannya
  function perbaruiStruk(order) {
    setLastOrder(order);
    simpanKeStorage(KEY.struk, order);
  }

  // Handler navigasi (SPA)
  function handleNavigate(page) {
    setActivePage(page);
    window.history.replaceState(null, "", page === "admin" ? "#admin" : window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Dipakai dropdown navbar & kartu kategori di Beranda
  function handleSelectCategory(kategori, keyword = "") {
    setMenuFilter({ ...FILTER_AWAL, tampilan: menuFilter.tampilan, kategori, keyword });
    handleNavigate("menu");
  }

  // Handler filter menu
  function handleFilterChange(field, value) {
    setMenuFilter({ ...menuFilter, [field]: value });
  }

  function handleResetFilter() {
    setMenuFilter({ ...FILTER_AWAL, tampilan: menuFilter.tampilan });
  }

  // Handler keranjang
  function handleAddToCart(item) {
    const sudahAda = cart.find((c) => c.id === item.id);
    if (sudahAda) {
      perbaruiKeranjang(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      perbaruiKeranjang([...cart, { id: item.id, qty: 1 }]);
    }
    perbaruiStruk(null);
    showNotif(`${item.nama} ditambahkan ke keranjang`);
  }

  function handleIncreaseQty(id) {
    perbaruiKeranjang(cart.map((c) => (c.id === id ? { ...c, qty: Math.min(c.qty + 1, 50) } : c)));
  }

  function handleDecreaseQty(id) {
    perbaruiKeranjang(
      cart
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    );
  }

  function handleRemoveFromCart(id) {
    perbaruiKeranjang(cart.filter((c) => c.id !== id));
    showNotif("Menu dihapus dari keranjang", "warning");
  }

  function handleClearCart() {
    perbaruiKeranjang([]);
    showNotif("Keranjang dikosongkan", "warning");
  }

  // Handler checkout; pesanan juga dicatat ke rekap admin
  function handleCheckout(pelanggan) {
    const order = {
      kode: "WPS-" + Date.now().toString().slice(-6),
      tanggal: new Date().toLocaleString("id-ID"),
      items: cartItems,
      totalItem: cartTotal.totalItem,
      totalHarga: cartTotal.totalHarga,
      pelanggan,
    };
    const rekapBaru = [
      {
        kode: order.kode,
        tanggal: order.tanggal,
        pelanggan: pelanggan.nama,
        menu: ringkasPesanan(cartItems),
        total: order.totalHarga,
        status: "Baru",
      },
      ...pesananMasuk,
    ];
    setPesananMasuk(rekapBaru);
    simpanKeStorage(KEY.pesanan, rekapBaru);
    perbaruiStruk(order);
    perbaruiKeranjang([]);
    showNotif(`Pesanan ${order.kode} berhasil dibuat!`);
  }

  // Handler login admin
  function handleLogin() {
    setIsAdmin(true);
    simpanKeStorage(KEY.admin, true);
    showNotif("Login berhasil. Selamat datang, Admin!");
  }

  function handleLogout() {
    setIsAdmin(false);
    hapusData([KEY.admin]);
    showNotif("Anda telah keluar dari panel admin", "info");
  }

  // Handler admin: menu dan foto
  function perbaruiMenu(daftarBaru) {
    setMenuItems(daftarBaru);
    return simpanKeStorage(KEY.menu, daftarBaru);
  }

  function handleAddMenu(dataBaru) {
    if (perbaruiMenu([...menuItems, { ...dataBaru, id: buatIdBaru(menuItems) }])) {
      showNotif(`Menu "${dataBaru.nama}" ditambahkan`);
    }
  }

  function handleUpdateMenu(id, dataUbah) {
    if (perbaruiMenu(menuItems.map((m) => (m.id === id ? { ...dataUbah, id } : m)))) {
      showNotif(`Menu "${dataUbah.nama}" diperbarui`);
    }
  }

  function handleDeleteMenu(id) {
    const target = menuItems.find((m) => m.id === id);
    perbaruiMenu(menuItems.filter((m) => m.id !== id));
    perbaruiKeranjang(cart.filter((c) => c.id !== id)); // ikut dihapus dari keranjang
    showNotif(`Menu "${target ? target.nama : ""}" dihapus`, "danger");
  }

  // Handler admin: kategori menu
  function perbaruiKategori(daftarBaru) {
    setKategoriList(daftarBaru);
    return simpanKeStorage(KEY.kategori, daftarBaru);
  }

  function handleAddKategori(dataBaru) {
    const kategoriBaru = { ...dataBaru, id: "kategori-" + Date.now() };
    if (perbaruiKategori([...kategoriList, kategoriBaru])) showNotif(`Kategori "${dataBaru.label}" ditambahkan`);
  }

  function handleUpdateKategori(id, dataUbah) {
    if (perbaruiKategori(kategoriList.map((k) => (k.id === id ? { ...k, ...dataUbah } : k)))) {
      showNotif(`Kategori "${dataUbah.label}" diperbarui`);
    }
  }

  // Kategori yang masih dipakai menu tidak boleh dihapus agar tidak ada menu tanpa kategori
  function handleDeleteKategori(id) {
    const target = kategoriList.find((k) => k.id === id);
    const jumlahMenu = menuItems.filter((m) => m.kategori === id).length;
    if (jumlahMenu > 0) {
      showNotif(`Kategori masih dipakai ${jumlahMenu} menu. Pindahkan menu tersebut terlebih dahulu.`, "danger");
      return;
    }
    perbaruiKategori(kategoriList.filter((k) => k.id !== id));
    if (menuFilter.kategori === id) setMenuFilter({ ...menuFilter, kategori: "semua" });
    showNotif(`Kategori "${target ? target.label : ""}" dihapus`, "danger");
  }

  // Handler admin: galeri pelanggan
  function perbaruiGaleri(kategoriId, ubahFoto) {
    const galeriBaru = galeri.map((g) => (g.id === kategoriId ? { ...g, foto: ubahFoto(g.foto) } : g));
    setGaleri(galeriBaru);
    return simpanKeStorage(KEY.galeri, galeriBaru);
  }

  function handleAddFoto(kategoriId, dataFoto) {
    function tambah(daftar) {
      return [...daftar, { ...dataFoto, id: buatIdBaru(daftar) }];
    }
    if (perbaruiGaleri(kategoriId, tambah)) showNotif("Foto galeri ditambahkan");
  }

  function handleUpdateFoto(kategoriId, fotoId, dataFoto) {
    function ubah(daftar) {
      return daftar.map((f) => (f.id === fotoId ? { ...dataFoto, id: fotoId } : f));
    }
    if (perbaruiGaleri(kategoriId, ubah)) showNotif("Foto galeri diperbarui");
  }

  function handleDeleteFoto(kategoriId, fotoId) {
    function hapus(daftar) {
      return daftar.filter((f) => f.id !== fotoId);
    }
    perbaruiGaleri(kategoriId, hapus);
    showNotif("Foto galeri dihapus", "danger");
  }

  // Handler admin: teks Cerita Kami
  function handleSaveCerita(teksBaru) {
    setCerita(teksBaru);
    if (simpanKeStorage(KEY.cerita, teksBaru)) showNotif("Halaman Cerita Kami diperbarui");
  }

  // Handler admin: opsi urutan menu
  function perbaruiUrutan(daftarBaru) {
    setUrutanMenu(daftarBaru);
    return simpanKeStorage(KEY.urutan, daftarBaru);
  }

  function handleAddUrutan(dataBaru) {
    const opsiBaru = { ...dataBaru, id: "urutan-" + Date.now() };
    if (perbaruiUrutan([...urutanMenu, opsiBaru])) showNotif(`Opsi urutan "${dataBaru.label}" ditambahkan`);
  }

  function handleUpdateUrutan(id, dataUbah) {
    if (perbaruiUrutan(urutanMenu.map((u) => (u.id === id ? { ...u, ...dataUbah } : u)))) {
      showNotif(`Opsi urutan "${dataUbah.label}" diperbarui`);
    }
  }

  function handleDeleteUrutan(id) {
    const target = urutanMenu.find((u) => u.id === id);
    perbaruiUrutan(urutanMenu.filter((u) => u.id !== id));
    if (menuFilter.urutan === id) setMenuFilter({ ...menuFilter, urutan: "default" });
    showNotif(`Opsi urutan "${target ? target.label : ""}" dihapus`, "danger");
  }

  // Handler admin: mengembalikan seluruh data ke kondisi awal
  function handleResetData() {
    hapusData([KEY.menu, KEY.kategori, KEY.galeri, KEY.cerita, KEY.urutan, KEY.pesanan, KEY.keranjang, KEY.struk]);
    setMenuItems(MENU_AWAL);
    setKategoriList(KATEGORI);
    setGaleri(GALERI_AWAL);
    setCerita(CERITA_AWAL);
    setUrutanMenu(URUTAN_AWAL);
    setMenuFilter(FILTER_AWAL);
    setPesananMasuk([]);
    setCart([]);
    setLastOrder(null);
    showNotif("Semua data dikembalikan ke kondisi awal", "info");
  }

  // Menentukan halaman yang ditampilkan
  function renderPage() {
    if (activePage === "menu") {
      return (
        <MenuPage
          menuItems={menuItems}
          galeri={galeri}
          kategoriList={kategoriList}
          urutanList={urutanMenu}
          cart={cart}
          cartTotal={cartTotal}
          filter={menuFilter}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === "tentang") {
      return <AboutPage cerita={cerita} />;
    }
    if (activePage === "keranjang") {
      return (
        <CartPage
          cartItems={cartItems}
          cartTotal={cartTotal}
          lastOrder={lastOrder}
          onIncreaseQty={handleIncreaseQty}
          onDecreaseQty={handleDecreaseQty}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === "admin") {
      return (
        <AdminPage
          isAdmin={isAdmin}
          menuItems={menuItems}
          kategoriList={kategoriList}
          galeri={galeri}
          cerita={cerita}
          urutanList={urutanMenu}
          pesananMasuk={pesananMasuk}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onAddMenu={handleAddMenu}
          onUpdateMenu={handleUpdateMenu}
          onDeleteMenu={handleDeleteMenu}
          onAddKategori={handleAddKategori}
          onUpdateKategori={handleUpdateKategori}
          onDeleteKategori={handleDeleteKategori}
          onAddFoto={handleAddFoto}
          onUpdateFoto={handleUpdateFoto}
          onDeleteFoto={handleDeleteFoto}
          onSaveCerita={handleSaveCerita}
          onAddUrutan={handleAddUrutan}
          onUpdateUrutan={handleUpdateUrutan}
          onDeleteUrutan={handleDeleteUrutan}
          onResetData={handleResetData}
          onNavigate={handleNavigate}
        />
      );
    }
    return (
      <HomePage
        menuCount={menuItems.length}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header
        activePage={activePage}
        cartCount={cartTotal.totalItem}
        isAdmin={isAdmin}
        kategoriList={kategoriList}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />

      <main className="container py-4 flex-grow-1">{renderPage()}</main>

      <Footer onNavigate={handleNavigate} />

      <Notification notif={notif} onClose={handleCloseNotif} />
    </div>
  );
}

export default App;
