/* CeritaPreview — pratinjau teks seperti di halaman Tentang. */

import { pecahParagraf } from "../../utils/helpers.js";

function CeritaPreview(props) {
  const paragraf = pecahParagraf(props.teks);

  if (paragraf.length === 0) {
    return <p className="text-muted mb-0">Teks masih kosong.</p>;
  }

  return (
    <div className="cerita-preview">
      {paragraf.map((isi, index) => (
        <p key={index}>{isi}</p>
      ))}
    </div>
  );
}

export default CeritaPreview;
