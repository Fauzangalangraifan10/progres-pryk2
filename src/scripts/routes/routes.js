// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import LogoutPage from '../pages/auth/logout/logout-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';

const routes = {
  '/': HomePage,
  '/add': AddPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/logout': LogoutPage,
  '/detail/:id': StoryDetailPage,
  '/saved': BookmarkPage,
  '/404': {
    async render() {
      return `<h1>404 Halaman Tidak Ditemukan</h1>`;
    },
    async afterRender() {},
  },
};

export default routes;
