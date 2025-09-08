// src/scripts/pages/home/home-presenter.js (Setelah diperbaiki)

import { getAllStories } from '../../data/api';
import { getAccessToken } from '../../utils/auth'; // 1. Impor fungsi getAccessToken

class HomePagePresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }
  
  async showStoriesOnPage() {
    this._view.showLoading();
    try {
      // 2. Ambil token dari local storage/session
      const token = getAccessToken(); 
      if (!token) {
        // Jika token tidak ada, tampilkan pesan error atau arahkan ke login
        throw new Error('Anda harus login untuk melihat cerita.');
      }
      
      // 3. Kirim token saat memanggil getAllStories
      const stories = await getAllStories(token); 
      
      this._view.renderStories(stories);
    } catch (error) {
      this._view.renderError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default HomePagePresenter;