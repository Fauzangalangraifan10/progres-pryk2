// src/scripts/pages/add/add-page.js

import L from 'leaflet';
import StorySource from '../../data/story-model';
import AddPagePresenter from './add-presenter';

// Perbaikan ikon Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const AddPage = {
  _stream: null,
  _map: null,
  _marker: null,

  async render() {
    return `
    <form id="add-story-form" class="form-container">
      <h2>Tambah Cerita Baru</h2>

      <div class="form-group">
        <label for="story-description">Deskripsi Cerita:</label>
        <textarea id="story-description" name="description" required class="input-textarea"></textarea>
      </div>

      <div class="form-group camera-section">
        <h3>Ambil Gambar</h3>
        <video id="camera-feed" class="camera-video" autoplay></video>
        <button type="button" class="btn btn-primary" id="capture-btn">Ambil Gambar</button>
        <canvas id="photo-canvas" class="photo-canvas"></canvas>
        <img id="photo-preview" class="photo-preview" alt="Pratinjau Foto" />
      </div>

      <div class="form-group map-section">
        <h3>Pilih Lokasi</h3>
        <div id="map-picker" class="map-picker"></div>
        <input type="hidden" id="latitude" name="lat">
        <input type="hidden" id="longitude" name="lon">
      </div>

      <div class="form-group buttons-section">
        <button type="submit" class="btn btn-primary">Unggah Cerita</button>
        <button type="button" class="btn btn-secondary" id="cancel-btn">Batal</button>
      </div>
    </form>
    
    <!-- Elemen untuk loading dan pesan -->
    <div id="loading-overlay" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    `;
  },

  async afterRender() {
    const presenter = new AddPagePresenter({
      view: this,
      model: StorySource,
    });

    this.initCamera();
    this.initMapPicker(presenter);

    // Event: capture photo
    document.getElementById('capture-btn').addEventListener('click', () => {
      this.capturePhoto();
    });


    
    // Event: submit form
    document.getElementById('add-story-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      // Mengambil data form setelah mendapatkan blob
      const formData = await this.getFormData();
      await presenter.submitStory(formData);
    });

    // Event: cancel → balik ke Home
    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.stopCameraStream();
      window.location.hash = '#/';
    });
    
    // Event: menutup kotak pesan
    document.getElementById('message-close-btn').addEventListener('click', () => {
      this._hideMessageBox();
    });

    // Matikan kamera jika pindah halaman
    window.addEventListener('hashchange', () => this.stopCameraStream(), {
      once: true,
    });
  },

  unmount() {
    this.stopCameraStream();
    console.log('AddPage unmounted, camera should be off.');
  },

  
  initCamera() {
    const video = document.getElementById('camera-feed');
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      this._stream = stream;
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error('Error accessing camera: ', err);
      // Menggunakan pesan box daripada alert
      this.showError('Tidak bisa mengakses kamera. Silakan berikan izin.');
    });
  },

  capturePhoto() {
    const canvas = document.getElementById('photo-canvas');
    const video = document.getElementById('camera-feed');
    const preview = document.getElementById('photo-preview');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    preview.src = canvas.toDataURL('image/jpeg');
    preview.style.display = 'block';
    video.style.display = 'none';

    this.stopCameraStream();
  },

  stopCameraStream() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
      console.log('Camera stream stopped.');
    }
  },

  initMapPicker(presenter) {
    this._map = L.map('map-picker').setView([-6.2, 106.816666], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this._map);

    this._map.on('click', (e) => {
      presenter.onMapClick(e.latlng);
    });
  },

  updateLocationOnMap(latlng) {
    if (this._marker) {
      this._marker.setLatLng(latlng);
    } else {
      this._marker = L.marker(latlng).addTo(this._map);
    }
    this._map.setView(latlng, this._map.getZoom());
    document.getElementById('latitude').value = latlng.lat;
    document.getElementById('longitude').value = latlng.lng;
  },

  // === Perbaikan: Mengembalikan Blob secara langsung ===
  async getFormData() {
    const description = document.getElementById('story-description').value;
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    const canvas = document.getElementById('photo-canvas');
    
    let photoBlob = null;
    if (canvas.toDataURL() !== document.createElement('canvas').toDataURL()) {
        photoBlob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg');
        });
    }

    return {
      description,
      lat,
      lon,
      photoBlob,
      photoIsSet: !!photoBlob
    };
  },

  // === Perbaikan: Metode Loading dan Pesan ===

  showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }
  },

  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  },

  _showMessageBox(message) {
    // Menghapus logika untuk menampilkan pesan box
    console.log(message);
  },

  _hideMessageBox() {
    // Menghapus logika untuk menyembunyikan pesan box
  },

  showValidationError(message) {
    // Hanya log kesalahan, tidak menampilkan pesan box
    console.error(message);
  },
  
  showSuccessAndRedirect() {
    // Langsung redirect ke halaman Home setelah berhasil
    window.location.hash = '#/';
  },
  
  showError(message) {
    // Menampilkan pesan error di konsol
    console.error(`Terjadi kesalahan: ${message}`);
  },
};

export default AddPage;
