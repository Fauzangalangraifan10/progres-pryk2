// src/scripts/pages/bookmark/bookmark-presenter.js
import { StoryDatabase } from '../../data/database';

class BookmarkPresenter {
  constructor({ container, template }) {
    this._container = container;
    this._template = template;
    this._renderSavedStories();
  }

  async _renderSavedStories() {
    const stories = await StoryDatabase.getAllStories();

    if (!stories || stories.length === 0) {
      this._container.innerHTML = `<p>Kamu belum menyimpan cerita apa pun.</p>`;
      return;
    }

    this._container.innerHTML = stories
      .map((story) => this._template(story))
      .join('');

    // tombol hapus
    this._container.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const storyId = e.target.dataset.id;
        await StoryDatabase.deleteStory(storyId);
        this._renderSavedStories(); // refresh list
      });
    });
  }
}

export default BookmarkPresenter;
