import { getAccessToken, saveAccessToken } from '../utils/auth';
import { 
  getAllStories as apiGetAllStories,
  addNewStory as apiAddNewStory,
  loginUser as apiLoginUser
} from './api';

class StoryModel {
  static async login(data) {
    const response = await apiLoginUser(data);
    if (response && response.loginResult && response.loginResult.token) {
      saveAccessToken(response.loginResult.token);
      return response;
    }
    throw new Error('Login failed. Please check your credentials.');
  }

  static async getStories() {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Anda harus login untuk melihat cerita.');
    }
    return apiGetAllStories(token);
  }

  static async addStory(storyData) {
    // `storyData` di sini adalah objek FormData yang sudah jadi dari presenter
    const token = getAccessToken();
    if (!token) {
      throw new Error('Anda harus login terlebih dahulu');
    }
    return apiAddNewStory(storyData); 
  }

  // Tambahan untuk halaman Not Found
  static getNotFountMessage() {
    return {
      title: '404 - Halaman Tidak Ditemukan',
      description: 'Alamat yang Anda tuju tidak tersedia.',
      homeLink: '#/',
    };
  }
}

export default StoryModel;
