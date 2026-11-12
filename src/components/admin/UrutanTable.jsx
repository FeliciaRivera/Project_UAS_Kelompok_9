/*
  UrutanTable — daftar opsi urutan yang tampil di halaman Menu.
*/

import UrutanRow from "./UrutanRow.jsx";

function UrutanTable(props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle price-table mb-0">
        <thead>
          <tr className="kolom">
            <th>Nama opsi</th>
            <th className="d-none d-sm-table-cell">Aturan</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {props.urutanList.map((opsi) => (
            <UrutanRow
              key={opsi.id}
              opsi={opsi}
              fieldList={props.fieldList}
              isEditing={props.editingId === opsi.id}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrutanTable;
