/* Gallery — galeri produk 3 kolom (col-6 col-md-4).
   Setiap kategori bisa diklik untuk membuka foto pelanggan
   yang sedang menikmati menu tersebut (GalleryViewer).
   Fungsi klik diterima dari induk (props.onSelect). */

import GalleryItem from "./GalleryItem.jsx";

function Gallery(props) {
  return (
    <div className="row g-3">
      {props.items.map((kategori) => (
        <div className="col-6 col-md-4" key={kategori.id}>
          <GalleryItem item={kategori} onSelect={props.onSelect} />
        </div>
      ))}
    </div>
  );
}

export default Gallery;
