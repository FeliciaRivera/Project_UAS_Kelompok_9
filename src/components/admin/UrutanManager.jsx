/*
  UrutanManager — tab pengelolaan opsi urutan menu.

  Admin dapat menambah, mengubah, dan menghapus opsi yang tampil pada
  dropdown "Urutkan" di halaman Menu. State lokal komponen ini berisi
  isi form, mode edit, pesan error, dan konfirmasi hapus. Perubahan
  dikirim ke App melalui props.onAddUrutan, onUpdateUrutan, dan
  onDeleteUrutan, lalu disimpan ke localStorage.
*/

import { useState } from "react";
import UrutanForm from "./UrutanForm.jsx";
import UrutanPreview from "./UrutanPreview.jsx";
import UrutanTable from "./UrutanTable.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { FIELD_URUTAN } from "../../data/urutanData.js";
import { urutkanMenu, validasiUrutan } from "../../utils/helpers.js";

const FORM_KOSONG = { label: "", field: "harga", arah: "naik" };

function UrutanManager(props) {
  const [formData, setFormData] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Data turunan untuk form dan pratinjau
  const fieldAktif = FIELD_URUTAN.find((f) => f.id === formData.field) || FIELD_URUTAN[0];
  const pratinjau = urutkanMenu(props.menuItems, formData, props.kategoriList).slice(0, 5);
  const opsiAkanDihapus = props.urutanList.find((u) => u.id === pendingDeleteId);

  // Handler form
  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const hasilValidasi = validasiUrutan(formData, props.urutanList, editingId);
    setErrors(hasilValidasi);
    if (Object.keys(hasilValidasi).length > 0) return;

    const dataBersih = { label: formData.label.trim(), field: formData.field, arah: formData.arah };
    if (editingId === null) {
      props.onAddUrutan(dataBersih);
    } else {
      props.onUpdateUrutan(editingId, dataBersih);
    }
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setFormData(FORM_KOSONG);
    setEditingId(null);
    setErrors({});
  }

  // Handler tabel
  function handleEdit(opsi) {
    setEditingId(opsi.id);
    setFormData({ label: opsi.label, field: opsi.field, arah: opsi.arah });
    setErrors({});
  }

  function handleAskDelete(id) {
    setPendingDeleteId(id);
  }

  function handleCancelDelete() {
    setPendingDeleteId(null);
  }

  function handleConfirmDelete() {
    props.onDeleteUrutan(pendingDeleteId);
    if (editingId === pendingDeleteId) handleCancelEdit();
    setPendingDeleteId(null);
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="panel summary-sticky">
          <h3 className="panel-title">{editingId === null ? "Tambah Opsi Urutan" : "Ubah Opsi Urutan"}</h3>
          <UrutanForm
            formData={formData}
            errors={errors}
            isEditing={editingId !== null}
            fieldList={FIELD_URUTAN}
            fieldAktif={fieldAktif}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
          <UrutanPreview items={pratinjau} />
        </div>
      </div>

      <div className="col-lg-7">
        <div className="panel">
          <h3 className="panel-title">Opsi di Halaman Menu ({props.urutanList.length})</h3>
          <UrutanTable
            urutanList={props.urutanList}
            fieldList={FIELD_URUTAN}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleAskDelete}
          />
        </div>
      </div>

      <ConfirmDialog
        show={pendingDeleteId !== null}
        title="Hapus opsi urutan?"
        confirmLabel="Ya, hapus"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        Opsi <strong>{opsiAkanDihapus ? opsiAkanDihapus.label : ""}</strong> tidak akan tampil lagi di halaman Menu.
      </ConfirmDialog>
    </div>
  );
}

export default UrutanManager;
