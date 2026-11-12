/* GaleriFotoList — grid foto dalam satu kategori galeri. */

import GaleriFotoItem from "./GaleriFotoItem.jsx";

function GaleriFotoList(props) {
  if (props.foto.length === 0) {
    return <div className="alert alert-light border mb-0">Belum ada foto di kategori ini.</div>;
  }

  return (
    <div className="row g-3">
      {props.foto.map((foto) => (
        <div className="col-12 col-sm-6" key={foto.id}>
          <GaleriFotoItem
            foto={foto}
            isEditing={props.editingId === foto.id}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default GaleriFotoList;
