/* MenuForm — form tambah / ubah menu (controlled form).
   Semua nilai & handler diterima dari MenuManager lewat props. */

import ImageField from "./ImageField.jsx";
import { gambarUrl } from "../../utils/helpers.js";

function MenuForm(props) {
  const { formData, errors } = props;

  return (
    <form noValidate onSubmit={props.onSubmit}>
      <div className="mb-3">
        <label htmlFor="menu-nama" className="form-label info-label">Nama Menu *</label>
        <input
          id="menu-nama" name="nama" type="text" placeholder="Contoh: Nasi Goreng Pete"
          className={"form-control" + (errors.nama ? " is-invalid" : "")}
          value={formData.nama} onChange={props.onChange}
        />
        <div className="invalid-feedback">{errors.nama}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="menu-kelompok" className="form-label info-label">Kelompok *</label>
        <input
          id="menu-kelompok" name="kelompok" type="text" list="daftar-kelompok" placeholder="Pilih / ketik kelompok"
          className={"form-control" + (errors.kelompok ? " is-invalid" : "")}
          value={formData.kelompok} onChange={props.onChange}
        />
        <datalist id="daftar-kelompok">
          {props.kelompokOptions.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
        <div className="invalid-feedback">{errors.kelompok}</div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-6">
          <label htmlFor="menu-kategori" className="form-label info-label">Kategori *</label>
          <select
            id="menu-kategori" name="kategori"
            className={"form-select" + (errors.kategori ? " is-invalid" : "")}
            value={formData.kategori} onChange={props.onChange}
          >
            <option value="">Pilih kategori</option>
            {props.kategoriList.map((k) => (
              <option key={k.id} value={k.id}>{k.label}</option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.kategori}</div>
        </div>
        <div className="col-6">
          <label htmlFor="menu-harga" className="form-label info-label">Harga (Rp) *</label>
          <input
            id="menu-harga" name="harga" type="number" min="1000" step="500" placeholder="20000"
            className={"form-control" + (errors.harga ? " is-invalid" : "")}
            value={formData.harga} onChange={props.onChange}
          />
          <div className="invalid-feedback">{errors.harga}</div>
        </div>
      </div>

      <ImageField
        id="menu-gambar"
        name="gambar"
        label="Foto Menu *"
        placeholder="nasi-goreng-pete.jpg atau https://..."
        hint="Nama file lokal dibaca dari folder public/image/."
        value={formData.gambar}
        previewUrl={gambarUrl(formData.gambar)}
        error={errors.gambar}
        onChange={props.onChange}
        onUpload={props.onUpload}
      />

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary flex-grow-1">
          {props.isEditing ? "Simpan Perubahan" : "Tambah Menu"}
        </button>
        {props.isEditing && (
          <button type="button" className="btn btn-outline-secondary" onClick={props.onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default MenuForm;
