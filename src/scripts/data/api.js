// src/scripts/data/api.js
import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

// Endpoint utama
const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  GET_DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`, // ✅ dipakai juga untuk unsubscribe (DELETE)
};

// ====================
// User API
// ====================
export async function registerUser({ name, email, password }) {
  const res = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal register');
  return json;
}

export async function loginUser({ email, password }) {
  const res = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login gagal');
  return json;
}

// ====================
// Story API
// ====================
export async function getAllStories() {
  const res = await fetch(ENDPOINTS.GET_ALL_STORIES, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal ambil data story');
  return json.listStory;
}

export async function getStoryDetail(id) {
  const res = await fetch(ENDPOINTS.GET_DETAIL_STORY(id), {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal ambil detail story');
  return json.story;
}

export async function addNewStory(formData) {
  const res = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal tambah story');
  return json;
}

// ====================
// Push Notification API
// ====================

// helper: konversi ArrayBuffer → Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function subscribePushNotification(subscription) {
  const payload = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth')),
    },
  };

  const res = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal subscribe push');
  return json;
}

export async function unsubscribePushNotification(subscription) {
  const payload = { endpoint: subscription.endpoint }; // ✅ hanya endpoint

  const res = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'DELETE', // ✅ harus DELETE
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal unsubscribe push');
  return json;
}
