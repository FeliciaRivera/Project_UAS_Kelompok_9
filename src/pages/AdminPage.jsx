/*
  AdminPage — Panel Admin (simulasi backend dengan JavaScript).

  Sebelum login, halaman menampilkan AdminLogin. Setelah login,
  tersedia dashboard dengan enam tab: Rekap Pesanan, Menu & Foto,
  Kategori Menu, Urutan Menu, Galeri, dan Cerita Kami.

  State lokal berisi isi form login, pesan error, tab aktif, dan
  konfirmasi reset. Perubahan data diteruskan ke App melalui props
  (onAddMenu, onSaveCerita, dan lainnya), lalu App menyimpannya
  ke localStorage.
*/
import { useState } from "react";
import AdminLogin from "../components/admin/AdminLogin.jsx";
import AdminTabs from "../components/admin/AdminTabs.jsx";
import RekapPesanan from "../components/admin/RekapPesanan.jsx";
import MenuManager from "../components/admin/MenuManager.jsx";
import GaleriManager from "../components/admin/GaleriManager.jsx";
import CeritaManager from "../components/admin/CeritaManager.jsx";
import KategoriManager from "../components/admin/KategoriManager.jsx";
import UrutanManager from "../components/admin/UrutanManager.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { AKUN_ADMIN, REKAP_PESANAN_DUMMY, TAB_ADMIN } from "../data/adminData.js";
import { cekLoginAdmin } from "../utils/helpers.js";

const LOGIN_KOSONG = { username: "", password: "" };

function AdminPage(props) {
  const [loginForm, setLoginForm] = useState(LOGIN_KOSONG);
  const [loginError, setLoginError] = useState("");
  const [tabAktif, setTabAktif] = useState(TAB_ADMIN[0].id);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Pesanan dari halaman Keranjang (terbaru) + contoh pesanan dummy
  const semuaPesanan = [...props.pesananMasuk, ...REKAP_PESANAN_DUMMY];

  // Handler login
  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
    setLoginError("");
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    if (cekLoginAdmin(loginForm, AKUN_ADMIN)) {
      setLoginForm(LOGIN_KOSONG);
      props.onLogin();
    } else {
      setLoginError("Username atau password salah.");
    }
  }

  // Handler dashboard
  function handleTabSelect(id) {
    setTabAktif(id);
  }

  function handleBackToSite() {
    props.onNavigate("beranda");
  }

  function handleAskReset() {
    setShowResetConfirm(true);
  }

  function handleCancelReset() {
    setShowResetConfirm(false);
  }

  function handleConfirmReset() {
    setShowResetConfirm(false);
    props.onResetData();
  }

  // Isi tab aktif
  function renderTab() {
    if (tabAktif === "menu") {
      return (
        <MenuManager
          menuItems={props.menuItems}
          kategoriList={props.kategoriList}
          onAddMenu={props.onAddMenu}
          onUpdateMenu={props.onUpdateMenu}
          onDeleteMenu={props.onDeleteMenu}
        />
      );
    }
    if (tabAktif === "kategori") {
      return (
        <KategoriManager
          kategoriList={props.kategoriList}
          menuItems={props.menuItems}
          onAddKategori={props.onAddKategori}
          onUpdateKategori={props.onUpdateKategori}
          onDeleteKategori={props.onDeleteKategori}
        />
      );
    }
    if (tabAktif === "galeri") {
      return (
        <GaleriManager
          galeri={props.galeri}
          onAddFoto={props.onAddFoto}
          onUpdateFoto={props.onUpdateFoto}
          onDeleteFoto={props.onDeleteFoto}
        />
      );
    }
    if (tabAktif === "urutan") {
      return (
        <UrutanManager
          urutanList={props.urutanList}
          menuItems={props.menuItems}
          kategoriList={props.kategoriList}
          onAddUrutan={props.onAddUrutan}
          onUpdateUrutan={props.onUpdateUrutan}
          onDeleteUrutan={props.onDeleteUrutan}
        />
      );
    }
    if (tabAktif === "cerita") {
      // key: form diisi ulang jika teks berubah dari luar (mis. reset data)
      return <CeritaManager key={props.cerita} cerita={props.cerita} onSaveCerita={props.onSaveCerita} />;
    }
    return <RekapPesanan pesanan={semuaPesanan} />;
  }

  if (!props.isAdmin) {
    return (
      <AdminLogin
        formData={loginForm}
        error={loginError}
        onChange={handleLoginChange}
        onSubmit={handleLoginSubmit}
        onBack={handleBackToSite}
      />
    );
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 page-title">
        <div>
          <h2 className="mb-0 fw-bold">Panel Admin</h2>
          <small className="text-muted fw-normal">Login sebagai {AKUN_ADMIN.username}</small>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleBackToSite}>
            Lihat Website
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleAskReset}>
            Kembalikan data awal
          </button>
          <button type="button" className="btn btn-sm btn-danger" onClick={props.onLogout}>
            Keluar
          </button>
        </div>
      </div>

      <AdminTabs tabs={TAB_ADMIN} aktif={tabAktif} onSelect={handleTabSelect} />

      <div className="mt-3">{renderTab()}</div>

      <ConfirmDialog
        show={showResetConfirm}
        title="Kembalikan data awal?"
        confirmLabel="Ya, kembalikan"
        variant="primary"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      >
        Semua perubahan menu, kategori, galeri, opsi urutan, teks Cerita Kami, isi keranjang, dan pesanan dari halaman
        Keranjang akan dihapus dari penyimpanan browser.
      </ConfirmDialog>
    </>
  );
}

export default AdminPage;
