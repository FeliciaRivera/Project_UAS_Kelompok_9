/*
  KategoriRow — satu baris kategori beserta tombol Edit dan Hapus.
  Tombol Hapus dinonaktifkan selama kategori masih memiliki menu.
*/

function KategoriRow(props) {
  const masihDipakai = props.jumlahMenu > 0;

  function handleEditClick() {
    props.onEdit(props.kategori);
  }

  function handleDeleteClick() {
    props.onDelete(props.kategori.id);
  }

  return (
    <tr className={props.isEditing ? "table-warning" : ""}>
      <td className="fw-semibold">{props.kategori.label}</td>
      <td className="text-center">{props.jumlahMenu}</td>
      <td className="text-center text-nowrap">
        <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={handleEditClick}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          disabled={masihDipakai}
          title={masihDipakai ? "Kategori masih memiliki menu" : "Hapus kategori"}
          onClick={handleDeleteClick}
        >
          Hapus
        </button>
      </td>
    </tr>
  );
}

export default KategoriRow;
