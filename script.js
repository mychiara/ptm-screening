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
        const beratBadan = parseFloat(document.getElementById('berat-badan').value);
        const tinggiBadan = parseFloat(document.getElementById('tinggi-badan').value);
        const lingkarPinggang = parseFloat(document.getElementById('lingkar-pinggang').value);
        const sistolik = parseInt(document.getElementById('tekanan-darah-sistolik').value);
        const diastolik = parseInt(document.getElementById('tekanan-darah-diastolik').value);
        const gulaDarah = parseInt(document.getElementById('gula-darah-sewaktu').value);
        const kolesterol = parseInt(document.getElementById('kolesterol-total').value);
        
        // Hitung skor risiko berdasarkan standar Kemenkes
        let skor = 0;
        let faktorRisiko = [];
        
        // 1. Merokok
        const merokok = document.querySelector('input[name="merokok"]:checked');
        if (merokok && merokok.value === 'ya') {
            skor += 1;
            faktorRisiko.push("Merokok setiap hari");
        }
        
        // 2. Aktivitas fisik
        const aktivitas = document.querySelector('input[name="aktivitas"]:checked');
        if (aktivitas) {
            if (aktivitas.value === 'tidak') {
                skor += 2;
                faktorRisiko.push("Aktivitas fisik <1x/minggu");
            } else if (aktivitas.value === 'jarang') {
                skor += 1;
                faktorRisiko.push("Aktivitas fisik 1-2x/minggu");
            }
        }
        
        // 3. Konsumsi sayur dan buah
        const sayurBuah = document.querySelector('input[name="sayur-buah"]:checked');
        if (sayurBuah && sayurBuah.value === 'tidak') {
            skor += 1;
            faktorRisiko.push("Konsumsi sayur/buah <5 porsi/hari");
        }
        
        // 4. Riwayat hipertensi
        const hipertensi = document.querySelector('input[name="hipertensi"]:checked');
        if (hipertensi && hipertensi.value === 'ya') {
            skor += 2;
            faktorRisiko.push("Riwayat hipertensi");
        } else if (hipertensi && hipertensi.value === 'tidak-tahu') {
            skor += 1;
            faktorRisiko.push("Tidak tahu riwayat hipertensi");
        }
        
        // 5. Riwayat diabetes
        const diabetes = document.querySelector('input[name="diabetes"]:checked');
        if (diabetes && diabetes.value === 'ya') {
            skor += 2;
            faktorRisiko.push("Riwayat gula darah tinggi");
        } else if (diabetes && diabetes.value === 'tidak-tahu') {
            skor += 1;
            faktorRisiko.push("Tidak tahu riwayat gula darah");
        }
        
        // Tambahan faktor risiko berdasarkan usia
        if (usia >= 45) {
            skor += 1;
            faktorRisiko.push("Usia ≥45 tahun");
        }
        
        // Analisis pemeriksaan fisik
        let tekananDarahStatus = "Normal";
        if (sistolik && diastolik) {
            if (sistolik >= 140 || diastolik >= 90) {
                tekananDarahStatus = "Hipertensi";
                faktorRisiko.push(`Tekanan darah tinggi (${sistolik}/${diastolik} mmHg)`);
            } else if (sistolik >= 120 || diastolik >= 80) {
                tekananDarahStatus = "Pra-Hipertensi";
            }
        }
        
        let obesitasSentral = false;
        if (lingkarPinggang) {
            if ((jenisKelamin === 'L' && lingkarPinggang >= 90) || 
                (jenisKelamin === 'P' && lingkarPinggang >= 80)) {
                obesitasSentral = true;
                faktorRisiko.push(`Obesitas sentral (LP: ${lingkarPinggang} cm)`);
            }
        }
        
        let imt = null;
        let imtStatus = "";
        if (beratBadan && tinggiBadan) {
            imt = beratBadan / Math.pow(tinggiBadan/100, 2);
            if (imt >= 25) {
                imtStatus = "Berat badan lebih";
                faktorRisiko.push(`IMT ${imt.toFixed(1)} (Berat badan lebih)`);
            } else if (imt >= 30) {
                imtStatus = "Obesitas";
                faktorRisiko.push(`IMT ${imt.toFixed(1)} (Obesitas)`);
            }
        }
        
        let gulaDarahStatus = "";
        if (gulaDarah) {
            if (gulaDarah >= 140) {
                gulaDarahStatus = "Tinggi";
                faktorRisiko.push(`Gula darah sewaktu tinggi (${gulaDarah} mg/dL)`);
            } else {
                gulaDarahStatus = "Normal";
            }
        }
        
        let kolesterolStatus = "";
        if (kolesterol) {
            if (kolesterol >= 200) {
                kolesterolStatus = "Tinggi";
                faktorRisiko.push(`Kolesterol total tinggi (${kolesterol} mg/dL)`);
            } else {
                kolesterolStatus = "Normal";
            }
        }
        
        // Tentukan tingkat risiko
        let risiko = '';
        let rekomendasi = '';
        
        if (skor >= 6 || tekananDarahStatus === "Hipertensi" || gulaDarahStatus === "Tinggi") {
            risiko = 'TINGGI';
            rekomendasi = 'Anda memiliki risiko tinggi terhadap Penyakit Tidak Menular (PTM). Disarankan untuk:';
            rekomendasi += '\n- Segera berkonsultasi dengan tenaga kesehatan';
            rekomendasi += '\n- Pemeriksaan laboratorium lengkap';
            rekomendasi += '\n- Modifikasi gaya hidup segera';
            rekomendasi += '\n- Pemantauan rutin tekanan darah/gula darah';
        } else if (skor >= 3 || tekananDarahStatus === "Pra-Hipertensi" || obesitasSentral) {
            risiko = 'SEDANG';
            rekomendasi = 'Anda memiliki risiko sedang terhadap PTM. Disarankan untuk:';
            rekomendasi += '\n- Perbaiki pola makan dan aktivitas fisik';
            rekomendasi += '\n- Pemeriksaan kesehatan rutin 6 bulan sekali';
            rekomendasi += '\n- Monitor tekanan darah dan lingkar pinggang';
            rekomendasi += '\n- Hindari rokok dan alkohol';
        } else {
            risiko = 'RENDAH';
            rekomendasi = 'Anda memiliki risiko rendah terhadap PTM. Pertahankan gaya hidup sehat dengan:';
            rekomendasi += '\n- Konsumsi sayur/buah cukup';
            rekomendasi += '\n- Aktivitas fisik teratur';
            rekomendasi += '\n- Pemeriksaan kesehatan tahunan';
            rekomendasi += '\n- Hindari rokok dan alkohol';
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
                
                <div class="physical-measurements">
                    <h4>Hasil Pengukuran Fisik:</h4>
                    <ul>
                        ${beratBadan && tinggiBadan ? `<li>IMT: ${imt ? imt.toFixed(1) : '--'} (${imtStatus || 'Normal'})</li>` : ''}
                        ${lingkarPinggang ? `<li>Lingkar Pinggang: ${lingkarPinggang} cm (${obesitasSentral ? 'Obesitas sentral' : 'Normal'})</li>` : ''}
                        ${sistolik && diastolik ? `<li>Tekanan Darah: ${sistolik}/${diastolik} mmHg (${tekananDarahStatus})</li>` : ''}
                        ${gulaDarah ? `<li>Gula Darah Sewaktu: ${gulaDarah} mg/dL (${gulaDarahStatus})</li>` : ''}
                        ${kolesterol ? `<li>Kolesterol Total: ${kolesterol} mg/dL (${kolesterolStatus})</li>` : ''}
                    </ul>
                </div>
                
                <div class="recommendation">
                    <h4>Rekomendasi:</h4>
                    <p>${rekomendasi.replace(/\n/g, '<br>')}</p>
                </div>
                
                <div class="detail-factors">
                    <h4>Faktor Risiko Teridentifikasi:</h4>
                    <ul>
                        ${faktorRisiko.length > 0 ? 
                           faktorRisiko.map(f => `<li>${f}</li>`).join('') : 
                           '<li>Tidak ada faktor risiko yang signifikan</li>'}
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