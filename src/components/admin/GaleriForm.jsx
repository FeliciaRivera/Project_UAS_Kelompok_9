/* GaleriForm — form tambah / ubah foto galeri (controlled form). */

import ImageField from "./ImageField.jsx";
import { fotoGaleriUrl } from "../../utils/helpers.js";

function GaleriForm(props) {
  return (
    <form noValidate onSubmit={props.onSubmit}>
      <ImageField
        id="galeri-file"
        name="file"
        label="Foto *"
        placeholder="galeri-nasi-katsu-5.jpg atau https://..."
        hint="Nama file lokal dibaca dari folder public/image/galeri/."
        value={props.formData.file}
        previewUrl={fotoGaleriUrl(props.formData.file)}
        error={props.errors.file}
        onChange={props.onChange}
        onUpload={props.onUpload}
      />

      <div className="mb-3">
        <label htmlFor="galeri-keterangan" className="form-label info-label">Keterangan *</label>
        <input
          id="galeri-keterangan" name="keterangan" type="text"
          className={"form-control" + (props.errors.keterangan ? " is-invalid" : "")}
          placeholder="Contoh: Pelanggan menikmati nasi katsu"
          value={props.formData.keterangan} onChange={props.onChange}
        />
        <div className="invalid-feedback">{props.errors.keterangan}</div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary flex-grow-1">
          {props.isEditing ? "Simpan Perubahan" : "Tambah Foto"}
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

export default GaleriForm;
