import StoryModel from '../../data/story-model';
import NotFountPage from './notfount-page';

const NotFountPresenter = {
  async render() {
    return NotFountPage.render();
  },

  async afterRender() {
    return NotFountPage.afterRender();
  },
};

export default NotFountPresenter;
