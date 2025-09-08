// src/scripts/data/api.js
import CONFIG from '../config';

// Endpoint utama
const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  GET_DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/unsubscribe`,
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
export async function getAllStories(token) {
  const res = await fetch(ENDPOINTS.GET_ALL_STORIES, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.listStory;
}

export async function getStoryDetail({ id, token }) {
  const res = await fetch(ENDPOINTS.GET_DETAIL_STORY(id), {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.story;
}

export async function addNewStory({ formData, token }) {
  const res = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
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
  return fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    },
    body: JSON.stringify(subscription),
  });
}

export async function unsubscribePushNotification(subscription) {
  return fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    },
    body: JSON.stringify(subscription),
  });
}
