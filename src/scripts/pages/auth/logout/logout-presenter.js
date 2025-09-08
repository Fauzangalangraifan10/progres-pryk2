// src/scripts/pages/auth/logout/logout-presenter.js
import { clearAccessToken } from '../../../utils/auth';

class LogoutPresenter {
  constructor({ view }) {
    this._view = view;
  }

  async handleLogout() {
    try {
      clearAccessToken();
      this._view.showMessage('Anda berhasil logout.');
      this._view.redirectToLogin();
    } catch (error) {
      this._view.showError(error.message);
    }
  }
}

export default LogoutPresenter;
