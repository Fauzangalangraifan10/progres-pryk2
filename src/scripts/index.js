// src/scripts/index.js

import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';
import App from './pages/app.js';
import swRegister from './utils/sw-register';

window.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    header: document.querySelector('#app-header'),
    content: document.querySelector('#main-content'),
    drawerNavigation: document.querySelector('#navigationDrawer'),
  });

  // Render halaman setiap kali URL hash berubah
  window.addEventListener('hashchange', () => {
    app.renderPage();
  });

  // Muat halaman awal dan daftarkan service worker
  await app.renderPage();
  await swRegister();
});