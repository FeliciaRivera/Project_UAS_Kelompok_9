/*
  Data galeri "pelanggan menikmati menu".

  Terdiri atas 6 kategori, masing-masing berisi 4 foto pelanggan.
  Lokasi foto : public/image/galeri/
  Format nama : galeri-<kategori>-<nomor>.jpg, contoh galeri-nasi-katsu-1.jpg
  Properti "sampul" adalah foto kategori pada Galeri Produk yang
  berada di public/image/. Admin dapat menambah atau mengubah foto
  melalui Panel Admin, dan perubahan disimpan ke localStorage.
*/
function buatFoto(kategori, label) {
  return [1, 2, 3, 4].map(function (nomor) {
    return {
      id: nomor,
      file: `galeri-${kategori}-${nomor}.jpg`,
      keterangan: `Pelanggan menikmati ${label}`,
    };
  });
}

export const GALERI_AWAL = [
  { id: "nasi-goreng", label: "Nasi Goreng", sampul: "nasi-goreng.jpeg", foto: buatFoto("nasi-goreng", "nasi goreng") },
  { id: "kwetiau-mie", label: "Kwetiau / Mie", sampul: "kwetiau-goreng.jpeg", foto: buatFoto("kwetiau-mie", "kwetiau dan mie goreng") },
  { id: "nasi-katsu", label: "Nasi Katsu", sampul: "nasi-katsu.jpeg", foto: buatFoto("nasi-katsu", "nasi katsu") },
  { id: "roti-bakar", label: "Roti Bakar", sampul: "roti-bakar.jpeg", foto: buatFoto("roti-bakar", "roti bakar") },
  { id: "minuman-dingin", label: "Minuman Dingin", sampul: "minuman-dingin.jpeg", foto: buatFoto("minuman-dingin", "minuman dingin") },
  { id: "minuman-hangat", label: "Minuman Hangat", sampul: "kopi-panas.jpeg", foto: buatFoto("minuman-hangat", "minuman hangat") },
];
