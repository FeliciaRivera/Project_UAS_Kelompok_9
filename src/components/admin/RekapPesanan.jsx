/* RekapPesanan — tab rekap pesanan masuk (simulasi).
   Data = pesanan dari halaman Keranjang + contoh pesanan dummy.
   Hanya menampilkan; ringkasan angka dihitung di luar JSX. */

import RekapTable from "./RekapTable.jsx";
import { formatRupiah } from "../../utils/helpers.js";

function RekapPesanan(props) {
  const aktif = props.pesanan.filter((p) => p.status !== "Dibatalkan");
  const pendapatan = aktif.reduce((total, p) => total + p.total, 0);
  const perluDiproses = props.pesanan.filter((p) => p.status === "Baru" || p.status === "Diproses").length;

  return (
    <div className="panel">
      <h3 className="panel-title">Rekap Pesanan Masuk</h3>

      <div className="row g-3 mb-3">
        <div className="col-6 col-md-4">
          <div className="info-box h-100">
            <p className="info-label">Total Pesanan</p>
            <p className="fs-4 fw-bold mb-0">{props.pesanan.length}</p>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="info-box h-100">
            <p className="info-label">Perlu Diproses</p>
            <p className="fs-4 fw-bold mb-0">{perluDiproses}</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="info-box h-100">
            <p className="info-label">Pendapatan (tanpa dibatalkan)</p>
            <p className="fs-4 fw-bold mb-0">{formatRupiah(pendapatan)}</p>
          </div>
        </div>
      </div>

      <RekapTable pesanan={props.pesanan} />

    </div>
  );
}

export default RekapPesanan;
