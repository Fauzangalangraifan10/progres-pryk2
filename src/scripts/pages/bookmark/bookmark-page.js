// src/scripts/pages/bookmark/bookmark-page.js
import BookmarkPresenter from './bookmark-presenter';

const StoryItemTemplate = (story) => `
  <div class="saved-story">
    <img src="${story.photoUrl}" alt="${story.name}" />
    <h3>${story.name}</h3>
    <p>${story.description}</p>
    <button class="btn btn-danger remove-btn" data-id="${story.id}">🗑️ Remove</button>
  </div>
`;

const BookmarkPage = {
  async render() {
    return `
      <div class="bookmark-container">
        <h2>📑 Saved Stories</h2>
        <div id="saved-stories"></div>
      </div>
    `;
  },

  async afterRender() {
    const container = document.getElementById('saved-stories');
    new BookmarkPresenter({ container, template: StoryItemTemplate });
  },
};

export default BookmarkPage;
