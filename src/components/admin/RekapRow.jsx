/* RekapRow — satu baris pesanan + badge status berwarna. */

import { STATUS_PESANAN } from "../../data/adminData.js";
import { formatRupiah } from "../../utils/helpers.js";

function RekapRow(props) {
  const warna = STATUS_PESANAN[props.pesanan.status] || "secondary";

  return (
    <tr>
      <td className="text-nowrap">
        <div className="fw-semibold">{props.pesanan.kode}</div>
        <small className="text-muted">{props.pesanan.tanggal}</small>
      </td>
      <td>{props.pesanan.pelanggan}</td>
      <td className="small">{props.pesanan.menu}</td>
      <td className="text-end text-nowrap">{formatRupiah(props.pesanan.total)}</td>
      <td className="text-center">
        <span className={`badge text-bg-${warna}`}>{props.pesanan.status}</span>
      </td>
    </tr>
  );
}

export default RekapRow;
