# Kasir NekoRamen (ネコラーメン)

Sebuah aplikasi *Point of Sale* (POS) atau kasir sederhana yang dibuat menggunakan HTML, CSS, dan JavaScript. Proyek ini adalah simulasi aplikasi kasir untuk UMKM makanan Jepang fiktif "NekoRamen".

## Fitur Utama

* **Galeri Menu:** Menampilkan daftar makanan dan minuman secara dinamis dari data di `menu.js`.
* **Keranjang Belanja:** Pengguna dapat memilih item, menentukan jumlah, dan menambahkannya ke keranjang.
* **Manajemen Keranjang:** Item dalam keranjang dapat dihapus.
* **Kalkulasi Total:** Secara otomatis menghitung total belanja, pajak (11%), dan total bayar.
* **Penyimpanan Lokal:** Keranjang belanja tersimpan di *Local Storage*, sehingga tidak hilang saat halaman di-refresh.
* **Cetak Struk:** Terdapat tombol untuk membuka jendela *print* browser dan mencetak struk.

## Teknologi

* **HTML:** `index.html` (Struktur utama aplikasi)
* **CSS:** `style.css` (Styling, layout, dan responsivitas)
* **JavaScript:**
    * `menu.js` (Berisi data menu *dummy* dalam bentuk array)
    * `script.js` (Logika utama aplikasi, manipulasi DOM, dan kalkulasi)

## Cara Menjalankan

1.  Pastikan semua file (`index.html`, `style.css`, `script.js`, `menu.js`) berada dalam satu folder yang sama.
2.  Buka file `index.html` di *web browser* (contoh: Google Chrome, Firefox, dll.).