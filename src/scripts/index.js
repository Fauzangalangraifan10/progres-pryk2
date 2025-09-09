// src/scripts/index.js
import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';
import App from './pages/app.js';
import { swRegister } from './utils/index.js'; // ✅ pakai dari utils

window.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    header: document.querySelector('#app-header'),
    content: document.querySelector('#main-content'),
    drawerNavigation: document.querySelector('#navigationDrawer'),
  });

  // Render halaman saat URL hash berubah
  window.addEventListener('hashchange', () => app.renderPage());

  // Render halaman awal
  await app.renderPage();

  // Register SW hanya sekali
  await swRegister();
});
