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
      if (mainContent) {
        mainContent.focus();
      }
    });

    document.body.insertBefore(this._skipLink, this._header);
  }

  // Render header
  async renderHeader() {
    const token = getAccessToken();
    this._header.innerHTML = token ? LoggedInHeader : LoggedOutHeader;

    // Inisialisasi tombol Subscribe/Unsubscribe jika user login
    if (token) {
      this._initSubscribeButton();
    }
  }

  // Logic Subscribe/Unsubscribe
  async _initSubscribeButton() {
    const btn = document.getElementById('subscribe-btn');
    const icon = document.getElementById('subscribe-icon');
    const text = document.getElementById('subscribe-text');
    if (!btn) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.bundle.js')
        .then(() => console.log('Service Worker registered!'))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }

    // Cek status subscription awal
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      icon.textContent = '🔔';
      text.textContent = 'Unsubscribe';
    }

    btn.addEventListener('click', async () => {
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe
        await NotificationHelper.unsubscribe();
        icon.textContent = '🔔';
        text.textContent = 'Subscribe';
        alert('Berhasil unsubscribe notifikasi!');
      } else {
        // Subscribe
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
    if (this._currentPage && typeof this._currentPage.unmount === 'function') {
      this._currentPage.unmount();
    }

    const token = getAccessToken();
    const url = UrlParser.parseActiveUrlWithCombiner();

    let page;

    if (url === '/login' || url === '/register') {
      page = routes[url];
    } else if (token) {
      page = routes[url] || routes['/'];
    } else {
      page = routes['/login'];
    }

    if (page) {
      document.startViewTransition(async () => {
        this._content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      page = routes['/404'];
      document.startViewTransition(async () => {
        this._content.innerHTML = await page.render();
        await page.afterRender();
      });
    }
    
    this._currentPage = page;
    await this.renderHeader();
  }
}

export default App;
