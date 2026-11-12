/* GalleryPhoto — satu foto di galeri "orang makan".
   Jika file belum dimasukkan ke public/image/galeri/, tampil
   kotak penanda berisi nama file yang harus diisi. */

import { useState } from "react";
import { fotoGaleriUrl, labelSumberFoto } from "../../utils/helpers.js";

function GalleryPhoto(props) {
  const [gagalMuat, setGagalMuat] = useState(false);

  // Handler onError didefinisikan di atas return
  function handleImageError() {
    setGagalMuat(true);
  }

  return (
    <figure className="galeri-foto m-0">
      {gagalMuat ? (
        <div className="galeri-placeholder">
          <span className="fw-bold">Foto belum tersedia</span>
          <code className="small text-break">{labelSumberFoto(props.foto.file)}</code>
        </div>
      ) : (
        <img src={fotoGaleriUrl(props.foto.file)} alt={props.foto.keterangan} loading="lazy" onError={handleImageError} />
      )}
      <figcaption>{props.foto.keterangan}</figcaption>
    </figure>
  );
}

export default GalleryPhoto;
