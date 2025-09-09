// src/scripts/utils/notification-helper.js

import CONFIG from '../config';
import { subscribePushNotification, unsubscribePushNotification } from "../data/api";
import { convertBase64ToUint8Array } from "./index"; // ✅ gunakan dari utils/index.js

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
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Buat subscription baru
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
        });
      }

      // Sync ke server
      try {
        await subscribePushNotification(subscription);
        console.log('✅ Push notification berhasil disubscribe & sinkron ke server');
      } catch (apiError) {
        console.warn('⚠️ Subscribe di browser berhasil, tapi gagal kirim ke server:', apiError.message);
      }

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

      if (!subscription) {
        console.warn('ℹ️ Tidak ada subscription aktif yang bisa di-unsubscribe');
        return false;
      }

      // Hapus di browser dulu
      await subscription.unsubscribe();

      try {
        await unsubscribePushNotification(subscription);
        console.log('✅ Push notification berhasil di-unsubscribe di server & browser');
      } catch (apiError) {
        console.warn('⚠️ Unsubscribe di browser berhasil, tapi gagal di server (CORS/blocked):', apiError.message);
      }

      return true;
    } catch (error) {
      console.error('❌ Gagal unsubscribe push notification:', error);
      return false;
    }
  },
};

export default NotificationHelper;
