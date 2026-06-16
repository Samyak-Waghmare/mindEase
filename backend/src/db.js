// Lightweight file-based datastore (JSON on disk). Zero native dependencies.
// Stores journal entries per user: { [userId]: [ {id, date, mood, score, excerpt} ] }
// NOTE: we deliberately store only a short, non-identifying excerpt + the mood/score for
// the trend chart — the full raw entry is not persisted server-side, for privacy.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DB_FILE = join(DATA_DIR, 'mindease.json');

function ensure() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '{}');
}
function readAll() {
  ensure();
  try { return JSON.parse(readFileSync(DB_FILE, 'utf-8')) || {}; } catch { return {}; }
}
function writeAll(data) {
  ensure();
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function addEntry(userId, { mood, score, excerpt }) {
  const all = readAll();
  if (!all[userId]) all[userId] = [];
  const entry = {
    id: Date.now().toString(36),
    date: new Date().toISOString(),
    mood,
    score,
    excerpt: (excerpt || '').slice(0, 120),
  };
  all[userId].push(entry);
  // keep the most recent 60 entries per user
  all[userId] = all[userId].slice(-60);
  writeAll(all);
  return entry;
}

export function getEntries(userId) {
  const all = readAll();
  return all[userId] || [];
}

// Mood scores over the last N entries (oldest -> newest) for the trend chart.
export function getMoodTrend(userId, limit = 14) {
  const entries = getEntries(userId);
  return entries.slice(-limit).map((e) => ({
    id: e.id,
    date: e.date,
    label: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: e.score,
    mood: e.mood,
  }));
}

export function getStats(userId) {
  const all = readAll();
  return all[`stats:${userId}`] || { coins: 0, level: 1 };
}

export function updateStats(userId, deltaCoins) {
  const all = readAll();
  const key = `stats:${userId}`;
  const stats = all[key] || { coins: 0, level: 1 };
  stats.coins += deltaCoins;
  stats.level = Math.floor(stats.coins / 50) + 1;
  all[key] = stats;
  writeAll(all);
  return stats;
}
