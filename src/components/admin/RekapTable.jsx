/* RekapTable — tabel rekap pesanan (Bootstrap table-responsive). */

import RekapRow from "./RekapRow.jsx";

function RekapTable(props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle price-table mb-0">
        <thead>
          <tr className="kolom">
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Menu</th>
            <th className="text-end">Total</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {props.pesanan.map((pesanan) => (
            <RekapRow key={pesanan.kode} pesanan={pesanan} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RekapTable;
