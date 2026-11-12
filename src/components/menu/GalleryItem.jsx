/* GalleryItem — satu kartu kategori di Galeri Produk.
   Klik → props.onSelect(id kategori). */

import { gambarUrl } from "../../utils/helpers.js";

function GalleryItem(props) {
  function handleClick() {
    props.onSelect(props.item.id);
  }

  return (
    <button
      type="button"
      className="gallery-item gallery-button w-100 p-0 border-0 text-start"
      onClick={handleClick}
      aria-label={`Lihat foto pelanggan menikmati ${props.item.label}`}
    >
      <figure className="m-0 position-relative">
        <img src={gambarUrl(props.item.sampul)} alt={props.item.label} loading="lazy" />
        <span className="badge text-bg-dark bg-opacity-75 position-absolute top-0 end-0 m-2">
          {props.item.foto.length} foto
        </span>
        <figcaption>
          {props.item.label}
          <span className="d-block small fw-normal">Klik untuk lihat galeri</span>
        </figcaption>
      </figure>
    </button>
  );
}

export default GalleryItem;
