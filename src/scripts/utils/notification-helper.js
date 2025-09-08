// src/scripts/utils/notification-helper.js

import CONFIG from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

const NotificationHelper = {
  // Cek apakah browser mendukung push notification
  isAvailable() {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  },

  // Cek status permission
  isGranted() {
    return Notification.permission === 'granted';
  },

  // Minta permission ke user
  async requestPermission() {
    if (!this.isAvailable()) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  // Subscribe push notification
  async subscribe() {
    if (!this.isAvailable()) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) return existingSubscription;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
      });

      await subscribePushNotification(subscription);
      console.log('✅ Push notification berhasil disubscribe');
      return subscription;
    } catch (error) {
      console.error('❌ Gagal subscribe push notification:', error);
      return null;
    }
  },

  // Unsubscribe push notification
  async unsubscribe() {
    if (!this.isAvailable()) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await unsubscribePushNotification(subscription);
        console.log('✅ Push notification berhasil di-unsubscribe');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Gagal unsubscribe push notification:', error);
      return false;
    }
  },
};

// Util: konversi VAPID key dari Base64 ke Uint8Array
function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default NotificationHelper;