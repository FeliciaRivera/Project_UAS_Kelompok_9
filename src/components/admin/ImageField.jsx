/* ImageField — input foto untuk form admin.
   Tiga cara mengisi foto:
   1. Nama file lokal  (contoh: nasi-goreng-biasa.jpg)
   2. Link gambar      (https://...)
   3. Upload file      (dibaca jadi base64 lalu disimpan di localStorage)
   Nilai & handler dikirim induk lewat props. */

import { labelSumberFoto } from "../../utils/helpers.js";

function ImageField(props) {
  const dariUpload = (props.value || "").startsWith("data:");

  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="form-label info-label">{props.label}</label>
      <div className="d-flex gap-2 align-items-start">
        {props.value && <img src={props.previewUrl} alt="Pratinjau" className="admin-thumb" />}
        <div className="flex-grow-1">
          <input
            id={props.id}
            name={props.name}
            type="text"
            className={"form-control" + (props.error ? " is-invalid" : "")}
            placeholder={props.placeholder}
            value={dariUpload ? "" : props.value}
            onChange={props.onChange}
          />
          <div className="invalid-feedback">{props.error}</div>
          <input
            type="file"
            accept="image/*"
            className="form-control form-control-sm mt-2"
            aria-label="Upload foto"
            onChange={props.onUpload}
          />
          <div className="form-text">
            {dariUpload ? `Memakai ${labelSumberFoto(props.value).toLowerCase()}. ` : ""}
            {props.hint}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageField;
