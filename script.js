document.addEventListener("DOMContentLoaded", function() {
    
    // Konfigurasi Intersection Observer
    // threshold: 0.15 berarti elemen akan terpicu animasinya saat 15% dari bagian elemen tersebut masuk ke dalam layar pengguna.
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 
    };

    // Membuat alat pemantau (Observer)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika elemen sudah masuk jangkauan layar
            if (entry.isIntersecting) {
                // Tambahkan kelas 'active' untuk memicu pergerakan CSS
                entry.target.classList.add('active'); 
                
                // Hentikan pemantauan pada elemen ini agar animasi hanya terjadi sekali
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Kumpulkan semua elemen yang memiliki kelas persiapan animasi
    const elementsToAnimate = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    // Perintahkan pemantau untuk mengawasi semua elemen tersebut satu per satu
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // =========================================
// SISTEM GALERI FOTO BERGANTI OTOMATIS
// =========================================

// 1. Tuliskan semua nama file foto stok Anda di sini
// Anda bisa menambahkan sebanyak apa pun fotonya!
const stokFoto = [
    "img-1.jpeg",
    "img-5.jpeg",
    "img-6.jpeg",
    "img-3.jpeg",
    "img-4.jpeg",
    "img-2.jpeg",
    "img-7.jpeg"
    // Contoh penambahan foto baru:
    // "foto_servis_1.jpg",
    // "foto_servis_2.jpg"
];

// Cari semua wadah foto di galeri
const daftarGambarGaleri = document.querySelectorAll('.galeri-dinamis');

if (daftarGambarGaleri.length > 0 && stokFoto.length > 0) {
    // Atur mesin penggerak berjalan setiap 3 detik (3000 milidetik)
    setInterval(() => {
        
        // Pilih satu kotak gambar secara acak dari 5 kotak yang ada
        const kotakAcak = Math.floor(Math.random() * daftarGambarGaleri.length);
        const gambarTarget = daftarGambarGaleri[kotakAcak];

        // Pilih satu foto baru secara acak dari stok foto
        const fotoBaruAcak = Math.floor(Math.random() * stokFoto.length);
        const namaFotoBaru = stokFoto[fotoBaruAcak];

        // Buat efek memudar (Fade Out)
        gambarTarget.style.opacity = "0.2";

        // Ganti fotonya saat sedang memudar (jeda setengah detik)
        setTimeout(() => {
            gambarTarget.src = namaFotoBaru;
            
            // Munculkan kembali fotonya (Fade In)
            gambarTarget.style.opacity = "1";
        }, 500); 

    }, 3000); // Angka 3000 berarti ganti gambar setiap 3 detik. Bisa Anda ubah sesuai selera.
}

});