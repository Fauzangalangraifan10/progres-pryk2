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

    try {
      this._view.showLoading();
      await StoryModel.addStory({
        description: data.description,
        photoBlob: data.photoBlob,
        lat: data.lat,
        lon: data.lon,
      });

      // PERBAIKAN: Setelah berhasil, langsung panggil metode redirect tanpa argumen
      this._view.showSuccessAndRedirect();
    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default AddPagePresenter;