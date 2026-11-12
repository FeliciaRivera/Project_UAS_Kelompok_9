/*
  KategoriTable — daftar kategori beserta jumlah menu di dalamnya.
*/

import KategoriRow from "./KategoriRow.jsx";

function KategoriTable(props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle price-table mb-0">
        <thead>
          <tr className="kolom">
            <th>Nama kategori</th>
            <th className="text-center">Jumlah menu</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {props.kategoriList.map((kategori) => (
            <KategoriRow
              key={kategori.id}
              kategori={kategori}
              jumlahMenu={props.jumlahMenu[kategori.id]}
              isEditing={props.editingId === kategori.id}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KategoriTable;
