import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

// Endpoint utama
const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  GET_DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/unsubscribe`,
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
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function loginUser({ email, password }) {
  const res = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
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
  if (!res.ok) throw new Error(json.message);
  return json.listStory;
}

export async function getStoryDetail(id) {
  const res = await fetch(ENDPOINTS.GET_DETAIL_STORY(id), {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.story;
}

export async function addNewStory(formData) {
  const res = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

// ====================
// Push Notification API
// ====================
export async function subscribePushNotification(subscription) {
  // DIPERBAIKI: Menambahkan 'res' dan pengecekan 'res.ok'
  const res = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(subscription),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function unsubscribePushNotification(subscription) {
  // DIPERBAIKI: Menambahkan 'res' dan pengecekan 'res.ok'
  const res = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(subscription),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}
