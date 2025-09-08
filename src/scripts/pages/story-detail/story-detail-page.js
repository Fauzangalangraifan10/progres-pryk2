// src/scripts/pages/story-detail/story-detail-page.js
import StoryDetailPresenter from './story-detail-presenter';

const StoryDetailPage = {
  async render() {
    return `
      <div class="detail-container">
        <h2>Detail Cerita</h2>
        <div id="story-detail"></div>
      </div>
    `;
  },

  async afterRender() {
    const url = window.location.hash.split('/');
    const storyId = url[url.length - 1];

    const container = document.getElementById('story-detail');
    new StoryDetailPresenter({ storyId, container });
  },
};

export default StoryDetailPage;
