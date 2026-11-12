/* AboutStory, berisi cerita, visi, dan misi.
   Teks "Cerita Kami" diterima dari App lewat props.cerita
   (bisa diubah admin, disimpan di localStorage). */

import { MISI, VISI } from "../../data/warungInfo.js";
import { gambarUrl, pecahParagraf } from "../../utils/helpers.js";

function AboutStory(props) {
  const paragraf = pecahParagraf(props.cerita);

  return (
    <>
      <h2 className="panel-title">Cerita Kami</h2>
      <img src={gambarUrl("foto-depan.jpeg")} alt="Tampak depan Warung Pojok Mba Sofy" className="article-img mb-3" />
      {paragraf.map((isi, index) => (
        <p key={index}>{isi}</p>
      ))}

      <h3 className="panel-subtitle">Visi</h3>
      <p>{VISI}</p>

      <h3 className="panel-subtitle">Misi</h3>
      <ul className="feature-list list-unstyled">
        {MISI.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </>
  );
}

export default AboutStory;
