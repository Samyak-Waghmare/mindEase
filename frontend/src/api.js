// Frontend API client for MindEase. Talks to the Express backend.
// In dev, Vite proxies /api -> http://localhost:3002 (see vite.config.js).
const BASE = import.meta.env.VITE_API_BASE || '';

function getUserId() {
  let id = localStorage.getItem('mindease_user_id');
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `u_${Date.now()}_${Math.random()}`;
    localStorage.setItem('mindease_user_id', id);
  }
  return id;
}
function headers() {
  return { 'Content-Type': 'application/json', 'x-user-id': getUserId() };
}

// payload: { text } OR { image (base64, no data: prefix), mimeType }
export async function analyzeEntry(payload) {
  const res = await fetch(`${BASE}/api/analyze`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `API /analyze failed: ${res.status}`;
    try { const e = await res.json(); if (e.error) msg = e.error; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchEntries() {
  const res = await fetch(`${BASE}/api/entries`, { headers: headers() });
  if (!res.ok) throw new Error(`API /entries failed: ${res.status}`);
  return res.json();
}

export async function fetchResources() {
  const res = await fetch(`${BASE}/api/resources`);
  if (!res.ok) throw new Error(`API /resources failed: ${res.status}`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE}/api/stats`, { headers: headers() });
  if (!res.ok) throw new Error(`API /stats failed: ${res.status}`);
  return res.json();
}

export async function addCoins(coins) {
  const res = await fetch(`${BASE}/api/stats/add`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ coins }),
  });
  if (!res.ok) throw new Error(`API /stats/add failed: ${res.status}`);
  return res.json();
}
