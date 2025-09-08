// src/scripts/index.js
import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';
import App from './pages/app.js';

// Fungsi registrasi SW
async function swRegister() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.bundle.js');
      console.log('Service Worker registered!', reg);
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }
}

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

  // Register SW
  await swRegister();
});
