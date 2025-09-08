import { getStoryDetail } from '../../data/api';
import { StoryDetailTemplate } from '../../templates';
import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'saved-stories';

class StoryDetailPresenter {
  constructor({ storyId, container }) {
    this._storyId = storyId;
    this._container = container;

    this._init();
  }

  async _init() {
    try {
      const token = localStorage.getItem('accessToken');
      const story = await getStoryDetail({ id: this._storyId, token });

      this._renderStory(story);
      this._initSaveButton(story);
    } catch (err) {
      this._container.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  _renderStory(story) {
    this._container.innerHTML = StoryDetailTemplate(story);
  }

  async _openDatabase() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  _initSaveButton(story) {
    const saveBtn = this._container.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this._handleSave(story);
      });
    }
  }

  async _handleSave(story) {
    const db = await this._openDatabase();
    const existing = await db.get(STORE_NAME, story.id);

    if (existing) {
      await db.delete(STORE_NAME, story.id);
      alert('Cerita dihapus dari daftar tersimpan.');
    } else {
      await db.put(STORE_NAME, story);
      alert('Cerita berhasil disimpan!');
    }
  }
}

export default StoryDetailPresenter;
