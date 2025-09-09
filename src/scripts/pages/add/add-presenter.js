// src/scripts/pages/add/add-presenter.js

import StoryModel from '../../data/story-model';

class AddPagePresenter {
  constructor({ view }) {
    this._view = view;
  }

  onMapClick(latlng) {
    this._view.updateLocationOnMap(latlng);
  }

  async submitStory(data) {
    if (!data.description || !data.photoIsSet) {
      this._view.showValidationError('Deskripsi dan foto tidak boleh kosong!');
      return;
    }

    // ✅ SOLUSI: Gunakan FormData sesuai saran reviewer
    try {
      this._view.showLoading();

      // Buat objek FormData
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('photo', data.photoBlob, 'photo.jpg'); // photoBlob adalah file gambar
      
      // Tambahkan lat dan lon jika ada
      if (data.lat && data.lon) {
        formData.append('lat', data.lat);
        formData.append('lon', data.lon);
      }

      // Kirim formData ke model
      await StoryModel.addStory(formData);

      this._view.showSuccessAndRedirect();
    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default AddPagePresenter;