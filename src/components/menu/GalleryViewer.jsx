/* GalleryViewer — modal berisi foto pelanggan yang sedang
   menikmati satu kategori menu. Tampil jika props.galeri ada.
   Tombol tutup memanggil props.onClose (dari MenuPage). */

import GalleryPhoto from "./GalleryPhoto.jsx";

function GalleryViewer(props) {
  if (!props.galeri) return null;

  return (
    <>
      <div className="modal-backdrop-custom"></div>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ zIndex: 1075 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title text-brand fw-bold">Galeri {props.galeri.label}</h5>
                <small className="text-muted">Momen pelanggan menikmati {props.galeri.label.toLowerCase()} di warung kami</small>
              </div>
              <button type="button" className="btn-close" aria-label="Tutup" onClick={props.onClose}></button>
            </div>
            <div className="modal-body">
              {props.galeri.foto.length === 0 ? (
                <p className="text-muted mb-0">Belum ada foto untuk kategori ini.</p>
              ) : (
                <div className="row g-3">
                  {props.galeri.foto.map((foto) => (
                    <div className="col-12 col-sm-6" key={foto.id}>
                      <GalleryPhoto foto={foto} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={props.onClose}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GalleryViewer;
