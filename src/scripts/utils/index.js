// src/scripts/utils/index.js

// Format tanggal
export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

// Delay/sleep
export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Konversi VAPID key (Base64 → Uint8Array)
export function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// Register Service Worker (Pusat)
export async function swRegister() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.bundle.js');
      console.log('✅ Service Worker registered!', reg);
      return reg;
    } catch (err) {
      console.error('❌ Service Worker registration failed:', err);
    }
  }
  return null;
}
