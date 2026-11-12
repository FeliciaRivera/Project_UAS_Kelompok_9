/*
  KategoriForm — form tambah atau ubah kategori menu (controlled form).
  Nilai dan handler diterima dari KategoriManager melalui props.
*/

function KategoriForm(props) {
  const { formData, errors } = props;

  return (
    <form noValidate onSubmit={props.onSubmit}>
      <div className="mb-3">
        <label htmlFor="kategori-label" className="form-label info-label">Nama kategori *</label>
        <input
          id="kategori-label" name="label" type="text" maxLength={30}
          className={"form-control" + (errors.label ? " is-invalid" : "")}
          placeholder="Contoh: Camilan, Paket Hemat"
          value={formData.label} onChange={props.onChange}
        />
        <div className="invalid-feedback">{errors.label}</div>
        <div className="form-text">
          Setelah ditambahkan, pilih kategori ini pada form Menu &amp; Foto agar menunya tampil di kategori tersebut.
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary flex-grow-1">
          {props.isEditing ? "Simpan Perubahan" : "Tambah Kategori"}
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

export default KategoriForm;
