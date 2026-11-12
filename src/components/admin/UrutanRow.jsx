/*
  UrutanRow — satu baris opsi urutan beserta tombol Edit dan Hapus.
  Opsi bawaan ("Default") ditandai dan tidak dapat diubah atau dihapus.
*/

function UrutanRow(props) {
  const field = props.fieldList.find((f) => f.id === props.opsi.field);
  const keteranganArah = field ? field[props.opsi.arah] : "";

  function handleEditClick() {
    props.onEdit(props.opsi);
  }

  function handleDeleteClick() {
    props.onDelete(props.opsi.id);
  }

  return (
    <tr className={props.isEditing ? "table-warning" : ""}>
      <td>
        <div className="fw-semibold">{props.opsi.label}</div>
        <small className="text-muted d-sm-none">{field ? field.label : "-"} · {keteranganArah}</small>
      </td>
      <td className="d-none d-sm-table-cell">
        {field ? field.label : "-"} <span className="text-muted">· {keteranganArah}</span>
      </td>
      <td className="text-center text-nowrap">
        {props.opsi.bawaan ? (
          <span className="badge text-bg-secondary">Bawaan</span>
        ) : (
          <>
            <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={handleEditClick}>
              Edit
            </button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleDeleteClick}>
              Hapus
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default UrutanRow;
