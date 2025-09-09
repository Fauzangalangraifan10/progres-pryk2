// src/scripts/pages/app.js

import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import { getAccessToken } from '../utils/auth';
import { LoggedInHeader, LoggedOutHeader } from '../templates';
import NotificationHelper from '../utils/notification-helper';

class App {
  constructor({ header, content }) {
    this._header = header;
    this._content = content;
    this._currentPage = null;

    // Skip link
    this._skipLink = document.createElement('a');
    this._skipLink.href = '#main-content';
    this._skipLink.className = 'skip-link';
    this._skipLink.textContent = 'Skip to Content';
    this._skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.focus();
    });
    document.body.insertBefore(this._skipLink, this._header);
  }

  // Render header
  async renderHeader() {
    const token = getAccessToken();
    this._header.innerHTML = token ? LoggedInHeader : LoggedOutHeader;

    // Setelah header di-render, inisialisasi hamburger dan subscribe button
    this._initHamburger();
    if (token) this._initSubscribeButton();
  }

  // Hamburger drawer
  _initHamburger() {
    const drawerButton = this._header.querySelector('.drawer-button');
    const drawer = this._header.querySelector('.navigation-drawer');
    if (!drawerButton || !drawer) return;

    // Toggle drawer saat klik tombol
    drawerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.classList.toggle('open');
    });

    // Tutup drawer saat klik link/button di dalam drawer
    const drawerLinks = drawer.querySelectorAll('a, button');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('open'));
    });

    // Tutup drawer saat klik di luar drawer
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && e.target !== drawerButton) {
        drawer.classList.remove('open');
      }
    });

    // Tutup drawer saat resize ke desktop (>992px)
    const resizeHandler = () => {
      if (window.innerWidth > 992) {
        drawer.classList.remove('open');
      }
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
  }

  // Logic Subscribe/Unsubscribe
  async _initSubscribeButton() {
    const btn = this._header.querySelector('#subscribe-btn');
    const icon = this._header.querySelector('#subscribe-icon');
    const text = this._header.querySelector('#subscribe-text');
    if (!btn) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.bundle.js')
        .then(() => console.log('Service Worker registered!'))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      icon.textContent = '🔔';
      text.textContent = 'Unsubscribe';
    }

    btn.addEventListener('click', async () => {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await NotificationHelper.unsubscribe();
        icon.textContent = '🔔';
        text.textContent = 'Subscribe';
        alert('Berhasil unsubscribe notifikasi!');
      } else {
        const granted = await NotificationHelper.requestPermission();
        if (!granted) return alert('Permission not granted!');
        await NotificationHelper.subscribe();
        icon.textContent = '🔔';
        text.textContent = 'Unsubscribe';
        alert('Berhasil subscribe notifikasi!');
      }
    });
  }

  // Render page sesuai route
  async renderPage() {
    // PENTING: Pindahkan renderHeader() ke awal
    await this.renderHeader(); 

    if (this._currentPage && typeof this._currentPage.unmount === 'function') {
      this._currentPage.unmount();
    }

    const token = getAccessToken();
    const url = UrlParser.parseActiveUrlWithCombiner();
    let page;

    if (url === '/login' || url === '/register') page = routes[url];
    else if (token) page = routes[url] || routes['/'];
    else page = routes['/login'];

    if (!page) page = routes['/404'];

    document.startViewTransition(async () => {
      this._content.innerHTML = await page.render();
      if (page.afterRender) await page.afterRender();
    });

    this._currentPage = page;
  }
}

export default App;