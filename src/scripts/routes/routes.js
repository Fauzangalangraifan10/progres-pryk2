import HomePage from '../pages/home/home-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import LogoutPage from '../pages/auth/logout/logout-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NotFountPresenter from '../pages/notfount/notfount-presenter'; // ✅ konsisten pakai notfount

const routes = {
  '/': HomePage,
  '/add': AddPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/logout': LogoutPage,
  '/detail/:id': StoryDetailPage,
  '/saved': BookmarkPage,
  '/404': NotFountPresenter, // ✅ fallback ke NotFount
};

export default routes;
