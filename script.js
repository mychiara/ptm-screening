document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('screening-form');
    const formSection = document.getElementById('form-section');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const backBtn = document.getElementById('back-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ambil nilai dari form
        const nama = document.getElementById('nama').value;
        const usia = parseInt(document.getElementById('usia').value);
        const jenisKelamin = document.getElementById('jenis-kelamin').value;
        
        // Hitung skor risiko
        let skor = 0;
        
        // 1. Merokok
        const merokok = document.querySelector('input[name="merokok"]:checked');
        if (merokok && merokok.value === 'ya') skor += 1;
        
        // 2. Aktivitas fisik
        const aktivitas = document.querySelector('input[name="aktivitas"]:checked');
        if (aktivitas) {
            if (aktivitas.value === 'tidak') skor += 2;
            else if (aktivitas.value === 'jarang') skor += 1;
        }
        
        // 3. Konsumsi sayur dan buah
        const sayurBuah = document.querySelector('input[name="sayur-buah"]:checked');
        if (sayurBuah && sayurBuah.value === 'tidak') skor += 1;
        
        // 4. Riwayat hipertensi
        const hipertensi = document.querySelector('input[name="hipertensi"]:checked');
        if (hipertensi && hipertensi.value === 'ya') skor += 2;
        else if (hipertensi && hipertensi.value === 'tidak-tahu') skor += 1;
        
        // 5. Riwayat diabetes
        const diabetes = document.querySelector('input[name="diabetes"]:checked');
        if (diabetes && diabetes.value === 'ya') skor += 2;
        else if (diabetes && diabetes.value === 'tidak-tahu') skor += 1;
        
        // Tambahan faktor risiko berdasarkan usia
        if (usia >= 45) skor += 1;
        
        // Tentukan tingkat risiko
        let risiko = '';
        let rekomendasi = '';
        
        if (skor >= 6) {
            risiko = 'TINGGI';
            rekomendasi = 'Anda memiliki risiko tinggi terhadap Penyakit Tidak Menular (PTM). Disarankan untuk segera berkonsultasi dengan tenaga kesehatan dan melakukan pemeriksaan lebih lanjut.';
        } else if (skor >= 3) {
            risiko = 'SEDANG';
            rekomendasi = 'Anda memiliki risiko sedang terhadap PTM. Disarankan untuk memperbaiki gaya hidup dan melakukan pemeriksaan kesehatan rutin.';
        } else {
            risiko = 'RENDAH';
            rekomendasi = 'Anda memiliki risiko rendah terhadap PTM. Pertahankan gaya hidup sehat dan lakukan pemeriksaan kesehatan rutin.';
        }
        
        // Tampilkan hasil
        resultContent.innerHTML = `
            <div class="result-card risk-${risiko.toLowerCase()}">
                <h3>Hasil Skrining untuk ${nama}</h3>
                <p>Usia: ${usia} tahun | Jenis Kelamin: ${jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                <div class="score-display">
                    <h4>Skor Risiko: ${skor}</h4>
                    <h2 class="risk-${risiko.toLowerCase()}">Risiko ${risiko}</h2>
                </div>
                <div class="recommendation">
                    <h4>Rekomendasi:</h4>
                    <p>${rekomendasi}</p>
                </div>
                <div class="detail-factors">
                    <h4>Faktor Risiko:</h4>
                    <ul>
                        <li>Merokok: ${merokok ? (merokok.value === 'ya' ? 'Ya (+1)' : 'Tidak (0)') : 'Tidak diisi'}</li>
                        <li>Aktivitas fisik: ${aktivitas ? (
                            aktivitas.value === 'tidak' ? 'Tidak pernah (+2)' : 
                            aktivitas.value === 'jarang' ? '<3x/minggu (+1)' : '≥3x/minggu (0)'
                        ) : 'Tidak diisi'}</li>
                        <li>Konsumsi sayur/buah: ${sayurBuah ? (sayurBuah.value === 'tidak' ? 'Tidak (+1)' : 'Ya (0)') : 'Tidak diisi'}</li>
                        <li>Riwayat hipertensi: ${hipertensi ? (
                            hipertensi.value === 'ya' ? 'Ya (+2)' : 
                            hipertensi.value === 'tidak-tahu' ? 'Tidak tahu (+1)' : 'Tidak (0)'
                        ) : 'Tidak diisi'}</li>
                        <li>Riwayat gula darah tinggi: ${diabetes ? (
                            diabetes.value === 'ya' ? 'Ya (+2)' : 
                            diabetes.value === 'tidak-tahu' ? 'Tidak tahu (+1)' : 'Tidak (0)'
                        ) : 'Tidak diisi'}</li>
                        <li>Usia ≥45 tahun: ${usia >= 45 ? 'Ya (+1)' : 'Tidak (0)'}</li>
                    </ul>
                </div>
            </div>
            <p class="disclaimer">* Hasil ini merupakan skrining awal dan tidak menggantikan diagnosis medis. Konsultasikan dengan tenaga kesehatan untuk pemeriksaan lebih lanjut.</p>
        `;
        
        // Tampilkan hasil, sembunyikan form
        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
    });
    
    backBtn.addEventListener('click', function() {
        formSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
        form.reset();
    });
});