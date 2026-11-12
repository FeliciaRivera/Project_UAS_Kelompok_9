/* MenuTable — tabel daftar menu untuk admin. */

import MenuTableRow from "./MenuTableRow.jsx";

function MenuTable(props) {
  if (props.items.length === 0) {
    return <div className="alert alert-light border mb-0">Tidak ada menu yang cocok.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle price-table mb-0">
        <thead>
          <tr className="kolom">
            <th>Menu</th>
            <th className="d-none d-md-table-cell">Kategori</th>
            <th className="text-end">Harga</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {props.items.map((item) => (
            <MenuTableRow
              key={item.id}
              item={item}
              kategoriList={props.kategoriList}
              isEditing={props.editingId === item.id}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuTable;
