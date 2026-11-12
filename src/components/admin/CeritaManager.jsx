/* CeritaManager — tab ubah teks halaman "Cerita Kami".
   State lokal: isi textarea & pesan error. Saat disimpan,
   teks dikirim ke App lewat props.onSaveCerita (→ localStorage). */

import { useState } from "react";
import CeritaForm from "./CeritaForm.jsx";
import CeritaPreview from "./CeritaPreview.jsx";
import { CERITA_AWAL } from "../../data/warungInfo.js";

function CeritaManager(props) {
  const [teks, setTeks] = useState(props.cerita);
  const [error, setError] = useState("");
  const adaPerubahan = teks.trim() !== props.cerita.trim();

  function handleChange(event) {
    setTeks(event.target.value);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (teks.trim().length < 20) {
      setError("Teks cerita minimal 20 karakter.");
      return;
    }
    props.onSaveCerita(teks.trim());
  }

  function handleUseDefault() {
    setTeks(CERITA_AWAL);
    setError("");
  }

  function handleCancel() {
    setTeks(props.cerita);
    setError("");
  }

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="panel h-100">
          <h3 className="panel-title">Ubah Teks Cerita Kami</h3>
          <CeritaForm
            teks={teks}
            error={error}
            adaPerubahan={adaPerubahan}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onUseDefault={handleUseDefault}
          />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="panel h-100">
          <h3 className="panel-title">Pratinjau</h3>
          <CeritaPreview teks={teks} />
        </div>
      </div>
    </div>
  );
}

export default CeritaManager;
