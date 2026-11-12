/*
  KategoriManager — tab pengelolaan kategori menu.

  Admin dapat menambah kategori baru dengan mengetik namanya sendiri,
  mengganti nama kategori, dan menghapus kategori yang tidak lagi
  dipakai menu. Kategori tampil di dropdown Menu pada navbar, tombol
  filter halaman Menu, dan pilihan kategori pada form Menu & Foto.
  Perubahan dikirim ke App melalui props lalu disimpan ke localStorage.
*/

import { useState } from "react";
import KategoriForm from "./KategoriForm.jsx";
import KategoriTable from "./KategoriTable.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { validasiKategori } from "../../utils/helpers.js";

const FORM_KOSONG = { label: "" };

function KategoriManager(props) {
  const [formData, setFormData] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Jumlah menu pada setiap kategori, dipakai tabel dan aturan hapus
  const jumlahMenu = {};
  props.kategoriList.forEach(function (k) {
    jumlahMenu[k.id] = props.menuItems.filter((m) => m.kategori === k.id).length;
  });
  const kategoriAkanDihapus = props.kategoriList.find((k) => k.id === pendingDeleteId);

  // Handler form
  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const hasilValidasi = validasiKategori(formData, props.kategoriList, editingId);
    setErrors(hasilValidasi);
    if (Object.keys(hasilValidasi).length > 0) return;

    const dataBersih = { label: formData.label.trim() };
    if (editingId === null) {
      props.onAddKategori(dataBersih);
    } else {
      props.onUpdateKategori(editingId, dataBersih);
    }
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setFormData(FORM_KOSONG);
    setEditingId(null);
    setErrors({});
  }

  // Handler tabel
  function handleEdit(kategori) {
    setEditingId(kategori.id);
    setFormData({ label: kategori.label });
    setErrors({});
  }

  function handleAskDelete(id) {
    setPendingDeleteId(id);
  }

  function handleCancelDelete() {
    setPendingDeleteId(null);
  }

  function handleConfirmDelete() {
    props.onDeleteKategori(pendingDeleteId);
    if (editingId === pendingDeleteId) handleCancelEdit();
    setPendingDeleteId(null);
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="panel summary-sticky">
          <h3 className="panel-title">{editingId === null ? "Tambah Kategori" : "Ubah Kategori"}</h3>
          <KategoriForm
            formData={formData}
            errors={errors}
            isEditing={editingId !== null}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>

      <div className="col-lg-7">
        <div className="panel">
          <h3 className="panel-title">Daftar Kategori ({props.kategoriList.length})</h3>
          <KategoriTable
            kategoriList={props.kategoriList}
            jumlahMenu={jumlahMenu}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleAskDelete}
          />
          <p className="small text-muted mt-2 mb-0">
            Kategori yang masih memiliki menu tidak dapat dihapus. Pindahkan menunya lewat tab Menu &amp; Foto
            terlebih dahulu.
          </p>
        </div>
      </div>

      <ConfirmDialog
        show={pendingDeleteId !== null}
        title="Hapus kategori?"
        confirmLabel="Ya, hapus"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        Kategori <strong>{kategoriAkanDihapus ? kategoriAkanDihapus.label : ""}</strong> tidak akan tampil lagi di
        navbar dan halaman Menu.
      </ConfirmDialog>
    </div>
  );
}

export default KategoriManager;
