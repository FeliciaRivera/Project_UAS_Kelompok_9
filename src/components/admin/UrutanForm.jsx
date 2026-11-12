/*
  UrutanForm — form tambah atau ubah opsi urutan (controlled form).
  Nilai dan handler diterima dari UrutanManager melalui props.
*/

function UrutanForm(props) {
  const { formData, errors } = props;

  return (
    <form noValidate onSubmit={props.onSubmit}>
      <div className="mb-3">
        <label htmlFor="urutan-label" className="form-label info-label">Nama opsi *</label>
        <input
          id="urutan-label" name="label" type="text"
          className={"form-control" + (errors.label ? " is-invalid" : "")}
          placeholder="Contoh: Menu terbaru"
          value={formData.label} onChange={props.onChange}
        />
        <div className="invalid-feedback">{errors.label}</div>
        <div className="form-text">Teks ini tampil pada dropdown "Urutkan" di halaman Menu.</div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-sm-6">
          <label htmlFor="urutan-field" className="form-label info-label">Urutkan berdasarkan</label>
          <select id="urutan-field" name="field" className="form-select" value={formData.field} onChange={props.onChange}>
            {props.fieldList.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-6">
          <label htmlFor="urutan-arah" className="form-label info-label">Arah</label>
          <select id="urutan-arah" name="arah" className="form-select" value={formData.arah} onChange={props.onChange}>
            <option value="naik">{props.fieldAktif.naik}</option>
            <option value="turun">{props.fieldAktif.turun}</option>
          </select>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary flex-grow-1">
          {props.isEditing ? "Simpan Perubahan" : "Tambah Opsi"}
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

export default UrutanForm;
