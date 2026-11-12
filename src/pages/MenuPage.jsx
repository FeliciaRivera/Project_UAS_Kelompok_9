/*
  MenuPage — halaman katalog menu.
  Fitur: pencarian, filter kategori, urutan menu (opsi dapat dikelola
  admin), tampilan kartu atau tabel, tombol tambah ke keranjang,
  bar keranjang, dan galeri foto pelanggan per kategori.

  Seluruh handler didefinisikan di luar blok return lalu diteruskan
  ke komponen anak melalui props. Pemrosesan data (filter dan urutan)
  juga dilakukan di sini, bukan di dalam JSX.
*/

import MenuToolbar from "../components/menu/MenuToolbar.jsx";
import MenuGrid from "../components/menu/MenuGrid.jsx";
import PriceTable from "../components/menu/PriceTable.jsx";
import { useState } from "react";
import Gallery from "../components/menu/Gallery.jsx";
import GalleryViewer from "../components/menu/GalleryViewer.jsx";
import CartFloatingBar from "../components/menu/CartFloatingBar.jsx";
import { prosesDaftarMenu } from "../utils/helpers.js";

function MenuPage(props) {
  // State lokal: kategori galeri yang sedang dibuka (null = tertutup)
  const [galeriAktifId, setGaleriAktifId] = useState(null);
  const galeriAktif = props.galeri.find((g) => g.id === galeriAktifId) || null;

  //  Pemrosesan data 
  const filteredItems = prosesDaftarMenu(props.menuItems, props.filter, props.urutanList, props.kategoriList);

  // Jumlah tiap menu di keranjang → { idMenu: qty }
  const qtyMap = {};
  props.cart.forEach(function (c) {
    qtyMap[c.id] = c.qty;
  });

  // Kategori yang tampil di mode tabel
  const kategoriTampil = props.kategoriList.filter(function (k) {
    return filteredItems.some((item) => item.kategori === k.id);
  });

  // Handler yang dioper ke komponen anak melalui props
  function handleKeywordChange(event) {
    props.onFilterChange("keyword", event.target.value);
  }

  function handleCategoryChange(kategori) {
    props.onFilterChange("kategori", kategori);
  }

  function handleSortChange(event) {
    props.onFilterChange("urutan", event.target.value);
  }

  function handleViewChange(tampilan) {
    props.onFilterChange("tampilan", tampilan);
  }

  function handleOpenGaleri(id) {
    setGaleriAktifId(id);
  }

  function handleCloseGaleri() {
    setGaleriAktifId(null);
  }

  function handleViewCart() {
    props.onNavigate("keranjang");
  }

  return (
    <>
      <h2 className="page-title">Katalog Menu &amp; Daftar Harga</h2>
      <p className="fst-italic text-brand-soft small">
        Semua harga dalam Rupiah. Klik <strong>+ Keranjang</strong> untuk memesan, lalu selesaikan pesanan di halaman Keranjang.
      </p>

      <MenuToolbar
        filter={props.filter}
        urutanList={props.urutanList}
        kategoriList={props.kategoriList}
        resultCount={filteredItems.length}
        onKeywordChange={handleKeywordChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        onReset={props.onResetFilter}
      />

      {filteredItems.length === 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Menu yang Anda cari tidak ditemukan.</span>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={props.onResetFilter}>
            Reset filter
          </button>
        </div>
      )}

      {props.filter.tampilan === "kartu" ? (
        <MenuGrid items={filteredItems} qtyMap={qtyMap} onAddToCart={props.onAddToCart} />
      ) : (
        kategoriTampil.map((k) => (
          <section key={k.id} id={k.id} className="mb-4">
            <h3 className="h5 fw-bold text-brand mt-3">{k.label}</h3>
            <PriceTable
              judul={`Katalog ${k.label} Warung Pojok Mba Sofy`}
              items={filteredItems.filter((item) => item.kategori === k.id)}
              onAddToCart={props.onAddToCart}
            />
          </section>
        ))
      )}

      <section className="mt-5">
        <h3 className="h5 fw-bold text-brand">Galeri Produk</h3>
        <p className="small text-muted">Klik salah satu kategori untuk melihat foto pelanggan yang sedang menikmati menunya.</p>
        <Gallery items={props.galeri} onSelect={handleOpenGaleri} />
      </section>

      <CartFloatingBar
        totalItem={props.cartTotal.totalItem}
        totalHarga={props.cartTotal.totalHarga}
        onViewCart={handleViewCart}
      />

      <GalleryViewer galeri={galeriAktif} onClose={handleCloseGaleri} />
    </>
  );
}

export default MenuPage;
