import { Workbox } from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  // Menggunakan Workbox untuk mendaftarkan file hasil build `sw.bundle.js`
  const wb = new Workbox('sw.bundle.js');

  try {
    await wb.register();
    console.log('Service worker registered successfully.');
  } catch (error) {
    console.error('Failed to register service worker:', error);
  }
};

export default swRegister;
