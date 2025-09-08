// src/scripts/pages/auth/logout/logout-page.js
import LogoutPresenter from './logout-presenter';

const LogoutPage = {
  _presenter: null,

  async render() {
    return `
      <div class="logout-container">
        <p id="logout-message">Logging out...</p>
      </div>
    `;
  },

  async afterRender() {
    this._presenter = new LogoutPresenter({ view: this });
    this._presenter.handleLogout();
  },

  showMessage(message) {
    const msgBox = document.getElementById('logout-message');
    if (msgBox) msgBox.innerText = message;
  },

  showError(error) {
    const msgBox = document.getElementById('logout-message');
    if (msgBox) msgBox.innerText = `Logout gagal: ${error}`;
  },

  redirectToLogin() {
    location.hash = '/login';
  },
};

export default LogoutPage;
