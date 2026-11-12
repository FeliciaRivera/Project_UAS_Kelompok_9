/* GaleriFotoItem — satu foto + tombol Edit & Hapus.
   Foto ditampilkan dengan GalleryPhoto (komponen yang sama dengan
   halaman Menu), jadi file yang belum ada tampil sebagai penanda. */

import GalleryPhoto from "../menu/GalleryPhoto.jsx";
import { labelSumberFoto } from "../../utils/helpers.js";

function GaleriFotoItem(props) {
  function handleEditClick() {
    props.onEdit(props.foto);
  }

  function handleDeleteClick() {
    props.onDelete(props.foto.id);
  }

  return (
    <div className={"border rounded-3 p-2 h-100 d-flex flex-column" + (props.isEditing ? " border-warning bg-warning-subtle" : "")}>
      <GalleryPhoto key={props.foto.file} foto={props.foto} />
      <small className="text-muted text-break mt-2">{labelSumberFoto(props.foto.file)}</small>
      <div className="d-flex gap-2 mt-2">
        <button type="button" className="btn btn-sm btn-outline-primary flex-grow-1" onClick={handleEditClick}>
          Edit
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger flex-grow-1" onClick={handleDeleteClick}>
          Hapus
        </button>
      </div>
    </div>
  );
}

export default GaleriFotoItem;
