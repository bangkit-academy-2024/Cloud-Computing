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
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Uploaded Image';
      img.style.width = '100%';  // Sesuaikan ukuran gambar
      img.style.height = 'auto'; // Menjaga rasio aspek gambar

      // Tambahkan gambar ke wrapper
      wrapper.appendChild(img);

      // Tampilkan loading sementara sebelum prediksi
      const loadingText = document.createElement('p');
      loadingText.textContent = 'Sedang memproses...';
      loadingText.style.textAlign = 'center';
      wrapper.appendChild(loadingText);

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
