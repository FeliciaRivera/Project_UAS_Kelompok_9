/* GaleriManager — tab kelola foto galeri "orang makan".
   State lokal: kategori yang dipilih, isi form, mode edit,
   error, dan konfirmasi hapus. Perubahan dikirim ke App lewat
   props.onAddFoto / onUpdateFoto / onDeleteFoto (→ localStorage). */

import { useState } from "react";
import GaleriForm from "./GaleriForm.jsx";
import GaleriFotoList from "./GaleriFotoList.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { bacaFileGambar, validasiFoto } from "../../utils/helpers.js";

const FORM_KOSONG = { file: "", keterangan: "" };

function GaleriManager(props) {
  const [kategoriId, setKategoriId] = useState(props.galeri[0].id);
  const [formData, setFormData] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const kategoriAktif = props.galeri.find((g) => g.id === kategoriId) || props.galeri[0];

  // Handler pilih kategori
  function handleKategoriChange(event) {
    setKategoriId(event.target.value);
    handleCancelEdit();
  }

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
      return { ...lama, file: dataUrl };
    });
    setErrors(function (lama) {
      return { ...lama, file: undefined };
    });
  }

  function tolakUpload(err) {
    setErrors(function (lama) {
      return { ...lama, file: err.message };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const hasilValidasi = validasiFoto(formData);
    setErrors(hasilValidasi);
    if (Object.keys(hasilValidasi).length > 0) return;

    const dataBersih = { file: formData.file.trim(), keterangan: formData.keterangan.trim() };
    if (editingId === null) {
      props.onAddFoto(kategoriAktif.id, dataBersih);
    } else {
      props.onUpdateFoto(kategoriAktif.id, editingId, dataBersih);
    }
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setFormData(FORM_KOSONG);
    setEditingId(null);
    setErrors({});
  }

  // Handler daftar foto
  function handleEdit(foto) {
    setEditingId(foto.id);
    setFormData({ file: foto.file, keterangan: foto.keterangan });
    setErrors({});
  }

  function handleAskDelete(id) {
    setPendingDeleteId(id);
  }

  function handleCancelDelete() {
    setPendingDeleteId(null);
  }

  function handleConfirmDelete() {
    props.onDeleteFoto(kategoriAktif.id, pendingDeleteId);
    if (editingId === pendingDeleteId) handleCancelEdit();
    setPendingDeleteId(null);
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="panel summary-sticky">
          <label htmlFor="galeri-kategori" className="form-label info-label">Kategori galeri</label>
          <select id="galeri-kategori" className="form-select mb-3" value={kategoriAktif.id} onChange={handleKategoriChange}>
            {props.galeri.map((g) => (
              <option key={g.id} value={g.id}>{g.label} ({g.foto.length} foto)</option>
            ))}
          </select>

          <h3 className="panel-title">{editingId === null ? "Tambah Foto" : "Ubah Foto"}</h3>
          <GaleriForm
            formData={formData}
            errors={errors}
            isEditing={editingId !== null}
            onChange={handleFormChange}
            onUpload={handleUpload}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>

      <div className="col-lg-8">
        <div className="panel">
          <h3 className="panel-title">Foto {kategoriAktif.label}</h3>
          <GaleriFotoList
            foto={kategoriAktif.foto}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleAskDelete}
          />
        </div>
      </div>

      <ConfirmDialog
        show={pendingDeleteId !== null}
        title="Hapus foto galeri?"
        confirmLabel="Ya, hapus"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        Foto akan dihapus dari galeri {kategoriAktif.label}. File aslinya di folder proyek tidak ikut terhapus.
      </ConfirmDialog>
    </div>
  );
}

export default GaleriManager;
