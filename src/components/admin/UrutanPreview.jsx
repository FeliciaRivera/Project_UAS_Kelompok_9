/*
  UrutanPreview — pratinjau lima menu teratas sesuai pengaturan form,
  sehingga admin dapat memeriksa hasilnya sebelum menyimpan.
*/

import { formatRupiah } from "../../utils/helpers.js";

function UrutanPreview(props) {
  return (
    <div className="mt-4">
      <p className="info-label mb-2">Pratinjau 5 menu teratas</p>
      <ol className="list-group list-group-numbered small">
        {props.items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start gap-2">
            <span className="me-auto">
              {item.nama}
              <span className="d-block text-muted">{item.kelompok}</span>
            </span>
            <span className="text-nowrap fw-semibold">{formatRupiah(item.harga)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default UrutanPreview;
