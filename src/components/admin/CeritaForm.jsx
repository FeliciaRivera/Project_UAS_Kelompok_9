/* CeritaForm — textarea teks Cerita Kami (controlled form). */

import { pecahParagraf } from "../../utils/helpers.js";

function CeritaForm(props) {
  const jumlahParagraf = pecahParagraf(props.teks).length;

  return (
    <form noValidate onSubmit={props.onSubmit}>
      <label htmlFor="cerita-teks" className="form-label info-label">Isi cerita</label>
      <textarea
        id="cerita-teks"
        rows="12"
        className={"form-control" + (props.error ? " is-invalid" : "")}
        value={props.teks}
        onChange={props.onChange}
      ></textarea>
      <div className="invalid-feedback">{props.error}</div>
      <div className="form-text mb-3">
        {jumlahParagraf} paragraf · {props.teks.length} karakter. Pisahkan paragraf dengan satu baris kosong.
      </div>

      <div className="d-flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary" disabled={!props.adaPerubahan}>
          Simpan Perubahan
        </button>
        {props.adaPerubahan && (
          <button type="button" className="btn btn-outline-secondary" onClick={props.onCancel}>
            Batal
          </button>
        )}
        <button type="button" className="btn btn-link ms-auto" onClick={props.onUseDefault}>
          Pakai teks awal
        </button>
      </div>
    </form>
  );
}

export default CeritaForm;
