/* MenuTableRow — satu baris menu + tombol Edit & Hapus.
   Tombol memanggil props.onEdit(item) / props.onDelete(id). */

import { formatRupiah, gambarUrl } from "../../utils/helpers.js";

function MenuTableRow(props) {
  const kategori = props.kategoriList.find((k) => k.id === props.item.kategori);

  function handleEditClick() {
    props.onEdit(props.item);
  }

  function handleDeleteClick() {
    props.onDelete(props.item.id);
  }

  return (
    <tr className={props.isEditing ? "table-warning" : ""}>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img src={gambarUrl(props.item.gambar)} alt={props.item.nama} className="admin-thumb-sm" />
          <div>
            <div className="fw-semibold">{props.item.nama}</div>
            <small className="text-muted">{props.item.kelompok}</small>
          </div>
        </div>
      </td>
      <td className="d-none d-md-table-cell">{kategori ? kategori.label : "-"}</td>
      <td className="text-end text-nowrap">{formatRupiah(props.item.harga)}</td>
      <td className="text-center text-nowrap">
        <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={handleEditClick}>
          Edit
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleDeleteClick}>
          Hapus
        </button>
      </td>
    </tr>
  );
}

export default MenuTableRow;
