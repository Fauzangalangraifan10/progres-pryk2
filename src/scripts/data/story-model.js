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
    const token = getAccessToken();
    if (!token) {
      throw new Error('Anda harus login terlebih dahulu');
    }

    const formData = new FormData();
    formData.append('description', storyData.description);
    formData.append('photo', storyData.photoBlob, 'story.jpg');

    if (storyData.lat && storyData.lon) {
      formData.append('lat', storyData.lat);
      formData.append('lon', storyData.lon);
    }
    
    return apiAddNewStory({ formData, token });
  }
}

export default StoryModel;
