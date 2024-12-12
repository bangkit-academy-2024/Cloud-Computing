const fileInput = document.querySelector('.file-input');
const wrapper = document.querySelector('.wrapper');
const form = document.querySelector('form');

form.addEventListener('click', function () {
  fileInput.click();
});

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();

    // Membaca file gambar
    reader.onload = async function (e) {
      // Hapus konten lama dalam wrapper (ikon dan teks)
      wrapper.innerHTML = '';

      // Buat elemen gambar dan set sumbernya
      const imgContainer = document.createElement('div');  // Kontainer untuk gambar dan tombol
      imgContainer.style.position = 'relative';  // Membuat kontainer memiliki posisi relatif

      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Uploaded Image';
      img.style.width = '100%';  // Sesuaikan ukuran gambar
      img.style.height = 'auto'; // Menjaga rasio aspek gambar

      // Tambahkan gambar ke dalam kontainer
      imgContainer.appendChild(img);

      // Membuat tombol refresh kecil di atas gambar
      const refreshButton = document.createElement('button');
      refreshButton.textContent = '↻';  // Tombol refresh (simbol)
      refreshButton.style.position = 'absolute'; // Tombol diposisikan secara absolut
      refreshButton.style.top = '10px';  // Jarak dari atas gambar
      refreshButton.style.right = '10px'; // Jarak dari kanan gambar
      refreshButton.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Latar belakang semi-transparan
      refreshButton.style.border = 'none';
      refreshButton.style.borderRadius = '50%';
      refreshButton.style.padding = '10px';
      refreshButton.style.fontSize = '18px';
      refreshButton.style.cursor = 'pointer';
      refreshButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';  // Memberikan efek shadow pada tombol

      // Event listener untuk tombol refresh
      refreshButton.addEventListener('click', function () {
        location.reload();  // Me-refresh halaman
      });

      // Tambahkan tombol refresh ke dalam kontainer
      imgContainer.appendChild(refreshButton);

      // Tambahkan kontainer gambar beserta tombol ke wrapper
      wrapper.appendChild(imgContainer);

      // Tampilkan loading sementara sebelum prediksi
      const loadingText = document.createElement('p');
      loadingText.textContent = 'Sedang memproses';  // Teks sebelum titik-titik
      loadingText.style.textAlign = 'center';
      loadingText.style.fontSize = '18px';
      loadingText.style.fontFamily = 'Arial, sans-serif';

      // Membuat elemen titik-titik yang beranimasi
      const dots = document.createElement('span');
      dots.style.fontWeight = 'bold'; // Agar titik-titik lebih terlihat
      loadingText.appendChild(dots);
      wrapper.appendChild(loadingText);

      // Animasi titik-titik
      let dotCount = 0; // Variabel untuk menghitung jumlah titik
      const animateDots = () => {
        dotCount = (dotCount + 1) % 4; // Menghitung titik, kembali ke 0 setelah 3 titik
        dots.textContent = '.'.repeat(dotCount); // Mengupdate jumlah titik

        // Panggil lagi fungsi animateDots setelah delay
        setTimeout(animateDots, 500); // Ulangi setiap 500ms (0.5 detik)
      };

      // Mulai animasi
      animateDots();


      // Kirim gambar ke API untuk prediksi
      const predictionResult = await predictImage(file);

      // Hapus teks "Sedang memproses..."
      wrapper.removeChild(loadingText);

      // Buat elemen teks untuk menampilkan hasil prediksi
      const resultText = document.createElement('p');
      if (predictionResult) {
        const result = predictionResult;
        resultText.textContent = `Prediksi: ${result.predicted_class}, Confidence: ${result.confidence.toFixed(0)}%`;
      } else {
        resultText.textContent = 'Gagal mendapatkan prediksi.';
      }
      resultText.style.textAlign = 'center';  // Menyusun teks di tengah
      resultText.style.marginTop = '10px';    // Memberikan sedikit jarak antara gambar dan teks

      // Tambahkan teks ke wrapper
      wrapper.appendChild(resultText);
      if (predictionResult) {
        // Tambahkan tombol hanya jika prediksi berhasil
        const button = document.createElement('button');
        button.textContent = 'ChatBot';  // Teks tombol
        button.style.display = 'block';
        button.style.margin = '20px auto';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';

        // Event listener untuk tombol (misalnya, mengaktifkan chatbot atau lainnya)
        button.addEventListener('click', function () {
          // Mengarahkan ke halaman /chat
          window.location.href = `/chat?result=${predictionResult.predicted_class}`; // Atau bisa juga menggunakan window.location.assign('/chat');
        });


        // Tambahkan tombol ke wrapper
        wrapper.appendChild(button);
      } else {

      }
    };

    // Baca file sebagai data URL
    reader.readAsDataURL(file);
  }
});

async function predictImage(file) {
  const apiUrl = 'https://ml.epialert.my.id/predict';
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,  // Tidak perlu 'Content-Type', FormData menangani itu
    });

    if (response.ok) {
      const result = await response.json();
      return result; // Mengembalikan hasil prediksi
    } else {
      console.error('Error response:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
