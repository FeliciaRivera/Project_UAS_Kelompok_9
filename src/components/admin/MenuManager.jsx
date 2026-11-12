/* MenuManager — tab kelola daftar menu & foto menu (CRUD).
   State lokal: isi form, mode edit, pencarian, error, konfirmasi
   hapus. Perubahan dikirim ke App lewat props.onAddMenu /
   onUpdateMenu / onDeleteMenu (→ localStorage), sehingga halaman
   Menu dan Keranjang ikut berubah. */

import { useState } from "react";
import MenuForm from "./MenuForm.jsx";
import MenuTable from "./MenuTable.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { bacaFileGambar, validasiMenu } from "../../utils/helpers.js";

const FORM_KOSONG = { nama: "", kelompok: "", kategori: "", harga: "", gambar: "" };

function MenuManager(props) {
  const [formData, setFormData] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [keyword, setKeyword] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Pemrosesan data (di luar JSX)
  const kelompokOptions = [...new Set(props.menuItems.map((m) => m.kelompok))];
  const kata = keyword.trim().toLowerCase();
  const itemsTampil = props.menuItems.filter(function (m) {
    return kata === "" || m.nama.toLowerCase().includes(kata) || m.kelompok.toLowerCase().includes(kata);
  });
  const menuAkanDihapus = props.menuItems.find((m) => m.id === pendingDeleteId);

  // Handler form
  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    bacaFileGambar(file).then(terimaHasilUpload).catch(tolakUpload);
    event.target.value = "";
  }

  function terimaHasilUpload(dataUrl) {
    setFormData(function (lama) {
      return { ...lama, gambar: dataUrl };
    });
    setErrors(function (lama) {
      return { ...lama, gambar: undefined };
    });
  }

  function tolakUpload(err) {
    setErrors(function (lama) {
      return { ...lama, gambar: err.message };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const hasilValidasi = validasiMenu(formData);
    setErrors(hasilValidasi);
    if (Object.keys(hasilValidasi).length > 0) return;

    const dataBersih = {
      ...formData,
      nama: formData.nama.trim(),
      kelompok: formData.kelompok.trim(),
      harga: Number(formData.harga),
      gambar: formData.gambar.trim(),
    };
    if (editingId === null) {
      props.onAddMenu(dataBersih);
    } else {
      props.onUpdateMenu(editingId, dataBersih);
    }
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setFormData(FORM_KOSONG);
    setEditingId(null);
    setErrors({});
  }

  // Handler tabel
  function handleEdit(item) {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      kelompok: item.kelompok,
      kategori: item.kategori,
      harga: String(item.harga),
      gambar: item.gambar,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAskDelete(id) {
    setPendingDeleteId(id);
  }

  function handleCancelDelete() {
    setPendingDeleteId(null);
  }

  function handleConfirmDelete() {
    props.onDeleteMenu(pendingDeleteId);
    if (editingId === pendingDeleteId) handleCancelEdit();
    setPendingDeleteId(null);
  }

  function handleSearchChange(event) {
    setKeyword(event.target.value);
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="panel summary-sticky">
          <h3 className="panel-title">{editingId === null ? "Tambah Menu" : "Ubah Menu"}</h3>
          <MenuForm
            formData={formData}
            errors={errors}
            isEditing={editingId !== null}
            kategoriList={props.kategoriList}
            kelompokOptions={kelompokOptions}
            onChange={handleFormChange}
            onUpload={handleUpload}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>

      <div className="col-lg-8">
        <div className="panel">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h3 className="panel-title mb-0 border-0">Daftar Menu ({props.menuItems.length})</h3>
            <input
              type="search"
              className="form-control form-control-sm admin-search"
              placeholder="Cari nama / kelompok…"
              aria-label="Cari menu"
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <MenuTable
            items={itemsTampil}
            kategoriList={props.kategoriList}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleAskDelete}
          />
        </div>
      </div>

      <ConfirmDialog
        show={pendingDeleteId !== null}
        title="Hapus menu?"
        confirmLabel="Ya, hapus"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        Menu <strong>{menuAkanDihapus ? menuAkanDihapus.nama : ""}</strong> akan dihapus dari katalog dan keranjang.
      </ConfirmDialog>
    </div>
  );
}

export default MenuManager;
